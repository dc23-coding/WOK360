import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PresenceIndicator({ count = 0, variant = "dark" }) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsUpdating(true);
      
      // Animate count change
      const duration = 500;
      const steps = 20;
      const increment = (count - displayCount) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayCount(count);
          clearInterval(interval);
          setIsUpdating(false);
        } else {
          setDisplayCount(prev => Math.round(prev + increment));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [count]);

  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-2">
      {/* Pulse Indicator */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`w-2 h-2 rounded-full ${
            isDark ? "bg-cyan-400" : "bg-purple-400"
          }`}
        />
        
        {/* Outer ring pulse */}
        <motion.div
          animate={{
            scale: [1, 1.5],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className={`absolute inset-0 rounded-full border-2 ${
            isDark ? "border-cyan-400" : "border-purple-400"
          }`}
        />
      </div>

      {/* Count Display */}
      <AnimatePresence mode="wait">
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className={`text-sm font-medium ${
            isUpdating
              ? isDark
                ? "text-cyan-300"
                : "text-purple-300"
              : "text-white/70"
          }`}
        >
          {displayCount}
        </motion.span>
      </AnimatePresence>

      <span className="text-xs text-white/40">
        {displayCount === 1 ? "viewer" : "viewers"}
      </span>

      {/* Update indicator */}
      {isUpdating && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className={`text-xs ${
            isDark ? "text-cyan-400" : "text-purple-400"
          }`}
        >
          {count > displayCount ? "↑" : "↓"}
        </motion.span>
      )}
    </div>
  );
}
