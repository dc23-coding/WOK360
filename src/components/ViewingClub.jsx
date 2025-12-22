// src/components/ViewingClub.jsx
// Club Hollywood - Cinema-style presence experience with metrics & reactions
// See GUARDRAILS.md for behavioral rules
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VibePlayer from "./VibePlayer";

export default function ViewingClub({ variant = "dark", mode = "vod" }) {
  const isDark = variant === "dark";

  return (
    <div className={`relative w-full h-full flex items-center justify-center px-8 py-12 ${
      isDark ? "bg-black/80" : "bg-slate-900/80"
    }`}>
      
      {/* Clean Jukebox Interface */}
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-2 ${
            isDark ? "text-cyan-400" : "text-purple-400"
          }`}>
            🎭 Club Hollywood
          </h2>
          <p className="text-white/60 text-sm">Pick your vibe and let it play</p>
        </div>

        {/* Vibe Player - Music Selection */}
        <div className="w-full">
          <VibePlayer 
            variant={variant} 
            mode={mode} 
            locked={mode === "live"} 
            roomId="club-main-stage"
          />
        </div>
      </div>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/5" : "bg-purple-500/5"
        }`} />
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/5" : "bg-purple-500/5"
        }`} />
      </div>
    </div>
  );
}
