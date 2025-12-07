// src/sections/DarkBedroom.jsx
import { useMemo, useState } from "react";
import RoomSection from "../components/RoomSection";
import StoryPanelRail from "../components/StoryPanelRail";
import { featuredPanels } from "../panels/data";
import GlassMenuButton from "../components/GlassMenuButton";


export default function DarkBedroom({ onToggleMode }) {
  const nightPanels = useMemo(
    () => featuredPanels.filter((p) => p.mood !== "light"),
    []
  );
  const [active, setActive] = useState(nightPanels[0] ?? null);

  return (
    <RoomSection bg="/Bedroom_Dark.png" className="bg-black">
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

        {/* MAIN SCREEN – local to this section only */}
        <div
          className="
            absolute
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-[80%]
            /* raise/lower by adjusting 80: higher => 82, lower => 78 */

            w-[60%] max-w-4xl
            aspect-video
            rounded-xl
            border border-cyan-300/70
            shadow-[0_0_48px_rgba(34,211,238,0.6)]
            overflow-hidden
          "
        >
          {/* SOLID feed container (not transparent) */}
          <div className="w-full h-full bg-black text-cyan-100/85 flex items-center justify-center px-4 text-xs md:text-sm">
            {active ? (
              <div className="text-center">
                <p className="uppercase tracking-[0.25em] text-[10px] text-cyan-300/80">
                  {active.duration} • Night Room Feature
                </p>
                <h2 className="mt-2 text-lg md:text-2xl font-semibold">
                  {active.title}
                </h2>
              </div>
            ) : (
              <span className="opacity-70 text-[11px]">
                Select a story below to start the night session
              </span>
            )}
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

        {/* STORY PANEL RAIL – near bottom */}
        <div
          className="
            absolute
            left-1/2 bottom-[5%]
            -translate-x-1/2
            w-full px-4
          "
        >
          <StoryPanelRail
            panels={nightPanels}
            activeId={active?.id}
            onSelect={setActive}
            variant="dark"
          />
        </div>
      </div>
    </RoomSection>
  );
}
