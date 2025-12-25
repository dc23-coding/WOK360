// src/components/AccessDeniedModal.jsx
// Modal for displaying access denial reasons
import { motion } from "framer-motion";

export default function AccessDeniedModal({
  reason,           // "zone" or "level"
  message,          // Descriptive error message
  zoneName,         // Zone display name
  requiredLevel,    // Required access level if reason="level"
  user,             // User object
  variant = "light",
  onClose
}) {
  const isDark = variant === "dark";

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
            ? "bg-slate-900/95 border border-red-500/50"
            : "bg-black/95 border border-red-400/50"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className={`text-4xl mb-2 ${
            isDark ? "text-red-400" : "text-red-500"
          }`}>
            🚫
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Access Denied
          </h2>
          <p className="text-sm text-white/70">
            {message}
          </p>
        </div>

        {/* Details */}
        <div className={`p-4 rounded-lg mb-4 ${
          isDark
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-red-500/10 border border-red-400/20"
        }`}>
          {reason === "zone" && (
            <>
              <p className="text-sm text-white/90 mb-2">
                <strong className={isDark ? "text-cyan-400" : "text-amber-400"}>
                  {user?.name || "Your account"}
                </strong> doesn't have access to <strong>{zoneName}</strong>.
              </p>
              <p className="text-xs text-white/70 mb-2">
                Your current zones:
              </p>
              <ul className="text-xs text-white/80 pl-4 list-disc">
                {user?.access_zones?.map((zone) => (
                  <li key={zone}>{zone.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</li>
                )) || <li>None</li>}
              </ul>
            </>
          )}

          {reason === "level" && (
            <>
              <p className="text-sm text-white/90 mb-2">
                <strong className={isDark ? "text-cyan-400" : "text-amber-400"}>
                  {zoneName}
                </strong> requires <strong className="uppercase">{requiredLevel}</strong> access.
              </p>
              <p className="text-xs text-white/70">
                Your current level: <strong className="uppercase">{user?.access_level || "user"}</strong>
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {reason === "level" && requiredLevel === "premium" && (
            <button
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                isDark
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Upgrade to Premium
            </button>
          )}

          {reason === "zone" && (
            <p className="text-xs text-center text-white/60">
              Contact an admin to request zone access
            </p>
          )}

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
      </motion.div>
    </motion.div>
  );
}
