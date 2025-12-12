// src/sections/LightStudio.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import RoomSection from "../components/RoomSection";
import StoryPanelRail from "../components/StoryPanelRail";
import { featuredPanels } from "../panels/data";

export default function LightStudio() {
  const lightPanels = useMemo(
    () => featuredPanels.filter((p) => p.mood === "light"),
    []
  );
  const [active, setActive] = useState(lightPanels[0] ?? null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const defaultVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoaded = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <RoomSection bg="/Playroom_Light.png" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center text-amber-900">
        {/* MINIMAL GOLDEN PLAYER + RAIL */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] w-[80%] max-w-6xl flex flex-col items-center gap-4"
        >
          {/* SCREEN FRAME – outer glowing board container */}
          <div className="relative w-full rounded-3xl border border-amber-200/80 shadow-[0_0_60px_rgba(251,191,36,0.35)] overflow-hidden">
            {/* Soft halo */}
            <div className="absolute -inset-3 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35),transparent_55%)] blur-3xl opacity-70 pointer-events-none" />

            {/* VIDEO SCREEN – flush inside frame */}
            <div className="relative aspect-[3/2] w-full bg-black">
              <video
                ref={videoRef}
                src={defaultVideo}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoaded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Overlay info */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/60 border border-amber-200 text-[10px] uppercase tracking-[0.25em] text-amber-700/90">
                {active ? `${active.duration} • ${active.title}` : "Studio Feature"}
              </div>

              {/* Simple controls */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-900/70 via-amber-900/30 to-transparent px-4 py-3 text-amber-50">
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-amber-500/70 hover:bg-amber-500 text-amber-50 shadow-md flex items-center justify-center"
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

                  <span className="text-[10px] w-12 text-right text-amber-100/80">
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
                    className="flex-1 accent-amber-400 cursor-pointer"
                  />
                  <span className="text-[10px] w-12 text-amber-100/80">
                    {formatTime(duration)}
                  </span>

                  <div className="flex items-center gap-2 w-28">
                    <span className="text-sm">🔈</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-2 md:px-0">
            <StoryPanelRail
              panels={lightPanels}
              activeId={active?.id}
              onSelect={setActive}
              variant="light"
            />
          </div>
        </div>
      </div>
    </RoomSection>
  );
}
