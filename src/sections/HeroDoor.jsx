// src/sections/HeroDoor.jsx
import { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import RoomSection from "../components/RoomSection";

const CORRECT_CODE = "3104";

export default function HeroDoor({
  isSignedIn,
  canEnter,
  onKeypadAccess,
  onEnterHouse,
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("signin"); // 'signin' | 'signup'
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // close auth overlay automatically once Clerk signs user in
  useEffect(() => {
    if (isSignedIn && showAuth) {
      setShowAuth(false);
    }
  }, [isSignedIn, showAuth]);

  // ----- keypad logic -----
  const handleDigit = (d) => {
    setError("");
    if (input.length >= 4) return;
    const next = input + d;
    setInput(next);

    if (next.length === 4) {
      if (next === CORRECT_CODE) {
        setTimeout(() => {
          onKeypadAccess(); // mark this device as trusted
          setShowKeypad(false);
          setInput("");
        }, 120);
      } else {
        setError("Access denied");
        setTimeout(() => setInput(""), 250);
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
  };

  return (
    <RoomSection bg="/Frontdoor_Main.png" className="bg-black">
      <div className="relative w-full h-full flex flex-col items-center justify-center text-center text-amber-50 px-4">
        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            World of Karma 360
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-amber-100/80">
            Step through the door into a living house of stories, live feeds, and
            private rooms.
          </p>
        </div>

        {/* GLOWING PLATE */}
        <div
          className="
            relative
            w-[270px] md:w-[290px]
            rounded-[30px]
            bg-black/92
            border border-amber-300/80
            shadow-[0_0_90px_rgba(252,211,77,0.9)]
            px-6 py-7 md:px-7 md:py-8
            flex flex-col items-center justify-center
          "
        >
          <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-b from-amber-50/8 via-transparent to-amber-200/18" />

          {/* ---- ACCESS GRANTED (ENTER HOUSE) ---- */}
          {canEnter && !showKeypad && (
            <div className="relative z-10 flex flex-col items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                Access granted
              </p>

              <button
                type="button"
                onClick={onEnterHouse}
                className="
                  inline-flex items-center justify-center
                  px-6 py-2.5
                  rounded-full
                  bg-amber-400
                  text-black text-sm font-semibold
                  shadow-[0_0_26px_rgba(252,211,77,0.95)]
                  hover:bg-amber-300
                  transition
                "
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

          {/* ---- GUEST VIEW (NO ACCESS YET) ---- */}
          {!canEnter && !showKeypad && (
            <div className="relative z-10 flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                Welcome guest
              </p>

              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="
                  inline-flex items-center justify-center
                  px-5 py-2.5
                  rounded-full
                  bg-amber-400
                  text-black text-sm font-semibold
                  shadow-[0_0_24px_rgba(252,211,77,0.9)]
                  hover:bg-amber-300
                  transition
                "
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

          {/* ---- KEYPAD (SECRET PATH) ---- */}
          {showKeypad && (
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-full flex justify-between items-center mb-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
                  Access code
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowKeypad(false);
                    setInput("");
                    setError("");
                  }}
                  className="text-[10px] text-amber-200/70 hover:text-amber-100/90"
                >
                  Back
                </button>
              </div>

              {/* dots */}
              <div className="flex gap-2 mb-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={[
                      "w-3 h-3 rounded-full border border-amber-200/60",
                      input[i] ? "bg-amber-300" : "bg-transparent",
                    ].join(" ")}
                  />
                ))}
              </div>

              {error && (
                <p className="text-[10px] text-red-300/90 h-3">{error}</p>
              )}

              {/* keypad grid */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleDigit(String(n))}
                    className="
                      w-11 h-8 md:w-12 md:h-9
                      rounded-full
                      bg-amber-100/10
                      border border-amber-200/40
                      hover:bg-amber-100/20
                      transition
                    "
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClear}
                  className="
                    w-11 h-8 md:w-12 md:h-9
                    rounded-full
                    text-[10px]
                    bg-transparent
                    border border-amber-200/40
                    hover:bg-amber-100/10
                    transition
                  "
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleDigit("0")}
                  className="
                    w-11 h-8 md:w-12 md:h-9
                    rounded-full
                    bg-amber-100/10
                    border border-amber-200/40
                    hover:bg-amber-100/20
                    transition
                  "
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
        </div>

        {/* ---- CLERK AUTH OVERLAY (REGISTER / LOGIN) ---- */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
            <div className="w-[360px] max-w-[92%] rounded-3xl bg-[#050507] border border-amber-200/30 px-6 py-5 text-left">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-amber-100">
                  Sign in or create account
                </h2>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-xs text-amber-200/70 hover:text-amber-50"
                >
                  Close
                </button>
              </div>

              <div className="flex gap-3 mb-4 text-[11px]">
                <button
                  className={`px-3 py-1 rounded-full ${
                    authTab === "signin"
                      ? "bg-amber-300 text-black"
                      : "bg-transparent border border-amber-200/40 text-amber-100"
                  }`}
                  onClick={() => setAuthTab("signin")}
                >
                  Sign in
                </button>
                <button
                  className={`px-3 py-1 rounded-full ${
                    authTab === "signup"
                      ? "bg-amber-300 text-black"
                      : "bg-transparent border border-amber-200/40 text-amber-100"
                  }`}
                  onClick={() => setAuthTab("signup")}
                >
                  Create account
                </button>
              </div>

              <div className="text-xs text-amber-100/80">
                {authTab === "signin" ? (
                  <SignIn
                    routing="hash"
                    path="/sign-in"
                    signUpUrl="#/sign-up"
                    appearance={{ elements: { card: "bg-transparent shadow-none border-none" } }}
                  />
                ) : (
                  <SignUp
                    routing="hash"
                    path="/sign-up"
                    signInUrl="#/sign-in"
                    appearance={{ elements: { card: "bg-transparent shadow-none border-none" } }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RoomSection>
  );
}
