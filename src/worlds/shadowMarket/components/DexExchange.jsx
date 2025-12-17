import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TradingChart from "./TradingChart";
import WalletConnect from "./WalletConnect";
import OrderBook from "./OrderBook";
import TradeHistory from "./TradeHistory";
import { fetchTicker, CoinbaseWebSocket } from "../../../lib/coinbaseMarketData";

export default function DexExchange({ selectedPair }) {
  const [orderType, setOrderType] = useState("limit"); // limit, market, stop
  const [tradeMode, setTradeMode] = useState("buy"); // buy, sell
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [ticker, setTicker] = useState(null);

  // Fetch real-time price from Coinbase
  useEffect(() => {
    let ws = null;

    const initializePriceData = async () => {
      // Initial fetch
      const tickerData = await fetchTicker(selectedPair);
      if (tickerData) {
        setCurrentPrice(tickerData.price);
        setTicker(tickerData);
      }

      // Setup WebSocket for real-time updates
      ws = new CoinbaseWebSocket([selectedPair], ['ticker']);
      
      ws.on('ticker', (data) => {
        if (data.type === 'ticker' && data.product_id === selectedPair.replace('/', '-')) {
          const price = parseFloat(data.price);
          if (!isNaN(price)) {
            setCurrentPrice(price);
            setTicker(prev => ({
              ...prev,
              price,
              volume: parseFloat(data.volume_24h) || prev?.volume,
              bid: parseFloat(data.best_bid) || prev?.bid,
              ask: parseFloat(data.best_ask) || prev?.ask,
            }));
          }
        }
      });
      
      ws.connect();
    };

    initializePriceData();

    return () => {
      if (ws) ws.disconnect();
    };
  }, [selectedPair]);

  const handleTrade = () => {
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || (orderType === "limit" && !price)) {
      alert("Please fill in all required fields");
      return;
    }

    // Mock trade execution
    console.log("Trade executed:", {
      pair: selectedPair,
      type: orderType,
      mode: tradeMode,
      amount,
      price: orderType === "market" ? currentPrice : price,
    });

    alert(`${tradeMode.toUpperCase()} order placed successfully!`);
    setAmount("");
    setPrice("");
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Wallet Connection */}
      <div className="mb-6">
        <WalletConnect
          connected={walletConnected}
          address={walletAddress}
          onConnect={(address) => {
            setWalletConnected(true);
            setWalletAddress(address);
          }}
          onDisconnect={() => {
            setWalletConnected(false);
            setWalletAddress(null);
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* Left Column: Chart + Trading Panel */}
        <div className="space-y-6">
          {/* Price Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-end gap-6">
              <div>
                <div className="text-slate-400 text-sm mb-1">{selectedPair}</div>
                <div className="text-4xl font-bold text-white">
                  ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "Loading..."}
                </div>
              </div>
              <div className="flex gap-4 pb-1">
                <div>
                  <div className="text-slate-500 text-xs">24h Change</div>
                  <div className="text-green-400 font-semibold">
                    {ticker && ticker.high && ticker.low
                      ? `${(((currentPrice - ticker.low) / ticker.low) * 100).toFixed(2)}%`
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">24h High</div>
                  <div className="text-white/80 font-semibold">
                    ${ticker?.high?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">24h Low</div>
                  <div className="text-white/80 font-semibold">
                    ${ticker?.low?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">24h Volume</div>
                  <div className="text-white/80 font-semibold">
                    {ticker?.volume ? `${(ticker.volume / 1000000).toFixed(2)}M` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trading Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TradingChart selectedPair={selectedPair} currentPrice={currentPrice} />
          </motion.div>

          {/* Trading Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Buy/Sell Toggle */}
              <button
                onClick={() => setTradeMode("buy")}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  tradeMode === "buy"
                    ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeMode("sell")}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  tradeMode === "sell"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Order Type Selector */}
            <div className="flex gap-2 mb-6">
              {["limit", "market", "stop"].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    orderType === type
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                      : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {orderType !== "market" && (
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Price (USDT)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Amount ({selectedPair.split("/")[0]})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-sm rounded-lg border border-slate-700/50 transition-all"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              {/* Total Display */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Total</span>
                  <span className="text-white font-semibold">
                    {amount && (orderType === "market" ? currentPrice : price)
                      ? (parseFloat(amount) * parseFloat(orderType === "market" ? currentPrice : price)).toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : "0.00"} USDT
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Fee (0.1%)</span>
                  <span className="text-white/60">
                    ~{amount && (orderType === "market" ? currentPrice : price)
                      ? (parseFloat(amount) * parseFloat(orderType === "market" ? currentPrice : price) * 0.001).toFixed(2)
                      : "0.00"} USDT
                  </span>
                </div>
              </div>

              {/* Trade Button */}
              <button
                onClick={handleTrade}
                disabled={!walletConnected}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  tradeMode === "buy"
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {walletConnected
                  ? `${tradeMode === "buy" ? "Buy" : "Sell"} ${selectedPair.split("/")[0]}`
                  : "Connect Wallet to Trade"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Order Book + Trade History */}
        <div className="space-y-6">
          <OrderBook selectedPair={selectedPair} currentPrice={currentPrice} />
          <TradeHistory selectedPair={selectedPair} />
        </div>
      </div>
    </div>
  );
}
