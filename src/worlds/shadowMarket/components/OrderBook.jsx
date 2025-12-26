import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchOrderBook } from "../../../lib/coinbaseMarketData";

export default function OrderBook({ selectedPair, currentPrice }) {
  const [orders, setOrders] = useState({ bids: [], asks: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real order book data from Coinbase
  useEffect(() => {
    const loadOrderBook = async () => {
      const data = await fetchOrderBook(selectedPair);
      if (data && (data.bids.length > 0 || data.asks.length > 0)) {
        setOrders({
          bids: data.bids,
          asks: data.asks.reverse(), // Display asks from high to low
        });
        setIsLoading(false);
      }
    };

    loadOrderBook();
    const intervalId = setInterval(loadOrderBook, 3000);
    return () => clearInterval(intervalId);
  }, [selectedPair]);

  const renderOrderRow = (order, type) => {
    const percentage = (order.amount / 3) * 100;
    
    return (
      <motion.div
        key={order.price}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative grid grid-cols-3 gap-2 py-1.5 px-3 text-xs font-mono hover:bg-white/5 cursor-pointer transition-colors"
      >
        {/* Background bar */}
        <div
          className={`absolute right-0 top-0 bottom-0 ${
            type === "bid" ? "bg-green-500/10" : "bg-red-500/10"
          }`}
          style={{ width: `${percentage}%` }}
        />

        <div className={`relative z-10 ${type === "bid" ? "text-green-400" : "text-red-400"}`}>
          {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="relative z-10 text-white/80 text-right">
          {order.amount.toFixed(4)}
        </div>
        <div className="relative z-10 text-white/60 text-right">
          {order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h3 className="text-white font-semibold">Order Book</h3>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-slate-400 border-b border-slate-700/30">
        <div>Price (USDT)</div>
        <div className="text-right">Amount ({selectedPair.split("/")[0]})</div>
        <div className="text-right">Total (USDT)</div>
      </div>

      {/* Ask Orders (Sell) */}
      <div className="max-h-[200px] overflow-y-auto">
        {orders.asks.map((order) => renderOrderRow(order, "ask"))}
      </div>

      {/* Current Price */}
      {currentPrice && (
        <div className="py-3 px-3 bg-purple-500/10 border-y border-purple-500/20">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs text-green-400">↗ +0.25%</span>
          </div>
          <div className="text-xs text-purple-300/70 mt-0.5">
            ≈ ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
        </div>
      )}

      {/* Bid Orders (Buy) */}
      <div className="max-h-[200px] overflow-y-auto">
        {orders.bids.map((order) => renderOrderRow(order, "bid"))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-t border-purple-500/20 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-purple-300/70 mb-1">Bid Volume</div>
          <div className="text-green-400 font-semibold">
            {orders.bids.reduce((sum, o) => sum + o.amount, 0).toFixed(2)} {selectedPair.split("/")[0]}
          </div>
        </div>
        <div>
          <div className="text-purple-300/70 mb-1">Ask Volume</div>
          <div className="text-red-400 font-semibold">
            {orders.asks.reduce((sum, o) => sum + o.amount, 0).toFixed(2)} {selectedPair.split("/")[0]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
