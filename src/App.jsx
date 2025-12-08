import { useState } from "react";
import { useSupabaseAuth } from "./context/SupabaseAuthContext";
import HeroDoor from "./sections/HeroDoor";
import LightHallway from "./sections/LightHallway";
import LightBedroom from "./sections/LightBedroom";
import DarkHallway from "./sections/DarkHallway";
import DarkBedroom from "./sections/DarkBedroom";
import DarkPlayroom from "./sections/DarkPlayroom";

export default function App() {
  const { user, signOut } = useSupabaseAuth();

  // Admin keypad override
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const canEnter = !!user || adminUnlocked;

  const handleKeypadAccess = () => {
    setAdminUnlocked(true);
  };

  const handleEnterHouse = () => {
    const el = document.getElementById("light-hallway");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="w-screen min-h-screen bg-black text-white overflow-x-hidden">
      {/* FRONT DOOR / HERO */}
      <HeroDoor
        isSignedIn={!!user}
        canEnter={canEnter}
        onKeypadAccess={handleKeypadAccess}
        onEnterHouse={handleEnterHouse}
      />

      {/* LIGHT WING */}
      <section id="light-hallway">
        <LightHallway />
      </section>
      <LightBedroom />

      {/* DARK WING */}
      <DarkHallway />
      <DarkBedroom />
      <DarkPlayroom />

      {/* Tiny sign-out for now – you can move/style this later */}
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
