// src/components/VibePlayer.jsx
// Music player with selectable mixes/vibes for Club Hollywood & Private Lounge
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VibePlayer({ variant = "dark" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Admin-provided mixes/vibes
  const vibes = [
    {
      id: 1,
      name: "Chill Lounge",
      description: "Relaxed downtempo beats",
      icon: "🌙",
      color: "cyan",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Replace with actual URL
    },
    {
      id: 2,
      name: "Deep Focus",
      description: "Ambient concentration flow",
      icon: "🧠",
      color: "purple",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: 3,
      name: "Upbeat Energy",
      description: "High-energy motivational",
      icon: "⚡",
      color: "amber",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      id: 4,
      name: "Smooth Jazz",
      description: "Classic jazz sophistication",
      icon: "🎷",
      color: "emerald",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
      id: 5,
      name: "Study Beats",
      description: "Lo-fi hip hop vibes",
      icon: "📚",
      color: "rose",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
      id: 6,
      name: "Night Drive",
      description: "Synthwave retrowave",
      icon: "🌃",
      color: "indigo",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
  ];

  const [activeVibe, setActiveVibe] = useState(vibes[0]);

  const isDark = variant === "dark";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Auto-pause when switching vibes
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.load();
    }
  }, [activeVibe]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVibeSelect = (vibe) => {
    setActiveVibe(vibe);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={activeVibe.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Compact Player */}
      <div className={`rounded-2xl border backdrop-blur overflow-hidden ${
        isDark 
          ? "border-cyan-500/30 bg-slate-900/80" 
          : "border-purple-500/30 bg-slate-900/80"
      }`}>
        {/* Header with Vibe Selector */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{activeVibe.icon}</div>
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-semibold text-white hover:text-cyan-300 transition flex items-center gap-1"
              >
                {activeVibe.name}
                <span className="text-xs opacity-60">{isExpanded ? "▲" : "▼"}</span>
              </button>
              <p className="text-xs text-slate-500">{activeVibe.description}</p>
            </div>
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isDark
                ? "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50"
                : "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50"
            }`}
          >
            {isPlaying ? (
              <span className="text-lg">⏸</span>
            ) : (
              <span className="text-lg">▶️</span>
            )}
          </button>
        </div>

        {/* Vibe Selection Grid (Expandable) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-slate-700/50"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
                {vibes.map((vibe) => (
                  <button
                    key={vibe.id}
                    onClick={() => handleVibeSelect(vibe)}
                    className={`p-3 rounded-lg border transition text-left ${
                      activeVibe.id === vibe.id
                        ? isDark
                          ? "border-cyan-400 bg-cyan-500/20"
                          : "border-purple-400 bg-purple-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{vibe.icon}</div>
                    <p className="text-xs font-semibold text-white">{vibe.name}</p>
                    <p className="text-xs text-slate-500 truncate">{vibe.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = t;
                setCurrentTime(t);
              }}
              className={`flex-1 h-1 rounded-full appearance-none cursor-pointer ${
                isDark ? "accent-cyan-400" : "accent-purple-400"
              }`}
              style={{
                background: `linear-gradient(to right, ${
                  isDark ? "#22d3ee" : "#a855f7"
                } ${(currentTime / (duration || 1)) * 100}%, rgb(51 65 85) ${
                  (currentTime / (duration || 1)) * 100
                }%)`
              }}
            />
            <span className="text-xs text-slate-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <span className="text-sm">🔊</span>
            <input
              type="range"
              min={0}
              max={1}
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={`flex-1 h-1 rounded-full appearance-none cursor-pointer ${
                isDark ? "accent-cyan-400" : "accent-purple-400"
              }`}
              style={{
                background: `linear-gradient(to right, ${
                  isDark ? "#22d3ee" : "#a855f7"
                } ${volume * 100}%, rgb(51 65 85) ${volume * 100}%)`
              }}
            />
            <span className="text-xs text-slate-400 w-8">{Math.round(volume * 100)}</span>
          </div>
        </div>

        {/* Now Playing Indicator */}
        {isPlaying && (
          <div className={`px-4 py-2 flex items-center gap-2 text-xs border-t ${
            isDark ? "border-cyan-500/20 bg-cyan-500/5" : "border-purple-500/20 bg-purple-500/5"
          }`}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-cyan-400" : "bg-purple-400"
              }`}
            />
            <span className={isDark ? "text-cyan-300" : "text-purple-300"}>
              Now Playing: {activeVibe.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
