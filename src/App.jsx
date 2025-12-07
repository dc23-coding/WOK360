// src/App.jsx
import React, { useRef, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";

import HeroDoor from "./sections/HeroDoor";
import LightHallway from "./sections/LightHallway";
import LightBedroom from "./sections/LightBedroom";
import DarkHallway from "./sections/DarkHallway";
import DarkBedroom from "./sections/DarkBedroom";
import DarkPlayroom from "./sections/DarkPlayroom";

export default function App() {
  const { isSignedIn } = useUser();

  // Admin / keypad-based access
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // User can enter the house if signed in OR admin code was used
  const canEnter = isSignedIn || hasAdminAccess;

  // Where "Enter House" should scroll to
  const lightHallwayRef = useRef(null);

  const handleKeypadAccess = () => {
    setHasAdminAccess(true);
  };

  const handleEnterHouse = () => {
    if (lightHallwayRef.current) {
      lightHallwayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Floating user / sign-out button when signed in */}
      {isSignedIn && (
        <div className="fixed top-4 right-4 z-50">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  "w-9 h-9 border border-amber-300/80 rounded-full " +
                  "shadow-[0_0_18px_rgba(252,211,77,0.85)]",
              },
            }}
          />
        </div>
      )}

      {/* FRONT DOOR */}
      <section id="front-door" className="h-screen">
        <HeroDoor
          isSignedIn={isSignedIn}
          canEnter={canEnter}
          onKeypadAccess={handleKeypadAccess}
          onEnterHouse={handleEnterHouse}
        />
      </section>

      {/* INTERIOR SECTIONS */}
      <main className="w-full">
        <section id="light-hallway" ref={lightHallwayRef}>
          <LightHallway />
        </section>

        <section id="light-bedroom">
          <LightBedroom />
        </section>

        <section id="dark-hallway">
          <DarkHallway />
        </section>

        <section id="dark-bedroom">
          <DarkBedroom />
        </section>

        <section id="dark-playroom">
          <DarkPlayroom />
        </section>
      </main>
    </div>
  );
}
