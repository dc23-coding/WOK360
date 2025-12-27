import { useState, useEffect } from "react";
import RoomSection from "../components/RoomSection";
import ZoneKeypad from "../components/ZoneKeypad";
import { getCurrentUser, isAdmin } from "../lib/zoneAccessControl";

export default function HeroDoor({ onEnterHouse, onAdminAccess }) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user already has access on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    const adminStatus = isAdmin();
    
    if (currentUser || adminStatus) {
      setHasAccess(true);
      setUser(currentUser);
    }
  }, []);

  const handleAccessGranted = (grantedUser) => {
    setHasAccess(true);
    setUser(grantedUser);
    setShowKeypad(false);
  };

  const handleAdminAccess = () => {
    onAdminAccess?.();
  };

  const handleEnterHouse = () => {
    // Play doorbell sound (optional - graceful fallback)
    try {
      const doorbell = new Audio('/doorbell.mp3');
      doorbell.volume = 0.4;
      doorbell.play().catch(() => {
        console.log('Doorbell audio not available');
      });
    } catch (err) {
      // Audio not critical, continue silently
    }
    
    onEnterHouse();
  };

  return (
    <RoomSection bg="/Frontdoor_Main.webp" className="bg-black">
      <div className="relative w-full h-full flex flex-col items-center justify-center text-center text-amber-50 px-4">
        {/* Title & subtitle */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            The Kazmo Mansion
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-amber-100/80">
            Step through the door into a living house of stories, live feeds,
            and private rooms.
          </p>
        </div>

        {/* Show keypad if requested */}
        {showKeypad ? (
          <ZoneKeypad
            zoneName="Kazmo Mansion"
            zoneId="kazmo-mansion"
            requiredLevel="user"
            onAccessGranted={handleAccessGranted}
            onAdminAccess={handleAdminAccess}
            variant="light"
          />
        ) : hasAccess ? (
          // Access granted - show enter button
          <div
            className="relative w-[290px] md:w-[320px] rounded-[32px] bg-black/92 border border-amber-300/80 shadow-[0_0_90px_rgba(252,211,77,0.9)] px-6 py-7 md:px-7 md:py-8 flex flex-col items-center justify-center"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-amber-50/8 via-transparent to-amber-200/18" />

            <div className="relative z-10 w-full flex flex-col items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                Access granted
              </p>

              {user && (
                <p className="text-sm text-amber-100/90">
                  Welcome, <strong>{user.name}</strong>
                </p>
              )}

              <button
                type="button"
                onClick={handleEnterHouse}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-400 text-black text-sm font-semibold shadow-[0_0_26px_rgba(252,211,77,0.95)] hover:bg-amber-300 transition"
              >
                🔔 Enter House
              </button>

              <p className="mt-1 text-[10px] text-amber-100/70">
                Tap to step inside.
              </p>
            </div>
          </div>
        ) : (
          // Default guest state - show sign in prompt
          <div
            className="relative w-[290px] md:w-[320px] rounded-[32px] bg-black/92 border border-amber-300/80 shadow-[0_0_90px_rgba(252,211,77,0.9)] px-6 py-7 md:px-7 md:py-8 flex flex-col items-center justify-center"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-amber-50/8 via-transparent to-amber-200/18" />

            <div className="relative z-10 w-full flex flex-col items-center gap-4">
              <div className="mb-2 px-4 py-2 rounded-xl bg-amber-900/30 border border-amber-500/50">
                <p className="text-[11px] text-amber-200/90">🚪 Not Home</p>
              </div>
              
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                Welcome guest
              </p>

              <button
                type="button"
                onClick={() => setShowKeypad(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-400 text-black text-sm font-semibold shadow-[0_0_24px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition"
              >
                Enter Access Code
              </button>

              <p className="mt-1 text-[10px] text-amber-100/65 max-w-[220px]">
                4-digit access code required. Don't have one? Tap "Get Access Key" on the keypad.
              </p>
            </div>
          </div>
        )}
      </div>
    </RoomSection>
  );
}