import { useState } from "react";
import { motion } from "framer-motion";
import DexExchange from "./components/DexExchange";

export default function ShadowMarketWorld() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 overflow-hidden">
      {/* Preview Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b-2 border-amber-500/30 backdrop-blur-sm"
      >
        <div className="max-w-[1920px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚧</span>
            <div>
              <h3 className="text-amber-400 font-bold text-lg">Preview Mode - Chart Tools In Development</h3>
              <p className="text-amber-300/70 text-sm">
                Professional trading analysis tools are being redesigned for optimal usability. Explore the interface and prepare for what's coming.
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40">
            <span className="text-amber-300 font-semibold text-sm">Coming Q1 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Professional Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Subtle Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-500/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-28 pb-6 px-8 border-b border-slate-700/50"
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-sky-400 bg-clip-text text-transparent">
              Shadow Market
            </h1>
            <p className="text-slate-400 mt-1">Professional Trading Platform</p>
          </div>

          {/* Trading Pair Selector */}
          <div className="flex items-center gap-4">
            {["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"].map((pair) => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPair === pair
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {pair}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main DEX Interface */}
      <div className="relative z-10 p-8">
        <DexExchange selectedPair={selectedPair} />
      </div>
    </div>
  );
}
