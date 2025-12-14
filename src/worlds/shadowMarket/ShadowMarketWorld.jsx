import { useState } from "react";
import { motion } from "framer-motion";
import DexExchange from "./components/DexExchange";

export default function ShadowMarketWorld() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
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
        className="relative z-10 pt-8 pb-6 px-8 border-b border-purple-500/20"
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Shadow Market
            </h1>
            <p className="text-purple-300/70 mt-1">Decentralized Exchange</p>
          </div>

          {/* Trading Pair Selector */}
          <div className="flex items-center gap-4">
            {["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"].map((pair) => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedPair === pair
                    ? "bg-purple-500/30 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : "bg-white/5 text-purple-400/70 hover:bg-white/10"
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
