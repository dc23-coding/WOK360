import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTrades, CoinbaseWebSocket } from "../../../lib/coinbaseMarketData";

export default function TradeHistory({ selectedPair }) {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real trade history from Coinbase
  useEffect(() => {
    let ws = null;

    const loadInitialTrades = async () => {
      const tradeData = await fetchTrades(selectedPair, 20);
      if (tradeData && tradeData.length > 0) {
        setTrades(tradeData);
        setIsLoading(false);
      }

      // Setup WebSocket for real-time trade updates
      ws = new CoinbaseWebSocket([selectedPair], ['matches']);
      
      ws.on('matches', (data) => {
        if (data.type === 'match' && data.product_id === selectedPair.replace('/', '-')) {
          const newTrade = {
            id: data.trade_id,
            price: parseFloat(data.price),
            amount: parseFloat(data.size),
            total: parseFloat(data.price) * parseFloat(data.size),
            type: data.side === 'buy' ? 'buy' : 'sell',
            time: new Date(data.time),
          };
          
          setTrades(prev => [newTrade, ...prev.slice(0, 19)]);
        }
      });
      
      ws.connect();
    };

    loadInitialTrades();

    return () => {
      if (ws) ws.disconnect();
    };
  }, [selectedPair]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      second: "2-digit",
      hour12: false 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-white font-semibold">Recent Trades</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-slate-400">Live</span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-slate-400 border-b border-slate-700/30">
        <div>Price (USDT)</div>
        <div className="text-right">Amount ({selectedPair.split("/")[0]})</div>
        <div className="text-right">Time</div>
      </div>

      {/* Trade List */}
      <div className="max-h-[400px] overflow-y-auto">
        {trades.map((trade) => (
          <motion.div
            key={trade.id}
            initial={{ backgroundColor: trade.type === "buy" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)" }}
            animate={{ backgroundColor: "transparent" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-3 gap-2 py-2 px-3 text-xs font-mono hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className={trade.type === "buy" ? "text-green-400" : "text-red-400"}>
              {trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-white/80 text-right">
              {trade.amount.toFixed(4)}
            </div>
            <div className="text-white/60 text-right">
              {formatTime(trade.time)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="px-4 py-3 border-t border-purple-500/20">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-purple-300/70 mb-1">24h Trades</div>
            <div className="text-white font-semibold">12,453</div>
          </div>
          <div>
            <div className="text-purple-300/70 mb-1">Avg Price</div>
            <div className="text-white font-semibold">
              ${trades.length > 0 
                ? (trades.reduce((sum, t) => sum + t.price, 0) / trades.length).toLocaleString(undefined, { minimumFractionDigits: 2 })
                : "0.00"
              }
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
