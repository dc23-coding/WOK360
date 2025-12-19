// src/universe/UniversePage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useSupabaseAuth } from "../context/SupabaseAuthContext";
import { regions, getAccessibleRegions } from "./data/regions";
import RegionCard from "./components/RegionCard";
import MapGlobe from "./components/MapGlobe";
import GlobalAuthGate from "../components/GlobalAuthGate";

export default function UniversePage({ isPremium, onEnterWorld }) {
  const { user } = useSupabaseAuth();
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "globe"
  const [pendingWorld, setPendingWorld] = useState(null);
  const accessibleRegions = getAccessibleRegions(isPremium);

  const handleWorldClick = (worldId) => {
    const world = regions.find(r => r.id === worldId);
    
    // Check if auth required and if world requires wallet
    const requiresWallet = world?.id === "shadow-market";
    
    if (!user) {
      // Show auth gate
      setPendingWorld({ id: worldId, requiresWallet });
    } else if (requiresWallet && !user.walletAddress) {
      // Show wallet connection
      setPendingWorld({ id: worldId, requiresWallet });
    } else {
      // User is authenticated, proceed
      onEnterWorld(worldId);
    }
  };

  const handleAuthComplete = () => {
    if (pendingWorld) {
      onEnterWorld(pendingWorld.id);
      setPendingWorld(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white overflow-hidden pt-16 sm:pt-20">
      {/* Universe Header */}
      <header className="relative z-20 py-6 sm:py-8 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              World of Karma 360
            </h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl text-slate-300">
              Explore immersive worlds, exclusive content, and interactive experiences
            </p>
          </motion.div>

          {/* View Toggle - Touch optimized */}
          <div className="mt-4 sm:mt-6 inline-flex items-center rounded-full bg-slate-800/50 backdrop-blur px-1 py-1 border border-slate-700 touch-manipulation">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0 rounded-full text-xs sm:text-sm transition ${
                viewMode === "grid"
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white active:text-cyan-300"
              }`}
            >
              Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("globe")}
              className={`px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0 rounded-full text-xs sm:text-sm transition ${
                viewMode === "globe"
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white active:text-cyan-300"
              }`}
            >
              Globe View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 md:px-12 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {regions.map((region, idx) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isAccessible={accessibleRegions.includes(region)}
                  onEnter={() => handleWorldClick(region.id)}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          ) : (
            <MapGlobe
              regions={regions}
              accessibleRegions={accessibleRegions}
              onRegionClick={handleWorldClick}
            />
          )}
        </div>
      </main>

      {/* Auth Gate Modal */}
      {pendingWorld && (
        <GlobalAuthGate
          worldName={regions.find(r => r.id === pendingWorld.id)?.name || "World"}
          requireWallet={pendingWorld.requiresWallet}
          onAuthenticated={handleAuthComplete}
        />
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
