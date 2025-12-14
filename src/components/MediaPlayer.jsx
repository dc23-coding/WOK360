// src/components/MediaPlayer.jsx
// Unified player for audio mixes and video content in Club Hollywood
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function MediaPlayer({ 
  activeMix, 
  isLive = false,
  onReady 
}) {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const hasVideo = activeMix?.hasVideo || isLive;
  const mediaRef = hasVideo ? videoRef : audioRef;

  // Sync volume
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Reset on mix change
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      mediaRef.current.load();
    }
  }, [activeMix]);

  // Auto-play for live
  useEffect(() => {
    if (isLive && mediaRef.current) {
      mediaRef.current.play();
    }
  }, [isLive]);

  const togglePlay = () => {
    if (!mediaRef.current || isLive) return; // Lock controls during live
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration || 0);
      onReady?.();
    }
  };

  const handleSeek = (e) => {
    if (!mediaRef.current || isLive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="absolute inset-0">
      {/* Video Player */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={activeMix?.videoSource || activeMix?.source}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          loop={!isLive}
          playsInline
        />
      ) : (
        <>
          {/* Audio Player (hidden) */}
          <audio
            ref={audioRef}
            src={activeMix?.audioSource || activeMix?.source}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            loop
          />
          
          {/* Audio Visualization Placeholder */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                  opacity: isPlaying ? [0.6, 1, 0.6] : 0.6
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: isPlaying ? Infinity : 0 
                }}
                className="text-8xl mb-4"
              >
                {activeMix?.emoji || "🎵"}
              </motion.div>
              <p className="text-2xl font-semibold text-cyan-300">
                {activeMix?.name || "Select a Mix"}
              </p>
              <p className="text-sm text-cyan-400/70 mt-2">
                {activeMix?.description || "Choose from the sidebar"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Controls Overlay */}
      {activeMix && !isLive && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <span className="text-white text-lg">⏸</span>
              ) : (
                <span className="text-white text-lg ml-0.5">▶️</span>
              )}
            </button>

            {/* Time Display */}
            <div className="text-xs text-white/70 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Volume Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                {isMuted || volume === 0 ? (
                  <span className="text-white/70">🔇</span>
                ) : volume < 0.5 ? (
                  <span className="text-white/70">🔉</span>
                ) : (
                  <span className="text-white/70">🔊</span>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-125"
              />

              <span className="text-xs text-white/50 font-mono w-8">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-4 left-4 px-3 py-2 bg-red-500/80 backdrop-blur-sm rounded-lg border border-red-400/50 flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Now Playing (non-live) */}
      {!isLive && activeMix && (
        <div className="absolute top-4 left-4 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs text-cyan-400 font-medium">Now Playing</span>
          </div>
        </div>
      )}
    </div>
  );
}
