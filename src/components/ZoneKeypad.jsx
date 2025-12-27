// src/components/ZoneKeypad.jsx
// Unified keypad for zone-based access control
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { MASTER_KEY } from "../lib/zoneAccessControl";
import AccessDeniedModal from "./AccessDeniedModal";
import SignUpForKeyModal from "./SignUpForKeyModal";

export default function ZoneKeypad({ 
  zoneName,           // Display name: "Kazmo Mansion"
  zoneId,             // Database ID: "kazmo-mansion"
  requiredLevel = "user",
  onAccessGranted,    // Called when access approved (passes user object)
  onAdminAccess,      // Called when master key entered
  variant = "light"   // "light" or "dark" styling
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [accessStatus, setAccessStatus] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const isDark = variant === "dark";

  const handleDigit = (digit) => {
    setError("");
    if (code.length >= 4) return;

    const nextCode = code + digit;
    setCode(nextCode);

    // Auto-check when 4 digits entered
    if (nextCode.length === 4) {
      setTimeout(() => checkAccess(nextCode), 100);
    }
  };

  const handleBackspace = () => {
    setError("");
    setCode(code.slice(0, -1));
  };

  const checkAccess = async (enteredCode) => {
    setIsChecking(true);
    setError("");

    // MASTER KEY - Always grants admin access to ALL zones
    if (enteredCode === MASTER_KEY) {
      setAccessStatus({ 
        granted: true, 
        level: "admin", 
        user: { name: "Admin", access_level: "admin" },
        isMasterKey: true
      });
      
      // Store admin session
      localStorage.setItem('accessCode', MASTER_KEY);
      localStorage.setItem('isAdmin', 'true');
      
      onAdminAccess?.();
      
      setTimeout(() => {
        onAccessGranted?.({ admin: true });
        setIsChecking(false);
      }, 500);
      return;
    }

    try {
      // Look up user by code
      const { data: user, error: userError } = await supabase
        .from('access_keys')
        .select('*')
        .eq('code', enteredCode)
        .eq('is_active', true)
        .single();

      if (userError || !user) {
        setError("Invalid access code");
        setCode("");
        setIsChecking(false);
        return;
      }

      // Check if user has access to this zone
      const hasZoneAccess = user.access_zones.includes(zoneId);
      
      if (!hasZoneAccess) {
        setAccessStatus({
          granted: false,
          reason: "zone",
          message: `Your code doesn't have access to ${zoneName}`,
          user
        });
        setCode("");
        setIsChecking(false);
        return;
      }

      // Check access level
      const levels = { user: 1, premium: 2, admin: 3 };
      const hasRequiredLevel = levels[user.access_level] >= levels[requiredLevel];

      if (!hasRequiredLevel) {
        setAccessStatus({
          granted: false,
          reason: "level",
          message: `${zoneName} requires ${requiredLevel} access`,
          requiredLevel,
          user
        });
        setCode("");
        setIsChecking(false);
        return;
      }

      // ACCESS GRANTED
      setAccessStatus({ granted: true, user });

      // Update last used timestamp
      await supabase
        .from('access_keys')
        .update({ 
          last_used: new Date().toISOString(),
          login_count: (user.login_count || 0) + 1 
        })
        .eq('code', enteredCode);

      // Track zone entry
      await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'zone_entry',
        activity_data: { zone_name: zoneName },
        zone_id: zoneId
      });

      // Store user session
      localStorage.setItem('accessCode', enteredCode);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.removeItem('isAdmin');

      setTimeout(() => {
        onAccessGranted?.(user);
        setIsChecking(false);
      }, 500);

    } catch (err) {
      console.error("Access check error:", err);
      setError("System error - please try again");
      setCode("");
      setIsChecking(false);
    }
  };

  return (
    <div className="relative w-full max-h-[90vh] flex flex-col items-center justify-center overflow-y-auto py-4">
      {/* Access Denied Modal */}
      <AnimatePresence>
        {accessStatus && !accessStatus.granted && (
          <AccessDeniedModal 
            reason={accessStatus.reason}
            message={accessStatus.message}
            zoneName={zoneName}
            requiredLevel={accessStatus.requiredLevel}
            user={accessStatus.user}
            variant={variant}
            onClose={() => {
              setAccessStatus(null);
              setCode("");
            }}
          />
        )}
      </AnimatePresence>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && (
          <SignUpForKeyModal
            variant={variant}
            onClose={() => setShowSignUp(false)}
            onSuccess={(user) => {
              setShowSignUp(false);
              // Auto-enter with new code
              checkAccess(user.code);
            }}
          />
        )}
      </AnimatePresence>

      {/* Keypad Container */}
      <motion.div
        className={`relative w-[290px] md:w-[320px] rounded-[32px] px-6 py-7 md:px-7 md:py-8 flex flex-col items-center justify-center transition-transform duration-300 mb-4 ${
          isDark
            ? "bg-slate-900/92 border border-cyan-500/80 shadow-[0_0_90px_rgba(34,211,238,0.9)]"
            : "bg-black/92 border border-amber-300/80 shadow-[0_0_90px_rgba(252,211,77,0.9)]"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b ${
          isDark
            ? "from-cyan-50/8 via-transparent to-cyan-200/18"
            : "from-amber-50/8 via-transparent to-amber-200/18"
        }`} />

        <div className="relative z-10 w-full">
          {/* Zone Title */}
          <p className={`text-center text-[10px] uppercase tracking-[0.3em] mb-4 ${
            isDark ? "text-cyan-400/80" : "text-amber-300/80"
          }`}>
            {zoneName}
          </p>

          {/* Code Display */}
          <div className={`w-full h-16 rounded-lg mb-4 flex items-center justify-center border ${
            isDark
              ? "bg-black/50 border-cyan-500/20"
              : "bg-black/50 border-amber-200/40"
          }`}>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < code.length
                      ? isDark ? "bg-cyan-400" : "bg-amber-400"
                      : "bg-white/20"
                  }`}
                  animate={i < code.length ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs text-center mb-3"
            >
              {error}
            </motion.p>
          )}

          {/* Checking Status */}
          {isChecking && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs text-center mb-3 ${
                isDark ? "text-cyan-400" : "text-amber-400"
              }`}
            >
              Checking access...
            </motion.p>
          )}

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleDigit(String(num))}
                disabled={isChecking}
                className={`w-full aspect-square rounded-lg font-semibold text-lg transition-all ${
                  isDark
                    ? "bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-white"
                    : "bg-amber-100/10 hover:bg-amber-100/20 border border-amber-200/40 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleDigit("0")}
              disabled={isChecking}
              className={`w-full aspect-square rounded-lg font-semibold text-lg transition-all ${
                isDark
                  ? "bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-white"
                  : "bg-amber-100/10 hover:bg-amber-100/20 border border-amber-200/40 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isChecking || code.length === 0}
              className={`w-full aspect-square rounded-lg text-lg transition-all ${
                isDark
                  ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
                  : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ←
            </button>
          </div>

          {/* Get Access Key Button */}
          <button
            onClick={() => setShowSignUp(true)}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
              isDark
                ? "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300"
                : "bg-amber-300/20 hover:bg-amber-300/30 border border-amber-300/40 text-amber-300"
            }`}
          >
            Get Access Key
          </button>

          <p className={`mt-2 text-[10px] text-center ${
            isDark ? "text-cyan-100/60" : "text-amber-100/60"
          }`}>
            Enter your 4-digit access code
          </p>
        </div>
      </motion.div>
    </div>
  );
}
