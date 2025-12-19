// src/universe/components/RegionCard.jsx
import { motion } from "framer-motion";

export default function RegionCard({ region, isAccessible, onEnter, delay = 0 }) {
  const isActive = region.status === "active";
  const isLocked = !isAccessible;
  const requiresAuth = region.requiredAccess === "authenticated";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative rounded-3xl overflow-hidden border
        ${isActive && !isLocked
          ? "border-cyan-400/50 bg-gradient-to-b from-slate-800 to-slate-900 hover:border-cyan-400 cursor-pointer"
          : "border-slate-700 bg-slate-900/50 opacity-75"
        }
        transition-all duration-300
      `}
      onClick={() => isActive && !isLocked && onEnter()}
    >
      {/* Thumbnail Background */}
      <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-500">
        {/* Placeholder for thumbnail image */}
        <div className="text-6xl opacity-30">🏛️</div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400/80">
              {region.district}
            </p>
            <h3 className="text-xl font-bold text-white mt-1">{region.name}</h3>
          </div>
          
          {/* Status Badge */}
          {region.status === "coming-soon" ? (
            <span className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs">
              Soon
            </span>
          ) : isLocked ? (
            <span className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
              🔒 Premium
            </span>
          ) : requiresAuth ? (
            <span className="px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs">
              🔑 Login
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-300 text-xs">
              ✓ Free
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {region.description}
        </p>

        {/* Features List */}
        <div className="space-y-1 mb-4">
          {region.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-cyan-400/60" />
              {feature}
            </div>
          ))}
        </div>

        {/* Enter Button */}
        {isActive && !isLocked && (
          <button
            className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-sm font-medium transition"
          >
            Enter World →
          </button>
        )}

        {isActive && isLocked && (
          <button
            className="w-full py-2 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-400 text-sm cursor-not-allowed"
            disabled
          >
            Premium Required
          </button>
        )}

        {!isActive && (
          <button
            className="w-full py-2 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-500 text-sm cursor-not-allowed"
            disabled
          >
            Coming Soon
          </button>
        )}
      </div>

      {/* Glow Effect for Active Accessible Regions */}
      {isActive && !isLocked && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-amber-500/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
      )}
    </motion.div>
  );
}
