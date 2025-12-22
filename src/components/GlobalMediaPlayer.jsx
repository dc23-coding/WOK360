// src/components/GlobalMediaPlayer.jsx
// Persistent floating media player
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Music, Video } from "lucide-react";
import { useMediaPlayer } from "../context/MediaPlayerContext";

export default function GlobalMediaPlayer() {
  const { currentMedia, isPlaying, togglePlayPause, stopMedia } = useMediaPlayer();

  if (!currentMedia) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-md"
      >
        <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              {currentMedia.thumbnailUrl ? (
                <img 
                  src={currentMedia.thumbnailUrl} 
                  alt={currentMedia.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : currentMedia.contentType === 'audio' ? (
                <Music className="w-6 h-6 text-cyan-400" />
              ) : (
                <Video className="w-6 h-6 text-cyan-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm truncate">
                {currentMedia.title}
              </h4>
              {currentMedia.subtitle && (
                <p className="text-cyan-400/70 text-xs truncate">
                  {currentMedia.subtitle}
                </p>
              )}
              {currentMedia.duration && (
                <p className="text-cyan-400/50 text-[10px] mt-1">
                  {currentMedia.duration}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 transition flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-black" fill="currentColor" />
                )}
              </button>
              <button
                onClick={stopMedia}
                className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 transition flex items-center justify-center"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          {isPlaying && (
            <div className="mt-3 h-1 bg-cyan-500/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
