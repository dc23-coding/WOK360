// src/App.jsx
import { useEffect, useState } from "react";
import HeroDoor from "./sections/HeroDoor";
import LightHallway from "./sections/LightHallway";
import LightBedroom from "./sections/LightBedroom";
import LightStudio from "./sections/LightStudio";
import DarkHallway from "./sections/DarkHallway";
import DarkBedroom from "./sections/DarkBedroom";
import DarkPlayroom from "./sections/DarkPlayroom";

export default function App() {
  const [mode, setMode] = useState("light");       // "light" | "dark"
  const [hasAccess, setHasAccess] = useState(false); // guest/admin access to house
  const [isInside, setIsInside] = useState(false);   // actually viewing rooms

  // Load stored access (so you don't need to re-enter every visit)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("wok360-access");
    if (stored === "granted") setHasAccess(true);
  }, []);

  // Called when login/registration OR keypad succeed
  const handleAccessGranted = () => {
    setHasAccess(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wok360-access", "granted");
    }
  };

  // Called when user taps "Enter House"
  const handleEnterHouse = () => {
    setIsInside(true);
    setMode("light");

    // Scroll to light hallway once it exists in the DOM
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
        hasAccess={hasAccess}
        onAccessGranted={handleAccessGranted}
        onEnterHouse={handleEnterHouse}
      />

      {/* Only render the inside of the house once user has entered */}
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
