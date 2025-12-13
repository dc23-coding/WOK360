// src/worlds/clubHollywood/ClubHollywoodWorld.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ViewingClub from "../../components/ViewingClub";

export default function ClubHollywoodWorld({ onExitWorld }) {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-black via-slate-950 to-cyan-950/30 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/60">
              Entertainment District
            </p>
            <p className="text-lg font-semibold text-white">
              Club Hollywood
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen Viewing Club */}
      <div className="pt-20 h-screen">
        <ViewingClub variant="dark" />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
