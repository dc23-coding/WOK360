import { motion } from "framer-motion";

export default function MixSelector({ mixes = [], activeMixId, onSelectMix }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h3 className="text-white font-semibold text-sm mb-3">Available Mixes</h3>
      
      <div className="space-y-2">
        {mixes.map((mix, index) => {
          const isActive = mix.id === activeMixId;
          
          return (
            <motion.button
              key={mix.id}
              onClick={() => onSelectMix(mix)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full text-left p-3 rounded-lg transition-all
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{mix.emoji || "🎵"}</span>
                    <span className={`font-medium ${isActive ? "text-cyan-300" : "text-white"}`}>
                      {mix.name}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto"
                      >
                        <span className="flex items-center gap-1 text-xs text-cyan-400">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                          Now Playing
                        </span>
                      </motion.span>
                    )}
                  </div>
                  
                  {mix.description && (
                    <p className={`text-xs ${isActive ? "text-cyan-200/70" : "text-white/50"}`}>
                      {mix.description}
                    </p>
                  )}
                  
                  {mix.duration && (
                    <p className="text-xs text-white/40 mt-1">
                      Duration: {mix.duration}
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {mixes.length === 0 && (
        <div className="text-center py-8 text-white/50 text-sm">
          No mixes available
        </div>
      )}
    </div>
  );
}
