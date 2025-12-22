// src/components/VibePlayer.jsx
// Music player with selectable mixes/vibes for Club Hollywood & Private Lounge
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";
import { sanityClient } from "../lib/sanityClient";
import { useMediaPlayer } from "../context/MediaPlayerContext";

export default function VibePlayer({ variant = "dark", mode = "vod", locked = false, roomId = "club-main-stage" }) {
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const { playMedia, currentMedia, isPlaying } = useMediaPlayer();

  // Fetch content assigned to this room
  useEffect(() => {
    console.log(`[VibePlayer] Fetching content for roomId: ${roomId}`);
    sanityClient.fetch(
      `*[_type == "mediaContent" && room == $roomId && defined(mediaFile.asset)] | order(_createdAt desc) {
        _id,
        title,
        subtitle,
        description,
        contentType,
        "mediaUrl": mediaFile.asset->url,
        "thumbnailUrl": thumbnail.asset->url,
        duration,
        tags,
        room,
        zone
      }`,
      { roomId }
    ).then(data => {
      console.log(`[VibePlayer] Fetched ${data?.length || 0} items for ${roomId}:`, data);
      setVibes(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(`[VibePlayer] Failed to load content for ${roomId}:`, err);
      setLoading(false);
    });
  }, [roomId]);

  const isDark = variant === "dark";

  if (loading) {
    return (
      <div className={`rounded-2xl border backdrop-blur p-8 text-center ${
        isDark ? "border-cyan-500/30 bg-slate-900/80" : "border-purple-500/30 bg-slate-900/80"
      }`}>
        <p className="text-white/60">Loading content...</p>
        <p className="text-xs text-white/40 mt-2">Querying: {roomId}</p>
      </div>
    );
  }

  if (vibes.length === 0) {
    return (
      <div className={`rounded-2xl border backdrop-blur p-8 text-center ${
        isDark ? "border-cyan-500/30 bg-slate-900/80" : "border-purple-500/30 bg-slate-900/80"
      }`}>
        <p className="text-white/60">No content assigned to this player yet.</p>
        <p className="text-xs text-white/40 mt-2">Room ID: {roomId}</p>
        <p className="text-xs text-white/40 mt-1">Use the Control Room in Dark Hallway to assign content</p>
        <p className="text-xs text-amber-400 mt-2">🎛️ Go to: Dark Hallway → Content Control Room → Manage → Assign tracks to "🎭 Main Stage"</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Player Container */}
      <div className={`rounded-2xl border backdrop-blur overflow-hidden ${
        isDark 
          ? "border-cyan-500/30 bg-slate-900/80" 
          : "border-purple-500/30 bg-slate-900/80"
      }`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-white hover:text-cyan-300 transition flex items-center gap-2"
          >
            <Music className="w-4 h-4" />
            {isExpanded ? "Hide" : "Show"} Playlist ({vibes.length})
            <span className="text-xs opacity-60">{isExpanded ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* Expanded Playlist */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                {vibes.map((vibe) => (
                  <button
                    key={vibe._id}
                    onClick={() => playMedia(vibe)}
                    disabled={locked}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left ${
                      locked ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                      currentMedia?._id === vibe._id
                        ? "bg-cyan-500/20 border border-cyan-500/50"
                        : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-slate-700/50 rounded flex items-center justify-center flex-shrink-0">
                      {vibe.thumbnailUrl ? (
                        <img 
                          src={vibe.thumbnailUrl} 
                          alt={vibe.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-cyan-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{vibe.title}</h4>
                      {vibe.subtitle && (
                        <p className="text-xs text-white/60 truncate">{vibe.subtitle}</p>
                      )}
                      {vibe.duration && (
                        <p className="text-[10px] text-white/40 mt-1">{vibe.duration}</p>
                      )}
                    </div>

                    {/* Play indicator */}
                    <div className="flex-shrink-0">
                      {currentMedia?._id === vibe._id ? (
                        isPlaying ? (
                          <Pause className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Play className="w-5 h-5 text-cyan-400" />
                        )
                      ) : (
                        <Play className="w-5 h-5 text-white/40" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Currently Playing Display */}
        {currentMedia && vibes.some(v => v._id === currentMedia._id) && (
          <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700/50 rounded flex items-center justify-center flex-shrink-0">
                {currentMedia.thumbnailUrl ? (
                  <img 
                    src={currentMedia.thumbnailUrl} 
                    alt={currentMedia.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Music className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">Now Playing</p>
                <p className="text-sm text-cyan-400 truncate">{currentMedia.title}</p>
              </div>
              {isPlaying && (
                <div className="text-cyan-400 animate-pulse">♫</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
