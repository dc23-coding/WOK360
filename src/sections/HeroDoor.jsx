// src/sections/HeroDoor.jsx
import { useState, useEffect } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import RoomSection from "../components/RoomSection";

// NOTE: this is NOT a true secret; VITE_ vars are visible in frontend bundles.
const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || "3104";

export default function HeroDoor({
  isSignedIn,
  canEnter,
  onKeypadAccess,
  onEnterHouse,
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("signin"); // 'signin' | 'signup'
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // If user signs in successfully, close auth panel
  useEffect(() => {
    if (isSignedIn && showAuth) {
      setShowAuth(false);
    }
  }, [isSignedIn, showAuth]);

  // --- keypad handlers ---
  const handleDigit = (d) => {
    setError("");
    if (code.length >= 4) return;

    const next = code + d;
    setCode(next);

    if (next.length === 4) {
      if (next === String(ADMIN_CODE)) {
        // correct code
        setTimeout(() => {
          onKeypadAccess(); // tell App "this device has access"
          setShowKeypad(false);
          setCode("");
        }, 120);
      } else {
        setError("Access denied");
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
            World of Karma 360
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-amber-100/80">
            Step through the door into a living house of stories, live feeds,
            and private rooms.
          </p>
        </div>

        {/* Glowing tablet on the door */}
        <div
          className={[
            "relative",
            "w-[270px] md:w-[290px]",
            "rounded-[30px]",
            "bg-black/92",
            "border border-amber-300/80",
            "shadow-[0_0_90px_rgba(252,211,77,0.9)]",
            "px-6 py-7 md:px-7 md:py-8",
            "flex flex-col items-center justify-center",
            "transition-transform duration-300",
            tabletIsZoomed ? "scale-105" : "scale-100",
          ].join(" ")}
        >
          {/* soft glow overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-b from-amber-50/8 via-transparent to-amber-200/18" />

          <div className="relative z-10 w-full">
            {/* ---------------- 1. ACCESS GRANTED ---------------- */}
            {canEnter && !showKeypad && !showAuth && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                  Access granted
                </p>

                <button
                  type="button"
                  onClick={onEnterHouse}
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
                  Admin access code
                </button>
              </div>
            )}

            {/* ---------------- 2. GUEST STATE (DEFAULT) ---------------- */}
            {!canEnter && !showKeypad && !showAuth && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                  Welcome guest
                </p>

                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-400 text-black text-sm font-semibold shadow-[0_0_24px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition"
                >
                  Sign in / Create account
                </button>

                <p className="mt-1 text-[10px] text-amber-100/65 max-w-[200px]">
                  Your account becomes your personal key to the house.
                </p>

                <button
                  type="button"
                  onClick={() => setShowKeypad(true)}
                  className="mt-2 text-[10px] text-amber-200/70 underline hover:text-amber-100/90"
                >
                  Admin access code
                </button>
              </div>
            )}

            {/* ---------------- 3. KEYPAD STATE ---------------- */}
            {showKeypad && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-between items-center mb-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                    Access code
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
                  4-digit admin route. Keep this between us.
                </p>
              </div>
            )}

            {/* ---------------- 4. INLINE CLERK AUTH ---------------- */}
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

                {/* little tabs for Sign in / Create account */}
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

                {/* Scrollable area so Clerk's button never gets cut off */}
                <div className="mt-2 max-h-72 w-full overflow-y-auto text-left">
                  {authTab === "signin" ? (
                    <SignIn
                      routing="hash"
                      path="/sign-in"
                      signUpUrl="#/sign-up"
                      redirectUrl="/#light-hallway"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent shadow-none border-none p-0",
                          headerTitle: "text-amber-100 text-sm mb-1",
                          headerSubtitle:
                            "text-amber-200/70 text-[11px] mb-3",
                          formFieldLabel: "text-amber-100 text-xs",
                          formFieldInput:
                            "bg-black/60 border border-amber-200/40 text-amber-50 text-xs",
                          formButtonPrimary:
                            "w-full mt-3 rounded-full bg-amber-400 text-black text-xs font-semibold " +
                            "shadow-[0_0_24px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition",
                          footer: "mt-2 text-[10px] text-amber-100/70",
                        },
                      }}
                    />
                  ) : (
                    <SignUp
                      routing="hash"
                      path="/sign-up"
                      signInUrl="#/sign-in"
                      redirectUrl="/#light-hallway"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent shadow-none border-none p-0",
                          headerTitle: "text-amber-100 text-sm mb-1",
                          headerSubtitle:
                            "text-amber-200/70 text-[11px] mb-3",
                          formFieldLabel: "text-amber-100 text-xs",
                          formFieldInput:
                            "bg-black/60 border border-amber-200/40 text-amber-50 text-xs",
                          formButtonPrimary:
                            "w-full mt-3 rounded-full bg-amber-400 text-black text-xs font-semibold " +
                            "shadow-[0_0_24px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition",
                          footer: "mt-2 text-[10px] text-amber-100/70",
                        },
                      }}
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
