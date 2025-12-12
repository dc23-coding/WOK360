// src/AppRouter.jsx
// World of Karma 360 - Universe Router
import { useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";
import { CleAssistant } from "./ai/cle";

import UniversePage from "./universe/UniversePage";

// Lazy-load world modules
const KazmoMansionWorld = lazy(() => import("./worlds/kazmoMansion/KazmoMansionWorld"));

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

        {/* Future worlds can be added here */}
        {/* {activeWorld === "studio-belt" && <StudioBeltWorld ... />} */}
      </AnimatePresence>

      {/* ---------------------------------------------------------------------------
          GLOBAL CLE ASSISTANT - Available everywhere in universe
      --------------------------------------------------------------------------- */}
      {activeWorld && <CleAssistant />}

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
