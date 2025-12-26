// src/worlds/kazmoMansion/KazmoMansionWorld.jsx
import { useState, useEffect, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useZoneContext } from "../../context/ZoneContext";
import { isAdmin, getCurrentUser, hasAccessLevel } from "../../lib/zoneAccessControl";
import HeroDoor from "../../sections/HeroDoor";

// Lazy-loaded mansion rooms and hallways
const LightHallway = lazy(() => import("./hallways/LightHallway"));
const LightBedroom = lazy(() => import("./rooms/LightBedroom"));
const LightStudio = lazy(() => import("./rooms/LightStudio"));
const LightMusicRoom = lazy(() => import("./rooms/LightMusicRoom"));
const LightPhotoGallery = lazy(() => import("./rooms/LightPhotoGallery"));
const LightMerchShop = lazy(() => import("./rooms/LightMerchShop"));
const LightAskJeeves = lazy(() => import("./rooms/LightAskJeeves"));

const DarkHallway = lazy(() => import("./hallways/DarkHallway"));
const DarkBedroom = lazy(() => import("./rooms/DarkBedroom"));
const DarkPlayroom = lazy(() => import("./rooms/DarkPlayroom"));

export default function KazmoMansionWorld({ onExitWorld }) {
  const { setCurrentWing } = useZoneContext();
  const [hasEnteredMansion, setHasEnteredMansion] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [adminAccess, setAdminAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check access on mount
  useEffect(() => {
    const adminStatus = isAdmin();
    const user = getCurrentUser();
    setAdminAccess(adminStatus);
    setCurrentUser(user);
  }, []);

  // Dark wing requires premium or admin - STRICT CHECK
  const canAccessDark = adminAccess || (currentUser && currentUser.access_level === "premium");

  // Disable scroll until mansion is entered
  useEffect(() => {
    document.body.style.overflowY = hasEnteredMansion ? "auto" : "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [hasEnteredMansion]);

  // Admin access granted
  const handleAdminAccess = () => {
    setAdminAccess(true);
  };

  // Enter mansion
  const handleEnterMansion = () => {
    setHasEnteredMansion(true);
  };
  
  // Persisted mode for this world - default to light
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    // Only allow dark if user is premium or admin
    const stored = window.localStorage.getItem("kazmoMansion_mode");
    if (stored === "dark" && !canAccessDark) {
      return "light"; // Force light if no premium access
    }
    return stored === "dark" ? "dark" : "light";
  });

  const [isTransitioningMode, setIsTransitioningMode] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Persist mode to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kazmoMansion_mode", mode);
    }
    // Update zone context so ContentUploader knows current wing
    setCurrentWing(mode);
  }, [mode, setCurrentWing]);

  // Mode toggle with premium gate
  const handleToggleMode = () => {
    const nextMode = mode === "light" ? "dark" : "light";

    if (nextMode === "dark" && !canAccessDark) {
      setShowPremiumModal(true);
      return;
    }

    setIsTransitioningMode(true);
    setMode(nextMode);
  };

  // End transition after animation
  useEffect(() => {
    if (!isTransitioningMode) return;
    const t = setTimeout(() => setIsTransitioningMode(false), 900);
    return () => clearTimeout(t);
  }, [isTransitioningMode]);

  return (
    <div className="w-screen min-h-screen bg-black text-white overflow-x-hidden snap-y snap-mandatory overflow-y-scroll">
      {/* ------------------------------- MANSION DOOR (Fixed Modal) ------------------------------- */}
      <AnimatePresence>
        {!hasEnteredMansion && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroDoor
              onEnterHouse={handleEnterMansion}
              onAdminAccess={handleAdminAccess}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit to Universe Button */}
      {hasEnteredMansion && (
        <button
          onClick={onExitWorld}
          className="fixed top-4 left-4 z-[90] px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400/50 text-sm transition"
        >
          ← Universe Map
        </button>
      )}

      {/* Mansion Branding */}
      {hasEnteredMansion && (
        <div className="fixed top-4 right-4 z-[90] text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/60">
            Kazmo District
          </p>
          <p className="text-sm font-semibold text-white">
            Kazmo Mansion
          </p>
        </div>
      )}

      {/* Light Wing */}
      {hasEnteredMansion && mode === "light" && (
        <Suspense fallback={<div />}>
          <section id="light-hallway">
            <LightHallway mode={mode} onToggleMode={handleToggleMode} onNavigate={setActiveRoom} />
          </section>

          <section id="light-bedroom">
            <LightBedroom onToggleMode={handleToggleMode} />
          </section>

          <LightStudio />
        </Suspense>
      )}

      {/* Dark Wing */}
      {hasEnteredMansion && mode === "dark" && canAccessDark && (
        <Suspense fallback={<div />}>
          <DarkHallway mode={mode} onToggleMode={handleToggleMode} onNavigate={setActiveRoom} />
          
          <section id="dark-bedroom">
            <DarkBedroom onToggleMode={handleToggleMode} />
          </section>

          <section id="dark-playroom">
            <DarkPlayroom />
          </section>
        </Suspense>
      )}

      {/* Room Navigation Modal */}
      <AnimatePresence>
        {activeRoom && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveRoom(null)}
            />
            <motion.div
              className="relative z-10 w-full h-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setActiveRoom(null)}
                className="absolute top-4 right-4 z-[80] w-10 h-10 rounded-full bg-black/60 border border-white/30 text-white hover:bg-black/80 flex items-center justify-center text-xl"
              >
                ×
              </button>
              <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center text-white">Loading...</div>}>
                {activeRoom === "music-room" && <LightMusicRoom onToggleMode={handleToggleMode} />}
                {activeRoom === "photo-gallery" && <LightPhotoGallery onToggleMode={handleToggleMode} />}
                {activeRoom === "merch-shop" && <LightMerchShop onToggleMode={handleToggleMode} />}
                {activeRoom === "ask-cle" && <LightAskJeeves onToggleMode={handleToggleMode} />}
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
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
                The Night Wing holds private rooms, live sessions, and exclusive content.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  className="text-xs px-3 py-1.5 rounded-full border border-amber-200/50 text-amber-100 hover:bg-amber-100/10"
                >
                  Stay in Day Wing
                </button>
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  className="text-xs px-4 py-1.5 rounded-full bg-amber-300 text-black font-semibold hover:bg-amber-200"
                >
                  Unlock Premium
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Door Transition Overlay */}
      <AnimatePresence>
        {isTransitioningMode && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
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
    </div>
  );
}
