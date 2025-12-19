// src/components/GlobalAuthGate.jsx
// Universal authentication gate with Supabase + Wallet Connect
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseAuth } from "../context/ClerkAuthContext";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || "3104";

export default function GlobalAuthGate({ 
  worldName = "World",
  onAuthenticated,
  requireWallet = false 
}) {
  const { user, signIn, signUp } = useSupabaseAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("signin");
  const [showKeypad, setShowKeypad] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const modalRef = useRef(null);

  // Check if fully authenticated
  const isFullyAuthenticated = user && (!requireWallet || walletAddress);

  useEffect(() => {
    if (isFullyAuthenticated) {
      onAuthenticated?.();
    }
  }, [isFullyAuthenticated]);

  // Keypad handlers
  const handleDigit = (d) => {
    setError("");
    if (code.length >= 4) return;

    const next = code + d;
    setCode(next);

    if (next.length === 4) {
      if (next === String(ADMIN_CODE)) {
        setTimeout(() => {
          onAuthenticated?.();
          setShowKeypad(false);
          setCode("");
        }, 120);
      } else {
        setError("Access denied");
        setTimeout(() => setCode(""), 250);
      }
    }
  };

  const handleBackspace = () => {
    setError("");
    setCode((p) => p.slice(0, -1));
  };

  // Wallet connection
  const connectWallet = async () => {
    setWalletConnecting(true);
    try {
      // Mock wallet connection - replace with actual Web3 provider
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42).padEnd(40, "0");
      setWalletAddress(mockAddress);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setWalletConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  // If already authenticated, don't show gate
  if (isFullyAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/30 to-purple-950/30" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {worldName}
          </h1>
          <p className="text-cyan-400/70">Authentication Required</p>
        </motion.div>

        {/* Auth Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Supabase Auth */}
          {!user && (
            <button
              onClick={() => setShowAuth(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all"
            >
              Sign In / Sign Up
            </button>
          )}

          {/* User signed in, show wallet connection if required */}
          {user && requireWallet && !walletAddress && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <p className="text-sm text-cyan-400 mb-2">✓ Signed in as {user.email}</p>
                <p className="text-xs text-cyan-400/70">Now connect your wallet to continue</p>
              </div>

              <button
                onClick={connectWallet}
                disabled={walletConnecting}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {walletConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          )}

          {/* Admin Keypad */}
          <button
            onClick={() => setShowKeypad(true)}
            className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-xl border border-white/10 transition-all"
          >
            Admin Access
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-white/40 mt-8"
        >
          Part of World of Karma 360
        </motion.p>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-gradient-to-br from-slate-900 to-cyan-900 rounded-2xl border border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-cyan-500/20">
                <button
                  onClick={() => setAuthTab("signin")}
                  className={`flex-1 py-4 text-sm font-semibold transition ${
                    authTab === "signin"
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthTab("signup")}
                  className={`flex-1 py-4 text-sm font-semibold transition ${
                    authTab === "signup"
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Forms */}
              <div className="p-6">
                {authTab === "signin" ? (
                  <SignInForm onSuccess={() => setShowAuth(false)} />
                ) : (
                  <SignUpForm onSuccess={() => setShowAuth(false)} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keypad Modal */}
      <AnimatePresence>
        {showKeypad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowKeypad(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xs bg-slate-900 rounded-2xl border border-cyan-500/30 p-6"
            >
              <h3 className="text-center text-cyan-400 font-semibold mb-4">Admin Access</h3>

              {/* Display */}
              <div className="bg-black/50 rounded-lg p-4 mb-4 h-16 flex items-center justify-center border border-cyan-500/20">
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < code.length ? "bg-cyan-400" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center mb-2">{error}</p>
              )}

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDigit(String(num))}
                    className="aspect-square bg-cyan-500/10 hover:bg-cyan-500/20 text-white font-semibold text-lg rounded-lg border border-cyan-500/30 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button className="aspect-square bg-transparent" disabled />
                <button
                  onClick={() => handleDigit("0")}
                  className="aspect-square bg-cyan-500/10 hover:bg-cyan-500/20 text-white font-semibold text-lg rounded-lg border border-cyan-500/30 transition-all"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="aspect-square bg-red-500/10 hover:bg-red-500/20 text-white text-lg rounded-lg border border-red-500/30 transition-all"
                >
                  ←
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
