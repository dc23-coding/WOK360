// src/universe/components/MapGlobe.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function MapGlobe({ regions, accessibleRegions, onRegionClick }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * 3;
          const duration = Math.random() * 2 + 2;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Globe Container with Scaling Animation */}
      <motion.div 
        className="relative w-full max-w-2xl aspect-square z-10"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Globe Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-cyan-400/30 shadow-[0_0_80px_rgba(34,211,238,0.3)]">
          {/* Grid Lines Effect */}
          <div className="absolute inset-0 rounded-full opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Latitude lines */}
              {[20, 40, 60, 80].map(y => (
                <ellipse
                  key={`lat-${y}`}
                  cx="50"
                  cy={y}
                  rx="45"
                  ry="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-cyan-400"
                />
              ))}
              {/* Longitude lines */}
              {[-30, -15, 0, 15, 30].map(offset => (
                <ellipse
                  key={`lng-${offset}`}
                  cx="50"
                  cy="50"
                  rx="5"
                  ry="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-cyan-400"
                  transform={`rotate(${offset} 50 50)`}
                />
              ))}
            </svg>
          </div>

          {/* Region Markers */}
          {regions.map((region, idx) => {
            const isAccessible = accessibleRegions.includes(region);
            const isActive = region.status === "active";
            
            // Convert coordinates to position on circle (simplified projection)
            const angle = (idx / regions.length) * 2 * Math.PI;
            const radius = 38; // percentage from center
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <motion.div
                key={region.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Marker Dot */}
                <motion.button
                  onClick={() => isActive && isAccessible && onRegionClick(region.id)}
                  className={`
                    w-4 h-4 rounded-full border-2 relative
                    ${isActive && isAccessible
                      ? "bg-cyan-400 border-cyan-300 cursor-pointer hover:scale-150 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                      : isActive
                        ? "bg-red-400/50 border-red-300/50 cursor-not-allowed"
                        : "bg-slate-600 border-slate-500 cursor-not-allowed"
                    }
                    transition-all duration-300
                  `}
                  whileHover={{ scale: isActive && isAccessible ? 1.5 : 1 }}
                >
                  {/* Pulse Animation for Active Regions */}
                  {isActive && isAccessible && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>

                {/* Tooltip */}
                {hoveredRegion === region.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap"
                  >
                    <div className="px-3 py-2 rounded-lg bg-slate-900/95 border border-cyan-400/50 shadow-xl backdrop-blur">
                      <p className="text-xs text-cyan-400 uppercase tracking-wider">
                        {region.district}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {region.name}
                      </p>
                      {!isAccessible && isActive && (
                        <p className="text-xs text-red-400 mt-1">🔒 Premium</p>
                      )}
                      {!isActive && (
                        <p className="text-xs text-amber-400 mt-1">Coming Soon</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Center Logo/Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl mb-2 opacity-30"
            >
              🌍
            </motion.div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/60">
              Karma Universe
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="absolute bottom-0 right-0 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-4 text-xs z-20">
        <p className="text-slate-400 mb-2 font-semibold">Legend:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-300" />
            <span className="text-slate-300">Active & Accessible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/50 border border-red-300/50" />
            <span className="text-slate-300">Premium Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600 border border-slate-500" />
            <span className="text-slate-300">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
