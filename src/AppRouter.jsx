// src/AppRouter.jsx
// World of Karma 360 - Universe Router
import { useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";
import { CleAssistant } from "./ai/cle";

import UniversePage from "./universe/UniversePage";

// Lazy-load world modules
const ClubHollywoodWorld = lazy(() => import("./worlds/clubHollywood/ClubHollywoodWorld"));
const KazmoMansionWorld = lazy(() => import("./worlds/kazmoMansion/KazmoMansionWorld"));
const ShadowMarketWorld = lazy(() => import("./worlds/shadowMarket/ShadowMarketWorld"));
const StudioBeltWorld = lazy(() => import("./worlds/studioBelt/StudioBeltWorld"));

export default function AppRouter() {
  const { user, signOut } = useSupabaseAuth();

  // Premium logic
  const isPremium = user?.app_metadata?.premium === true;

  const [activeWorld, setActiveWorld] = useState(null); // null | "kazmo-mansion" | "studio-belt" etc-------------------------------------
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
        <UniversePage
          isPremium={isPremium}
          onEnterWorld={handleEnterWorld}
        />
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
              <KazmoMansionWorld
                isPremium={isPremium}
                user={user}
                onExitWorld={handleExitWorld}
              />
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
              <StudioBeltWorld
                isPremium={isPremium}
                onExitWorld={handleExitWorld}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------------------
          GLOBAL CLE ASSISTANT - Available everywhere in universe
      --------------------------------------------------------------------------- */}
      {activeWorld && <CleAssistant />}

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

      {/* Sign out button */}
      {user && (
        <button
          onClick={signOut}
          className="fixed top-4 right-4 text-xs text-amber-200/80 hover:text-amber-50 z-[80]"
        >
          Sign out
        </button>
      )}
    </main>
  );
}
