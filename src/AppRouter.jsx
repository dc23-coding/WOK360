// src/AppRouter.jsx
// World of Karma 360 - Universe Router
// Authentication is zone-specific via access keys (4-digit codes)
import { useState, Suspense, lazy, useEffect } from "react";
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
const ArcaneTowerWorld = lazy(() => import("./worlds/arcaneTower/ArcaneTowerWorld"));

function AppRouterContent() {
  const { setCurrentZone, setCurrentWing } = useZoneContext();

  // Universe state - users start here without authentication
  const [activeWorld, setActiveWorld] = useState(null); // null | "kazmo-mansion" | "shadow-market" | "club-hollywood" etc
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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
    } else if (activeWorld === 'arcane-tower') {
      setCurrentZone('arcaneTower');
    }
  }, [activeWorld, setCurrentZone, setCurrentWing]);
  
  // Navigate to a specific world with debounce protection
  // ---------------------------------------------------------------------------
  const handleEnterWorld = (worldId) => {
    if (isTransitioning) return; // Prevent rapid switching
    setIsTransitioning(true);
    setActiveWorld(worldId);
    setTimeout(() => setIsTransitioning(false), 300); // Reset after transition
  };

  // ---------------------------------------------------------------------------
  // Exit world back to universe map
  // ---------------------------------------------------------------------------
  const handleExitWorld = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveWorld(null);
    setTimeout(() => setIsTransitioning(false), 300);
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
      {activeWorld === "club-hollywood" && (
        <Suspense fallback={
          <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="text-cyan-400 text-xl">Loading Club Hollywood...</div>
          </div>
        }>
          <ClubHollywoodWorld
            onExitWorld={handleExitWorld}
          />
        </Suspense>
      )}

      {activeWorld === "kazmo-mansion" && (
        <Suspense fallback={
          <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="text-amber-400 text-xl">Loading Kazmo Mansion...</div>
          </div>
        }>
          <KazmoMansionWorld onExitWorld={handleExitWorld} />
        </Suspense>
      )}

      {activeWorld === "shadow-market" && (
        <Suspense fallback={
          <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="text-purple-400 text-xl">Loading Shadow Market...</div>
          </div>
        }>
          <ShadowMarketWorld onExitWorld={handleExitWorld} />
        </Suspense>
      )}

      {activeWorld === "studio-belt" && (
        <Suspense fallback={
              <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="text-blue-400 text-xl">Loading Studio Belt...</div>
          </div>
        }>
          <StudioBeltWorld onExitWorld={handleExitWorld} />
        </Suspense>
      )}

      {activeWorld === "chakra-center" && (
        <Suspense fallback={
              <div className="w-screen h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
                <div className="text-purple-300 text-xl">Loading Chakra Center...</div>
              </div>
            }>
              <ChakraCenterWorld onExitWorld={handleExitWorld} />
            </Suspense>
      )}

      {activeWorld === "arcane-tower" && (
        <Suspense fallback={
          <div className="w-screen h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 flex items-center justify-center">
            <div className="text-purple-300 text-xl">Loading Arcane Tower...</div>
          </div>
        }>
          <ArcaneTowerWorld onExitWorld={handleExitWorld} />
        </Suspense>
      )}

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
