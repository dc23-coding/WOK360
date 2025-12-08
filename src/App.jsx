import { useState, useEffect, Suspense, lazy } from "react";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";

import HeroDoor from "./sections/HeroDoor";

// Lazy-load large sections to reduce initial bundle size
const LightHallway = lazy(() => import("./sections/LightHallway"));
const LightBedroom = lazy(() => import("./sections/LightBedroom"));
const LightStudio = lazy(() => import("./sections/LightStudio"));

const DarkHallway = lazy(() => import("./sections/DarkHallway"));
const DarkBedroom = lazy(() => import("./sections/DarkBedroom"));
const DarkPlayroom = lazy(() => import("./sections/DarkPlayroom"));

export default function App() {
  const { user, signOut } = useSupabaseAuth();

  // Premium logic (adjust based on your Supabase metadata)
  const isPremium = user?.app_metadata?.premium === true;

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [mode, setMode] = useState("light"); // "light" | "dark"

  const canEnter = !!user || adminUnlocked;

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
  // Toggle light/dark mode — block Night Wing for non-premium users
  // ---------------------------------------------------------------------------
  const toggleMode = () => {
    if (!isPremium && mode === "light") {
      return; // non-premium cannot enter dark mode
    }
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  // ---------------------------------------------------------------------------
  // Smooth auto-scroll when mode changes (requestAnimationFrame ensures DOM ready)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (mode === "light") {
      requestAnimationFrame(() => {
        const el = document.getElementById("light-hallway");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    if (mode === "dark" && isPremium) {
      requestAnimationFrame(() => {
        const el = document.getElementById("dark-hallway");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [mode, isPremium]);

  // ---------------------------------------------------------------------------
  // Admin keypad access
  // ---------------------------------------------------------------------------
  const handleKeypadAccess = () => {
    setAdminUnlocked(true);
  };

  // ---------------------------------------------------------------------------
  // Scroll into house after entering
  // ---------------------------------------------------------------------------
  const handleEnterHouse = () => {
    if (!canEnter) return;
    const el = document.getElementById("light-hallway");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="w-screen min-h-screen bg-black text-white overflow-x-hidden">

      {/* ------------------------------- FRONT DOOR ------------------------------- */}
      <HeroDoor
        isSignedIn={!!user}
        canEnter={canEnter}
        onKeypadAccess={handleKeypadAccess}
        onEnterHouse={handleEnterHouse}
      />

      {/* ---------------------------------------------------------------------------
          LIGHT WING — Shown when mode === "light"
          Everyone can access the Day Wing.
      --------------------------------------------------------------------------- */}
      {mode === "light" && (
        <Suspense fallback={<div />}> 
          <section id="light-hallway">
            <LightHallway mode={mode} onToggleMode={toggleMode} />
          </section>

          <LightBedroom onToggleMode={toggleMode} />

          <LightStudio />
        </Suspense>
      )}

      {/* ---------------------------------------------------------------------------
          DARK WING — Shown only when:
            1) mode === "dark"
            2) user is premium
          Otherwise Night Wing sections never load.
      --------------------------------------------------------------------------- */}
      {mode === "dark" && isPremium && (
        <Suspense fallback={<div />}>
          {/* ADD id for scroll target (required) */}
          <DarkHallway onToggleMode={toggleMode} />

          <DarkBedroom onToggleMode={toggleMode} />

          <DarkPlayroom />
        </Suspense>
      )}

      {/* Sign-out button */}
      {user && (
        <button
          onClick={signOut}
          className="fixed top-4 right-4 text-xs text-amber-200/80 hover:text-amber-50"
        >
          Sign out
        </button>
      )}
    </main>
  );
}
