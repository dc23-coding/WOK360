import RoomSection from "../components/RoomSection";
import { useState } from "react";

export default function DarkPlayroom() {
  const [videoUrl, setVideoUrl] = useState(""); // Placeholder for video URL

  return (
    <RoomSection bg="/Playroom_Dark.png" className="bg-black">
      <div className="relative w-full h-full flex flex-col items-center justify-center text-cyan-50 px-4 py-8">
        
        {/* VIDEO CONTAINER WITH NEON BOTTOM FRAME */}
        <div className="relative w-full max-w-6xl flex flex-col items-center">
          
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
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <p className="text-cyan-300/80 text-sm uppercase tracking-[0.2em]">
                  Video Stream
                </p>
                <p className="text-cyan-100/60 text-xs mt-2">
                  Live feed or embedded content
                </p>
              </div>
            )}

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
