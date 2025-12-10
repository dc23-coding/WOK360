import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";

import HeroDoor from "./sections/HeroDoor";

// Lazy-loaded sections
const LightHallway = lazy(() => import("./sections/LightHallway"));
const LightBedroom = lazy(() => import("./sections/LightBedroom"));
const LightStudio = lazy(() => import("./sections/LightStudio"));

const DarkHallway = lazy(() => import("./sections/DarkHallway"));
const DarkBedroom = lazy(() => import("./sections/DarkBedroom"));
const DarkPlayroom = lazy(() => import("./sections/DarkPlayroom"));

export default function App() {
  const { user, signOut } = useSupabaseAuth();

  // Premium logic: adjust when you wire actual Supabase metadata
  const isPremium = user?.app_metadata?.premium === true;

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [hasEnteredHouse, setHasEnteredHouse] = useState(false);

  // Persisted mode: read from localStorage on first render
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("wok360_mode");
    return stored === "dark" ? "dark" : "light";
  }); // "light" | "dark"

  const [isTransitioningMode, setIsTransitioningMode] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const canEnter = !!user || adminUnlocked;
  const canAccessDark = isPremium || adminUnlocked;

  // ---------------------------------------------------------------------------
  // Persist mode to localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wok360_mode", mode);
    }
  }, [mode]);

  // ---------------------------------------------------------------------------
  // Disable scroll until access is granted
  // ---------------------------------------------------------------------------
  useEffect(() => {
    document.body.style.overflowY = canEnter ? "auto" : "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [canEnter]);

  // ---------------------------------------------------------------------------
  // Global mode toggle with premium gate & door animation
  // ---------------------------------------------------------------------------
  const handleToggleMode = () => {
    const nextMode = mode === "light" ? "dark" : "light";

    // If going INTO dark and user is not allowed → show premium modal, don't switch
    if (nextMode === "dark" && !canAccessDark) {
      setShowPremiumModal(true);
      return;
    }

    // Start door transition + switch mode
    setIsTransitioningMode(true);
    setMode(nextMode);
  };

  // End transition after animation duration
  useEffect(() => {
    if (!isTransitioningMode) return;
    const t = setTimeout(() => setIsTransitioningMode(false), 900); // match animation timing
    return () => clearTimeout(t);
  }, [isTransitioningMode]);

  // ---------------------------------------------------------------------------
  // NO auto-scroll on mode change — let user stay where they are
  // Only handleEnterHouse scrolls when first entering the house
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Admin keypad unlock
  // ---------------------------------------------------------------------------
  const handleKeypadAccess = () => {
    setAdminUnlocked(true);
  };

  // ---------------------------------------------------------------------------
  // Enter house → close door modal and show hallway
  // ---------------------------------------------------------------------------
  const handleEnterHouse = () => {
    if (!canEnter) return;
    setHasEnteredHouse(true);
  };

  return (
    <main
  className="
    w-screen min-h-screen bg-black text-white overflow-x-hidden
    snap-y snap-mandatory overflow-y-scroll
  "
>
      {/* ------------------------------- FRONT DOOR (Fixed Modal) ------------------------------- */}
      <AnimatePresence>
        {!hasEnteredHouse && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroDoor
              isSignedIn={!!user}
              canEnter={canEnter}
              onKeypadAccess={handleKeypadAccess}
              onEnterHouse={handleEnterHouse}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only show hallways/rooms after user enters */}
      {hasEnteredHouse && (
        <>
          {/* ---------------------------------------------------------------------------
              LIGHT WING (Default)
          --------------------------------------------------------------------------- */}
          {mode === "light" && (
            <Suspense fallback={<div />}>
              <section id="light-hallway">
                <LightHallway mode={mode} onToggleMode={handleToggleMode} />
              </section>

              <LightBedroom onToggleMode={handleToggleMode} />
              <LightStudio />
            </Suspense>
          )}

          {/* ---------------------------------------------------------------------------
              DARK WING — requires premium or admin
              NOTE: DarkHallway already contains id="dark-hallway" internally.
          --------------------------------------------------------------------------- */}
          {mode === "dark" && canAccessDark && (
            <Suspense fallback={<div />}>
              <DarkHallway mode={mode} onToggleMode={handleToggleMode} />
              <DarkBedroom onToggleMode={handleToggleMode} />
              <DarkPlayroom />
            </Suspense>
          )}
        </>
      )}

      {/* --------------------------- PREMIUM MODAL --------------------------- */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowPremiumModal(false)}
            />
            <motion.div
              className="relative z-10 w-[320px] max-w-sm rounded-2xl bg-black/90 border border-amber-300/70 px-6 py-5 shadow-[0_0_60px_rgba(252,211,77,0.7)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80 mb-2">
                Night Wing Locked
              </p>
              <h2 className="text-lg font-semibold text-amber-50 mb-2">
                Premium Access Required
              </h2>
              <p className="text-sm text-amber-100/80 mb-4">
                The Night Wing holds private rooms, live sessions, and exclusive
                content. Unlock premium access to step through this door.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  className="text-xs px-3 py-1.5 rounded-full border border-amber-200/50 text-amber-100 hover:bg-amber-100/10"
                >
                  Stay in Day Wing
                </button>
                {/* Hook this up to your actual checkout later */}
                <button
                  type="button"
                  onClick={() => {
                    // placeholder for future: route to pricing / checkout
                    setShowPremiumModal(false);
                  }}
                  className="text-xs px-4 py-1.5 rounded-full bg-amber-300 text-black font-semibold hover:bg-amber-200"
                >
                  Unlock Premium
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------- DOOR TRANSITION OVERLAY ------------------------- */}
      <AnimatePresence>
        {isTransitioningMode && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Two sliding panels like a door closing/opening */}
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-black/95 border-r border-amber-300/40"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-black/95 border-l border-amber-300/40"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />

            <div className="relative z-10 text-center text-amber-100 text-xs tracking-[0.3em] uppercase">
              Switching to {mode === "dark" ? "Night Wing" : "Day Wing"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
