import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TradingChart from "./TradingChart";
import WalletConnect from "./WalletConnect";
import OrderBook from "./OrderBook";
import TradeHistory from "./TradeHistory";

export default function DexExchange({ selectedPair }) {
  const [orderType, setOrderType] = useState("limit"); // limit, market, stop
  const [tradeMode, setTradeMode] = useState("buy"); // buy, sell
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  // Mock real-time price updates
  useEffect(() => {
    const mockPrices = {
      "BTC/USDT": 43250.50,
      "ETH/USDT": 2280.75,
      "SOL/USDT": 98.45,
      "AVAX/USDT": 36.80,
    };
    
    setCurrentPrice(mockPrices[selectedPair]);
    
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        if (!prev) return mockPrices[selectedPair];
        const change = (Math.random() - 0.5) * (prev * 0.002);
        return prev + change;
      });
    }, 2000);

    return () => clearInterval(interval);
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
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-end gap-6">
              <div>
                <div className="text-purple-400/70 text-sm mb-1">{selectedPair}</div>
                <div className="text-4xl font-bold text-white">
                  ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="flex gap-4 pb-1">
                <div>
                  <div className="text-purple-400/50 text-xs">24h Change</div>
                  <div className="text-green-400 font-semibold">+2.45%</div>
                </div>
                <div>
                  <div className="text-purple-400/50 text-xs">24h High</div>
                  <div className="text-white/80 font-semibold">
                    ${currentPrice ? (currentPrice * 1.03).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0"}
                  </div>
                </div>
                <div>
                  <div className="text-purple-400/50 text-xs">24h Low</div>
                  <div className="text-white/80 font-semibold">
                    ${currentPrice ? (currentPrice * 0.97).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0"}
                  </div>
                </div>
                <div>
                  <div className="text-purple-400/50 text-xs">24h Volume</div>
                  <div className="text-white/80 font-semibold">1.2B</div>
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
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Buy/Sell Toggle */}
              <button
                onClick={() => setTradeMode("buy")}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  tradeMode === "buy"
                    ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeMode("sell")}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  tradeMode === "sell"
                    ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
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
                      ? "bg-purple-500/30 text-purple-200"
                      : "bg-white/5 text-white/40 hover:bg-white/10"
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
                  <label className="text-purple-300/70 text-sm mb-2 block">
                    Price (USDT)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              )}

              <div>
                <label className="text-purple-300/70 text-sm mb-2 block">
                  Amount ({selectedPair.split("/")[0]})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {["25%", "50%", "75%", "100%"].map((percent) => (
                  <button
                    key={percent}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-purple-300/70 text-sm rounded-lg transition-all"
                  >
                    {percent}
                  </button>
                ))}
              </div>

              {/* Total Display */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300/70">Total</span>
                  <span className="text-white font-semibold">
                    {amount && (orderType === "market" ? currentPrice : price)
                      ? (parseFloat(amount) * parseFloat(orderType === "market" ? currentPrice : price)).toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : "0.00"} USDT
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-300/50">Fee (0.1%)</span>
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
