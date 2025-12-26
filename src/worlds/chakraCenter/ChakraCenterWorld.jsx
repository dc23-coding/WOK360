// src/worlds/chakraCenter/ChakraCenterWorld.jsx
// Chakra Center - Wellness Sanctuary with 3 zones
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZoneKeypad from "../../components/ZoneKeypad";
import { getCurrentUser, isAdmin } from "../../lib/zoneAccessControl";
import RoomSection from "../../components/RoomSection";

// Lazy load zones - only active zone loads
const WellnessLibrary = lazy(() => import("./zones/WellnessLibrary"));
const HealthTracker = lazy(() => import("./zones/HealthTracker"));
const AIHealthAdvisor = lazy(() => import("./zones/AIHealthAdvisor"));

export default function ChakraCenterWorld({ onExitWorld }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [activeZone, setActiveZone] = useState(null); // null | 'wellness' | 'tracker' | 'advisor'

  // Check if user already has access
  useEffect(() => {
    const user = getCurrentUser();
    const admin = isAdmin();
    if (user || admin) {
      setHasAccess(true);
    }
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleAdminAccess = () => {
    setHasAccess(true);
  };

  // Show keypad if no access
  if (!hasAccess) {
    return (
      <RoomSection bg="/chakra-center-gate.png" className="bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-purple-100">
              Chakra Center
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-purple-200/80">
              Your personal wellness sanctuary. Access binaural beats, track your health journey, and receive AI-powered guidance.
            </p>
          </div>

          <ZoneKeypad
            zoneName="Chakra Center"
            zoneId="chakra-center"
            requiredLevel="user"
            onAccessGranted={handleAccessGranted}
            onAdminAccess={handleAdminAccess}
            variant="dark"
          />
        </div>
      </RoomSection>
    );
  }

  // Main hub with 3 zones
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
      {/* Exit Button */}
      <button
        onClick={onExitWorld}
        className="fixed top-4 left-4 z-[90] px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur border border-purple-500/50 text-purple-200 hover:text-white hover:border-purple-400 text-sm transition"
      >
        ← Universe Map
      </button>

      {/* Zone Selection or Active Zone */}
      <AnimatePresence mode="wait">
        {!activeZone ? (
          // Hub - Select Zone
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Chakra Center
            </h1>
            <p className="text-lg text-purple-200/80 mb-12 max-w-2xl text-center">
              Choose your path to wellness
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {/* Zone 1: Wellness Library */}
              <button
                onClick={() => setActiveZone('wellness')}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur hover:border-purple-400/60 transition text-left"
              >
                <div className="text-5xl mb-4">🧘‍♀️</div>
                <h3 className="text-2xl font-bold mb-2 text-purple-100">Wellness Library</h3>
                <p className="text-purple-200/70 text-sm mb-4">
                  Binaural beats, meditation audio, self-improvement books, health tips, and wealth generation resources.
                </p>
                <div className="text-xs text-purple-300/60">
                  • Binaural Beats Player<br />
                  • Book Collection<br />
                  • Health & Wealth Links
                </div>
              </button>

              {/* Zone 2: Health Tracker */}
              <button
                onClick={() => setActiveZone('tracker')}
                className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur hover:border-blue-400/60 transition text-left"
              >
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-2 text-blue-100">Health Tracker</h3>
                <p className="text-blue-200/70 text-sm mb-4">
                  Input and track your personal health data, fitness journey, weight, nutrition, and wellness goals.
                </p>
                <div className="text-xs text-blue-300/60">
                  • Personal Data Input<br />
                  • Fitness Tracking<br />
                  • Progress Monitoring
                </div>
              </button>

              {/* Zone 3: AI Health Advisor */}
              <button
                onClick={() => setActiveZone('advisor')}
                className="p-8 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 backdrop-blur hover:border-green-400/60 transition text-left"
              >
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold mb-2 text-green-100">AI Health Advisor</h3>
                <p className="text-green-200/70 text-sm mb-4">
                  Chat with AI to receive personalized health advice, diet strategies, and wellness recommendations based on your data.
                </p>
                <div className="text-xs text-green-300/60">
                  • AI Chatbot<br />
                  • Personalized Advice<br />
                  • Diet Strategies
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          // Active Zone Content
          <motion.div
            key={activeZone}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen p-6"
          >
            <button
              onClick={() => setActiveZone(null)}
              className="mb-6 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition"
            >
              ← Back to Hub
            </button>

            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="text-purple-200 animate-pulse">Loading zone...</div>
              </div>
            }>
              {activeZone === 'wellness' && <WellnessLibrary />}
              {activeZone === 'tracker' && <HealthTracker />}
              {activeZone === 'advisor' && <AIHealthAdvisor />}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
