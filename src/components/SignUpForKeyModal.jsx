// src/components/SignUpForKeyModal.jsx
// Modal for new users to sign up and get an access key
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function SignUpForKeyModal({ variant = "light", onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);

  const isDark = variant === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('access_keys')
        .select('code, name')
        .eq('email', email)
        .single();

      if (existing) {
        setGeneratedCode(existing.code);
        setIsSubmitting(false);
        return;
      }

      // Call create_access_key function
      const { data, error: createError } = await supabase
        .rpc('create_access_key', {
          p_name: name.trim(),
          p_email: email.trim().toLowerCase(),
          p_zones: ['kazmo-mansion', 'club-hollywood']
        });

      if (createError) throw createError;

      if (data && data.code) {
        setGeneratedCode(data.code);
        
        // Fetch full user object
        const { data: user } = await supabase
          .from('access_keys')
          .select('*')
          .eq('code', data.code)
          .single();

        setTimeout(() => {
          onSuccess?.(user || { code: data.code });
        }, 2000);
      } else {
        throw new Error("No code returned");
      }

    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to create access key");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative max-w-md w-full rounded-2xl p-6 ${
          isDark
            ? "bg-slate-900/95 border border-cyan-500/50"
            : "bg-black/95 border border-amber-300/50"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {!generatedCode ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Get Your Access Key
              </h2>
              <p className="text-sm text-white/70">
                Enter your details to receive a unique 4-digit access code
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-black/50 border text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                    isDark
                      ? "border-cyan-500/30 focus:ring-cyan-500/50"
                      : "border-amber-300/30 focus:ring-amber-500/50"
                  }`}
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-black/50 border text-white placeholder-white/40 focus:outline-none focus:ring-2 ${
                    isDark
                      ? "border-cyan-500/30 focus:ring-cyan-500/50"
                      : "border-amber-300/30 focus:ring-amber-500/50"
                  }`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  isDark
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Creating..." : "Get Access Key"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
            </form>

            <p className="mt-4 text-xs text-center text-white/60">
              Your access key will be sent to your email and displayed here
            </p>
          </>
        ) : (
          <>
            {/* Success View */}
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Your Access Key
              </h2>
              <p className="text-sm text-white/70 mb-6">
                Save this code - you'll need it to enter
              </p>

              {/* Generated Code Display */}
              <div className={`p-6 rounded-2xl mb-6 ${
                isDark
                  ? "bg-cyan-500/20 border-2 border-cyan-500"
                  : "bg-amber-300/20 border-2 border-amber-500"
              }`}>
                <div className="flex items-center justify-center gap-3">
                  {generatedCode.split("").map((digit, i) => (
                    <motion.div
                      key={i}
                      className={`w-12 h-16 flex items-center justify-center rounded-lg text-3xl font-bold ${
                        isDark
                          ? "bg-cyan-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-white/80 mb-4">
                Entering automatically...
              </p>

              <button
                onClick={onClose}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
