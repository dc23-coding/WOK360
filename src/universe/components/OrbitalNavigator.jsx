// src/universe/components/OrbitalNavigator.jsx
// Orbital navigation system for cycling through zones
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrbitalNavigator({ regions, onSelectZone, isPremium }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const activeRegion = regions[activeIndex];
  const totalZones = regions.length;

  // Auto-rotate orbit every 5 seconds if not manually controlled
  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isRotating, activeIndex]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalZones);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalZones) % totalZones);
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const isAccessible = (region) => {
    if (region.status !== "active") return false;
    if (region.requiredAccess === "premium" && !isPremium) return false;
    return true;
  };

  const getStatusInfo = (region) => {
    if (region.status === "coming-soon") return { label: "Coming Soon", color: "amber", icon: "⏳" };
    if (region.status === "preview") return { label: "Preview", color: "purple", icon: "👁️" };
    if (region.requiredAccess === "premium" && !isPremium) return { label: "Premium", color: "rose", icon: "🔒" };
    if (region.requiredAccess === "authenticated") return { label: "Login Required", color: "cyan", icon: "🔑" };
    return { label: "Open Access", color: "green", icon: "✓" };
  };

  const statusInfo = getStatusInfo(activeRegion);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Orbital Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[90%] h-[90%] md:w-[600px] md:h-[600px] rounded-full border-2 border-dashed border-cyan-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* Zone Indicators on Orbit */}
          {regions.map((region, index) => {
            const angle = (index / totalZones) * 360;
            const isActive = index === activeIndex;
            
            return (
              <motion.div
                key={region.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(${isActive ? '260px' : '240px'}) rotate(-${angle}deg)`,
                }}
                animate={{
                  scale: isActive ? 1.3 : 1,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => handleDotClick(index)}
                  className={`
                    w-3 h-3 rounded-full transition-all
                    ${isActive 
                      ? 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]' 
                      : 'bg-slate-600 hover:bg-cyan-400/50'
                    }
                  `}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Center Content - Zone Preview */}
      <div className="relative z-10 max-w-2xl w-full px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRegion.id}
            initial={{ opacity: 0, x: direction * 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -50, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.3)] overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
              {activeRegion.thumbnail ? (
                <img 
                  src={activeRegion.thumbnail} 
                  alt={activeRegion.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-30">
                  {activeRegion.id === 'kazmo-mansion' ? '🏰' : 
                   activeRegion.id === 'club-hollywood' ? '🎬' : 
                   activeRegion.id === 'shadow-market' ? '💎' : '🌍'}
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`
                absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md
                ${statusInfo.color === 'amber' ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300' :
                  statusInfo.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/60 text-purple-300' :
                  statusInfo.color === 'rose' ? 'bg-rose-500/20 border border-rose-500/60 text-rose-300' :
                  statusInfo.color === 'cyan' ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300' :
                  'bg-green-500/20 border border-green-500/60 text-green-300'}
              `}>
                <span className="text-xs font-medium">{statusInfo.icon} {statusInfo.label}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
                  {activeRegion.district}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {activeRegion.name}
                </h2>
                {activeRegion.owner && (
                  <p className="text-sm text-slate-400">
                    Hosted by <span className="text-cyan-400">{activeRegion.owner}</span>
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {activeRegion.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRegion.features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Code */}
              {activeRegion.zoneCode && (
                <div className="mb-6 inline-block px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-500">Zone Code: </span>
                  <span className="text-sm font-mono text-cyan-400">{activeRegion.zoneCode}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => isAccessible(activeRegion) && onSelectZone(activeRegion.id)}
                disabled={!isAccessible(activeRegion)}
                className={`
                  w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all
                  ${isAccessible(activeRegion)
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                {isAccessible(activeRegion) ? (
                  <>Enter {activeRegion.name} →</>
                ) : (
                  <>{statusInfo.label}</>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Previous */}
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur border border-cyan-400/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-lg"
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {regions.map((region, index) => (
              <button
                key={region.id}
                onClick={() => handleDotClick(index)}
                className={`
                  h-2 rounded-full transition-all
                  ${index === activeIndex 
                    ? 'w-8 bg-cyan-400' 
                    : 'w-2 bg-slate-600 hover:bg-cyan-400/50'
                  }
                `}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur border border-cyan-400/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-lg"
          >
            →
          </button>
        </div>

        {/* Auto-rotate Toggle */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`
              px-4 py-2 rounded-full text-xs font-medium transition-all
              ${isRotating
                ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-300'
              }
            `}
          >
            {isRotating ? '⏸ Pause Auto-Cycle' : '▶ Auto-Cycle Zones'}
          </button>
        </div>
      </div>

      {/* Zone Counter */}
      <div className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900/80 backdrop-blur rounded-full border border-slate-700">
        <span className="text-xs text-slate-400">
          {activeIndex + 1} / {totalZones}
        </span>
      </div>
    </div>
  );
}
