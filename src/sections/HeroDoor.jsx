import { useState, useEffect, useRef } from "react";
import RoomSection from "../components/RoomSection";
import { useSupabaseAuth } from "../context/ClerkAuthContext";
import { getUserByPersonalCode, MASTER_KEY } from "../lib/zoneAccessControl";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";

export default function HeroDoor({
  isSignedIn,
  canEnter,
  onKeypadAccess,
  onEnterHouse,
}) {
  const { supabase } = useSupabaseAuth();
  const [showKeypad, setShowKeypad] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("signin"); // 'signin' | 'signup'
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showEnterConfirm, setShowEnterConfirm] = useState(false);
  const [codeType, setCodeType] = useState(""); // 'master' | 'personal' | ''
  const modalRef = useRef(null);

  // If user logs in via Supabase, close the auth tablet and show enter confirmation
  useEffect(() => {
    if (isSignedIn && showAuth) {
      setShowAuth(false);
      setShowEnterConfirm(true);
    }
  }, [isSignedIn, showAuth]);

  // --- keypad handlers ---
  const handleDigit = async (d) => {
    setError("");
    if (code.length >= 4) return;

    const next = code + d;
    setCode(next);

    if (next.length === 4) {
      // Check if it's the master key (admin access)
      if (next === MASTER_KEY) {
        setCodeType("master");
        setTimeout(() => {
          onKeypadAccess(); // Grant admin access
          setShowKeypad(false);
          setCode("");
          setCodeType("");
        }, 120);
        return;
      }
      
      // Check if it's a personal code (user shortcut)
      const result = await getUserByPersonalCode(supabase, next);
      
      if (result.email) {
        setCodeType("personal");
        // Personal code found - auto-fill email in signin
        setError(`Code recognized for ${result.email.substring(0, 3)}***`);
        setTimeout(() => {
          setShowKeypad(false);
          setShowAuth(true);
          setAuthTab("signin");
          setCode("");
          setCodeType("");
          // You could auto-fill the email here if you modify SignInForm
        }, 1500);
      } else {
        setError("Code not recognized");
        setCodeType("");
        setTimeout(() => setCode(""), 250);
      }
    }
  };

  const handleClear = () => {
    setCode("");
    setError("");
  };

  const tabletIsZoomed = showKeypad || showAuth;

  return (
    <RoomSection bg="/Frontdoor_Main.png" className="bg-black">
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

          {/* Enter confirmation after sign-in */}
          {showEnterConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/70" onClick={() => setShowEnterConfirm(false)} />
              <div className="relative z-10 w-[300px] rounded-xl bg-black/95 border border-amber-300/80 p-5 shadow-[0_0_80px_rgba(252,211,77,0.9)] text-center">
                <p className="text-amber-100 mb-4">Signed in — enter the house now?</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnterConfirm(false);
                      // Play doorbell sound
                      const doorbell = new Audio('/doorbell.mp3');
                      doorbell.volume = 0.4;
                      doorbell.play().catch(() => {/* ignore */});
                      
                      try {
                        onEnterHouse();
                      } catch (e) {
                        /* ignore */
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-amber-400 text-black font-semibold"
                  >
                    🔔 Enter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnterConfirm(false)}
                    className="px-4 py-2 rounded-full border border-amber-200/40 text-amber-100"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Glowing tablet on the door */}
        <div
          className={[
            "relative",
            "w-[290px] md:w-[320px]",
            "rounded-[32px]",
            "bg-black/92",
            "border border-amber-300/80",
            "shadow-[0_0_90px_rgba(252,211,77,0.9)]",
            "px-6 py-7 md:px-7 md:py-8",
            "flex flex-col items-center justify-center",
            "transition-transform duration-300",
            tabletIsZoomed ? "scale-105" : "scale-100",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-amber-50/8 via-transparent to-amber-200/18" />

          <div className="relative z-10 w-full">
            {/* ---------- 1. ACCESS GRANTED (ENTER HOUSE) ---------- */}
            {canEnter && !showKeypad && !showAuth && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                  Access granted
                </p>

                <button
                  type="button"
                  onClick={() => {
                    // Play doorbell sound
                    const doorbell = new Audio('/doorbell.mp3');
                    doorbell.volume = 0.4;
                    doorbell.play().catch(() => {/* ignore */});
                    onEnterHouse();
                  }}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-400 text-black text-sm font-semibold shadow-[0_0_26px_rgba(252,211,77,0.95)] hover:bg-amber-300 transition"
                >
                  Enter House
                </button>

                <p className="mt-1 text-[10px] text-amber-100/70">
                  Tap to step inside.
                </p>

                <button
                  type="button"
                  onClick={() => setShowKeypad(true)}
                  className="mt-2 text-[10px] text-amber-200/70 underline hover:text-amber-100/90"
                >
                  Master Key
                </button>
              </div>
            )}

            {/* ---------- 2. GUEST STATE (DEFAULT) ---------- */}
            {!canEnter && !showKeypad && !showAuth && (
              <div className="flex flex-col items-center gap-4">
                <div className="mb-2 px-4 py-2 rounded-xl bg-amber-900/30 border border-amber-500/50">
                  <p className="text-[11px] text-amber-200/90">🚪 Not Home</p>
                </div>
                
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                  Welcome guest
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("signin");
                    setShowAuth(true);
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-400 text-black text-sm font-semibold shadow-[0_0_24px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition"
                >
                  Sign in / Create account
                </button>

                <p className="mt-1 text-[10px] text-amber-100/65 max-w-[220px]">
                  Your account becomes your personal key to the house.
                </p>

                <button
                  type="button"
                  onClick={() => setShowKeypad(true)}
                  className="mt-2 text-[10px] text-amber-200/70 underline hover:text-amber-100/90"
                >
                  Master Key
                </button>
              </div>
            )}

            {/* ---------- 3. KEYPAD STATE ---------- */}
            {showKeypad && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                    Master Key
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowKeypad(false);
                      setCode("");
                      setError("");
                    }}
                    className="text-[10px] text-amber-200/70 hover:text-amber-100/90"
                  >
                    Back
                  </button>
                </div>

                <div className="flex gap-2 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={[
                        "w-3 h-3 rounded-full border border-amber-200/60",
                        code[i] ? "bg-amber-300" : "bg-transparent",
                      ].join(" ")}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-[10px] text-red-300/90 h-3">{error}</p>
                )}

                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleDigit(String(n))}
                      className="w-11 h-8 md:w-12 md:h-9 rounded-full bg-amber-100/10 border border-amber-200/40 hover:bg-amber-100/20 transition"
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-11 h-8 md:w-12 md:h-9 rounded-full text-[10px] bg-transparent border border-amber-200/40 hover:bg-amber-100/10 transition"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDigit("0")}
                    className="w-11 h-8 md:w-12 md:h-9 rounded-full bg-amber-100/10 border border-amber-200/40 hover:bg-amber-100/20 transition"
                  >
                    0
                  </button>
                  <div className="w-11 h-8 md:w-12 md:h-9" />
                </div>

                <p className="mt-1 text-[10px] text-amber-100/60">
                  Master key for admin • Personal codes for quick access
                </p>
              </div>
            )}

            {/* ---------- 4. SUPABASE AUTH (TABLET MODE) ---------- */}
            {showAuth && (
  <div className="flex flex-col items-stretch gap-2 w-full mt-3">
    <div className="w-full flex justify-between items-center mb-1">
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
        Account access
      </p>
      <button
        type="button"
        onClick={() => {
          setShowAuth(false);
          setAuthTab("signin");
        }}
        className="text-[10px] text-amber-200/70 hover:text-amber-100/90"
      >
        Back
      </button>
    </div>

    <div className="flex gap-2 justify-center mb-1">
      <button
        type="button"
        onClick={() => setAuthTab("signin")}
        className={[
          "px-3 py-1 rounded-full text-[11px]",
          authTab === "signin"
            ? "bg-amber-300 text-black"
            : "bg-transparent border border-amber-200/40 text-amber-100",
        ].join(" ")}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => setAuthTab("signup")}
        className={[
          "px-3 py-1 rounded-full text-[11px]",
          authTab === "signup"
            ? "bg-amber-300 text-black"
            : "bg-transparent border border-amber-200/40 text-amber-100",
        ].join(" ")}
      >
        Create account
      </button>
    </div>

    <div className="mt-2 max-h-72 w-full overflow-y-auto text-left">
      {authTab === "signin" ? (
        <SignInForm onSuccess={() => setShowAuth(false)} />
      ) : (
        <SignUpForm 
          onSuccess={() => setShowAuth(false)} 
          signupZone="kazmo-mansion"
        />
      )}
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </RoomSection>
  );
}