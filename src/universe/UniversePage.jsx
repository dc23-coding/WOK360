// src/universe/UniversePage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { regions, getAccessibleRegions } from "./data/regions";
import RegionCard from "./components/RegionCard";
import MapGlobe from "./components/MapGlobe";

export default function UniversePage({ isPremium, onEnterWorld }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "globe"
  const accessibleRegions = getAccessibleRegions(isPremium);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white overflow-hidden">
      {/* Universe Header */}
      <header className="relative z-20 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              World of Karma 360
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-300">
              Explore immersive worlds, exclusive content, and interactive experiences
            </p>
          </motion.div>

          {/* View Toggle */}
          <div className="mt-6 inline-flex items-center rounded-full bg-slate-800/50 backdrop-blur px-1 py-1 border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-sm transition ${
                viewMode === "grid"
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("globe")}
              className={`px-4 py-2 rounded-full text-sm transition ${
                viewMode === "globe"
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Globe View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region, idx) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isAccessible={accessibleRegions.includes(region)}
                  onEnter={() => onEnterWorld(region.id)}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          ) : (
            <MapGlobe
              regions={regions}
              accessibleRegions={accessibleRegions}
              onRegionClick={(regionId) => {
                const region = regions.find(r => r.id === regionId);
                if (accessibleRegions.includes(region)) {
                  onEnterWorld(regionId);
                }
              }}
            />
          )}
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
