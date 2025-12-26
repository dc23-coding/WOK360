// src/AppRouter.jsx
// World of Karma 360 - Universe Router
// Authentication is zone-specific via access keys (4-digit codes)
import { useState, Suspense, lazy, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoneProvider, useZoneContext } from "./context/ZoneContext";
import { CleAssistant } from "./ai/cle";
import GlobalMediaPlayer from "./components/GlobalMediaPlayer";

import UniversePage from "./universe/UniversePage";

// Lazy-load world modules
const ClubHollywoodWorld = lazy(() => import("./worlds/clubHollywood/ClubHollywoodWorld"));
const KazmoMansionWorld = lazy(() => import("./worlds/kazmoMansion/KazmoMansionWorld"));
const ShadowMarketWorld = lazy(() => import("./worlds/shadowMarket/ShadowMarketWorld"));
const StudioBeltWorld = lazy(() => import("./worlds/studioBelt/StudioBeltWorld"));
const ChakraCenterWorld = lazy(() => import("./worlds/chakraCenter/ChakraCenterWorld"));

function AppRouterContent() {
  const { currentZone, currentWing, setCurrentZone, setCurrentWing } = useZoneContext();

  // Universe state - users start here without authentication
  const [activeWorld, setActiveWorld] = useState(null); // null | "kazmo-mansion" | "shadow-market" | "club-hollywood" etc
  
  // Update zone context when active world changes
  useEffect(() => {
    if (!activeWorld) {
      setCurrentZone(null);
      setCurrentWing(null);
    } else if (activeWorld === 'kazmo-mansion') {
      setCurrentZone('kazmo');
    } else if (activeWorld === 'club-hollywood') {
      setCurrentZone('clubHollywood');
    } else if (activeWorld === 'shadow-market') {
      setCurrentZone('shadowMarket');
    } else if (activeWorld === 'chakra-center') {
      setCurrentZone('chakraCenter');
    }
  }, [activeWorld, setCurrentZone, setCurrentWing]);
  
  // Navigate to a specific world
  // ---------------------------------------------------------------------------
  const handleEnterWorld = (worldId) => {
    setActiveWorld(worldId);
  };

  // ---------------------------------------------------------------------------
  // Exit world back to universe map
  // ---------------------------------------------------------------------------
  const handleExitWorld = () => {
    setActiveWorld(null);
  };

  return (
    <main className="w-screen min-h-screen bg-black text-white overflow-x-hidden">
      {/* ---------------------------------------------------------------------------
          UNIVERSE MAP - Default view showing all worlds (always visible)
      --------------------------------------------------------------------------- */}
      {!activeWorld && (
        <UniversePage onEnterWorld={handleEnterWorld} />
      )}

      {/* ---------------------------------------------------------------------------
          ACTIVE WORLD RENDERER
      --------------------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {activeWorld === "club-hollywood" && (
          <motion.div
            key="club-hollywood"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-cyan-400 text-xl">Loading Club Hollywood...</div>
              </div>
            }>
              <ClubHollywoodWorld
                onExitWorld={handleExitWorld}
              />
            </Suspense>
          </motion.div>
        )}

        {activeWorld === "kazmo-mansion" && (
          <motion.div
            key="kazmo-mansion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-cyan-400 text-xl">Loading Kazmo Mansion...</div>
              </div>
            }>
              <KazmoMansionWorld onExitWorld={handleExitWorld} />
            </Suspense>
          </motion.div>
        )}

        {activeWorld === "shadow-market" && (
          <motion.div
            key="shadow-market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-purple-400 text-xl">Loading Shadow Market...</div>
              </div>
            }>
              <ShadowMarketWorld
                onExitWorld={handleExitWorld}
              />
            </Suspense>
          </motion.div>
        )}

        {activeWorld === "studio-belt" && (
          <motion.div
            key="studio-belt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-screen h-screen bg-black flex items-center justify-center">
                <div className="text-purple-400 text-xl">Loading Studio Belt...</div>
              </div>
            }>
              <StudioBeltWorld onExitWorld={handleExitWorld} />
            </Suspense>
          </motion.div>
        )}

        {activeWorld === "chakra-center" && (
          <motion.div
            key="chakra-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="w-screen h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="text-purple-300 text-xl">Loading Chakra Center...</div>
              </div>
            }>
              <ChakraCenterWorld onExitWorld={handleExitWorld} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------------------
          GLOBAL CLE ASSISTANT - Available everywhere in universe
      --------------------------------------------------------------------------- */}
      {activeWorld && <CleAssistant />}

      {/* ---------------------------------------------------------------------------
          GLOBAL MEDIA PLAYER - Persistent player for audio/video
      --------------------------------------------------------------------------- */}
      <GlobalMediaPlayer />

      {/* ---------------------------------------------------------------------------
          ADMIN CONTENT UPLOADER - Now integrated into Control Room
          (Kept here for backwards compatibility but hidden)
      --------------------------------------------------------------------------- */}
      {/* <ContentUploader 
        currentZone={currentZone}
        currentWing={currentWing}
      /> */}

      {/* ---------------------------------------------------------------------------
          GLOBAL UNIVERSE MAP BUTTON - Available in all worlds
      --------------------------------------------------------------------------- */}
      {activeWorld && (
        <button
          onClick={handleExitWorld}
          className="fixed top-4 left-4 z-[80] px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400/50 text-sm transition shadow-lg"
          title="Return to Universe Map"
        >
          ← Universe Map
        </button>
      )}
    </main>
  );
}

// Wrap with ZoneProvider for context access
export default function AppRouter() {
  return (
    <ZoneProvider>
      <AppRouterContent />
    </ZoneProvider>
  );
}
