import RoomSection from "../components/RoomSection";
import AskCleAssistant from "../components/AskCleAssistant";
import { useEffect, useRef, useState } from "react";

export default function DarkPlayroom() {
  const defaultVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
  const [videoUrl, setVideoUrl] = useState(defaultVideo);
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);

  // Sync volume when slider changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Keep track of fullscreen changes (esc, user interactions)
  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(!!fsEl);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRewind = () => {
    if (!videoRef.current) return;
    const nextTime = Math.max(0, videoRef.current.currentTime - 10);
    videoRef.current.currentTime = nextTime;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoaded = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    setCurrentTime(videoRef.current.currentTime || 0);
  };

  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (!isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  const toggleTheater = () => setIsTheater((v) => !v);

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "0:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <RoomSection bg="/Playroom_Dark.png" className="bg-black">
      <AskCleAssistant />
      <div className="relative w-full h-full flex flex-col items-center justify-center text-cyan-50 px-4 py-8">
        
        {/* VIDEO CONTAINER WITH NEON BOTTOM FRAME */}
        <div
          ref={playerContainerRef}
          className={`relative w-full flex flex-col items-center ${
            isTheater ? "max-w-7xl" : "max-w-6xl"
          }`}
        >
          
          {/* VIDEO DISPLAY AREA */}
          <div
            className="
              relative
              w-full
              rounded-t-[2.5rem]
              bg-gradient-to-b from-cyan-950/60 via-black to-black
              border-l border-t border-r border-cyan-400/60
              overflow-hidden
              aspect-video
              flex items-center justify-center
              shadow-[0_0_100px_rgba(34,211,238,0.6)]
            "
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoaded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* CONTROL BAR */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3">
              <div className="flex items-center gap-3 text-xs text-cyan-50">
                {/* Play/Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-300/50 flex items-center justify-center"
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>

                {/* Rewind */}
                <button
                  type="button"
                  onClick={handleRewind}
                  className="w-9 h-9 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-300/40 flex items-center justify-center"
                >
                  ⟲
                </button>

                {/* Timeline */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[10px] text-cyan-200/80 w-12 text-right">
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
                      if (videoRef.current) videoRef.current.currentTime = t;
                      setCurrentTime(t);
                    }}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-cyan-200/80 w-12">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 w-32">
                  <span className="text-lg">🔊</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Theater mode */}
                <button
                  type="button"
                  onClick={toggleTheater}
                  className="px-3 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-300/40 text-[10px]"
                >
                  {isTheater ? "Exit Theater" : "Theater"}
                </button>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-3 py-2 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-300/40 text-[10px]"
                >
                  {isFullscreen ? "Exit FS" : "Fullscreen"}
                </button>
              </div>
            </div>

            {/* SUBTLE FLOOR GLOW INSIDE VIDEO AREA */}
            <div
              className="
                absolute
                left-1/2 bottom-0 -translate-x-1/2
                w-[120%] h-40
                bg-[radial-gradient(circle_at_center,rgba(56,189,238,0.3)_0,transparent_60%)]
                opacity-50
                pointer-events-none
              "
            />
          </div>

          {/* NEON BOTTOM FRAME BAR — Full width, glowing */}
          <div
            className="
              relative
              w-full
              rounded-b-[2.5rem]
              border-l border-b border-r border-cyan-400/60
              bg-gradient-to-r from-cyan-900/40 via-cyan-800/50 to-cyan-900/40
              py-6
              px-8
              shadow-[0_0_120px_rgba(34,211,238,0.9),inset_0_1px_20px_rgba(34,211,238,0.3)]
            "
          >
            {/* NEON GLOW EFFECT (bottom edge) */}
            <div
              className="
                absolute
                bottom-0 left-0 right-0
                h-1
                bg-cyan-300
                blur-[4px]
                opacity-90
              "
            />

            {/* CONTENT IN NEON FRAME */}
            <div className="relative z-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/90 font-semibold">
                Live • Experimental • Unfiltered
              </p>
              <p className="mt-2 text-xs text-cyan-100/80 max-w-md mx-auto">
                Neon-emitted live feeds, prototypes, and experimental streams.
                Direct from the playroom.
              </p>
            </div>

            {/* SIDE ACCENT GLOWS */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-cyan-400/80 to-transparent blur-[2px]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-cyan-400/80 to-transparent blur-[2px]" />
          </div>
        </div>

        {/* OPTIONAL: LANES OR ADDITIONAL CONTENT BELOW (REMOVED FOR NOW) */}
        {/* If you want to keep the lanes below, add them here as a separate section */}
      </div>
    </RoomSection>
  );
}
