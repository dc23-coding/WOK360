import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TradeHistory({ selectedPair }) {
  const [trades, setTrades] = useState([]);

  // Generate mock trade history
  useEffect(() => {
    const basePrices = {
      "BTC/USDT": 43250,
      "ETH/USDT": 2280,
      "SOL/USDT": 98,
      "AVAX/USDT": 36,
    };

    const generateTrade = () => {
      const basePrice = basePrices[selectedPair];
      const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.001);
      const amount = Math.random() * 0.5 + 0.01;
      const isBuy = Math.random() > 0.5;
      
      return {
        id: Date.now() + Math.random(),
        price,
        amount,
        total: price * amount,
        type: isBuy ? "buy" : "sell",
        time: new Date(),
      };
    };

    // Initial trades
    const initialTrades = Array.from({ length: 20 }, () => generateTrade());
    setTrades(initialTrades);

    // Add new trade periodically
    const interval = setInterval(() => {
      setTrades(prev => [generateTrade(), ...prev.slice(0, 19)]);
    }, 4000);

    return () => clearInterval(interval);
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
      className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between">
        <h3 className="text-white font-semibold">Recent Trades</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-purple-300/70">Live</span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-purple-300/70 border-b border-purple-500/10">
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
