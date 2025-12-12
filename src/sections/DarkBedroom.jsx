// src/sections/DarkBedroom.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import RoomSection from "../components/RoomSection";
import StoryPanelRail from "../components/StoryPanelRail";
import AskCleAssistant from "../components/AskCleAssistant";
import { featuredPanels } from "../panels/data";
import GlassMenuButton from "../components/GlassMenuButton";


export default function DarkBedroom({ onToggleMode }) {
  const nightPanels = useMemo(
    () => featuredPanels.filter((p) => p.mood !== "light"),
    []
  );
  const [active, setActive] = useState(nightPanels[0] ?? null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aspect, setAspect] = useState("16:9");
  const aspectClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "9:16": "aspect-[9/16]",
  }[aspect];
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
    <RoomSection bg="/Bedroom_Dark.png" className="bg-black">
      <AskCleAssistant />
      <div className="relative w-full h-full flex items-center justify-center">
        {/* GLOBAL SENSOR TOGGLE – top-right */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle day / night mode"
          className="
            absolute top-6 right-6
            w-5 h-5 md:w-7 md:h-7
            rounded-full
            bg-cyan-400/20
            hover:bg-cyan-400/40
            border border-cyan-300/50
            backdrop-blur
            transition
          "
        />

        {/* CINEMATIC PLAYER + PLAYLIST – stacked to keep tabs under the screen */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[82%] w-[62%] max-w-5xl flex flex-col items-center gap-4"
        >
          <div className="relative w-full rounded-2xl border border-cyan-300/60 shadow-[0_0_60px_rgba(34,211,238,0.7)] overflow-hidden bg-gradient-to-b from-cyan-950/70 via-black to-black">
            {/* Glow ring */}
            <div className="absolute -inset-3 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.35),transparent_55%)] blur-3xl opacity-60 pointer-events-none" />

            {/* Video area */}
            <div className={`relative ${aspectClass} w-full`}
            >
              <video
                ref={videoRef}
                src={defaultVideo}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoaded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Overlay top-left info */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-cyan-300/40 text-[10px] uppercase tracking-[0.25em] text-cyan-100/80">
                {active ? `${active.duration} • ${active.title}` : "Night Feature"}
              </div>

              {/* Controls bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3">
                <div className="flex items-center gap-3 text-xs text-cyan-50">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-300/50 flex items-center justify-center"
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>

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

                  <div className="flex items-center gap-2 w-28">
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

                  <div className="flex items-center gap-2 text-[10px]">
                    {[
                      { label: "16:9", value: "16:9" },
                      { label: "4:3", value: "4:3" },
                      { label: "9:16", value: "9:16" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAspect(opt.value)}
                        className={`px-2 py-1 rounded-md border ${
                          aspect === opt.value
                            ? "bg-cyan-500/40 border-cyan-200"
                            : "bg-cyan-500/15 border-cyan-300/40 hover:bg-cyan-500/25"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STORY PANEL RAIL – tucked just beneath the player */}
          <div className="w-full px-2 md:px-0">
            <StoryPanelRail
              panels={nightPanels}
              activeId={active?.id}
              onSelect={setActive}
              variant="dark"
            />
          </div>
        </div>

        {/* SUBTITLE – between screen and bed */}
        {active && (
          <div
            className="
              absolute
              left-1/2 top-1/2
              -translate-x-1/2 -translate-y-[30%]
              max-w-xl
              text-center
              text-cyan-100/80
              px-4
            "
          >
            <p className="text-xs md:text-sm opacity-75">
              {active.subtitle}
            </p>
          </div>
        )}

      </div>
    </RoomSection>
  );
}
