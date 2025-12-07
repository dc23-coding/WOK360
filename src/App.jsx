// src/App.jsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

import HeroDoor from "./sections/HeroDoor";
import LightHallway from "./sections/LightHallway";
import LightBedroom from "./sections/LightBedroom";
import LightStudio from "./sections/LightStudio";
import DarkHallway from "./sections/DarkHallway";
import DarkBedroom from "./sections/DarkBedroom";
import DarkPlayroom from "./sections/DarkPlayroom";

export default function App() {
  const { isSignedIn } = useUser();
  const [mode, setMode] = useState("light");
  const [hasKeypadAccess, setHasKeypadAccess] = useState(false);
  const [isInside, setIsInside] = useState(false);

  // keypad access persisted locally
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("wok360-keypad-access");
    if (stored === "granted") setHasKeypadAccess(true);
  }, []);

  const canEnter = isSignedIn || hasKeypadAccess;

  const handleKeypadAccess = () => {
    setHasKeypadAccess(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wok360-keypad-access", "granted");
    }
  };

  const handleEnterHouse = () => {
    if (!canEnter) return; // extra guard
    setIsInside(true);
    setMode("light");

    // scroll to light hallway
    setTimeout(() => {
      const el = document.getElementById("light-hallway");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const toggleMode = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={[
        "h-screen w-full overflow-y-scroll snap-y snap-mandatory",
        mode === "dark" ? "bg-black text-cyan-50" : "bg-amber-50 text-amber-900",
      ].join(" ")}
    >
      <HeroDoor
        isSignedIn={isSignedIn}
        canEnter={canEnter}
        onKeypadAccess={handleKeypadAccess}
        onEnterHouse={handleEnterHouse}
      />

      {/* Only render rooms AFTER they’ve entered the house */}
      {isInside && (
        <>
          {mode === "light" ? (
            <>
              <div id="light-hallway">
                <LightHallway mode={mode} onToggleMode={toggleMode} />
              </div>
              <LightBedroom onToggleMode={toggleMode} />
              <LightStudio />
            </>
          ) : (
            <>
              <DarkHallway mode={mode} onToggleMode={toggleMode} />
              <DarkBedroom onToggleMode={toggleMode} />
              <DarkPlayroom />
            </>
          )}
        </>
      )}
    </div>
  );
}
