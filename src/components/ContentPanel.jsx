// src/components/ContentPanel.jsx
// Reusable content panel for displaying Sanity media items
import { motion } from "framer-motion";

export default function ContentPanel({ item, onClick, index = 0 }) {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick?.(item)}
      className="group relative cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900/50">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              {item.contentType === 'video' && <span>▶️</span>}
              {item.contentType === 'audio' && <span>🎵</span>}
              {item.isLive && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
              {item.duration && <span>{item.duration}</span>}
            </div>
          </div>
        </div>

        {/* Premium badge */}
        {item.accessLevel === 'premium' && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded text-xs font-bold text-black">
            PREMIUM
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {item.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
