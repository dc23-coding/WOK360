// src/sections/LightStudio.jsx
import RoomSection from "../components/RoomSection";
import StoryPanelRail from "../components/StoryPanelRail";
import { featuredPanels } from "../panels/data";

export default function LightStudio() {
  const lightPanels = featuredPanels.filter((p) => p.mood !== "night");

  const active = lightPanels[0];

  return (
    <RoomSection bg="/Playroom_Light.png" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center text-amber-900">
        {/* MAIN SCREEN BOX – raised a bit higher */}
        <div
          className="
            absolute
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-[78%]
            /* ↑ raise or lower this: bigger number = higher, smaller = lower */

            w-[64%] max-w-5xl
            aspect-video
            rounded-3xl
            border border-amber-200/80
            bg-black
            shadow-[0_0_60px_rgba(251,191,36,0.4)]
            overflow-hidden
          "
        >
          {/* your future full-screen video lives here */}
          <div className="w-full h-full flex items-center justify-center text-amber-50 px-4 text-xs md:text-sm">
            <div className="text-center">
              <p className="uppercase tracking-[0.25em] text-[10px] text-amber-300/80">
                Featured • {active.duration}
              </p>
              <h2 className="mt-2 text-lg md:text-2xl font-semibold">
                {active.title}
              </h2>
              <p className="mt-2 text-[11px] opacity-75">{active.subtitle}</p>
            </div>
          </div>
        </div>

        {/* TABS / STORY RAIL – under the screen */}
        <div
          className="
            absolute
            left-1/2 bottom-[5%]
            -translate-x-1/2
            w-full px-4
          "
        >
          <div className="max-w-5xl mx-auto rounded-3xl bg-amber-50/90 backdrop-blur shadow-lg">
            <StoryPanelRail
              panels={lightPanels}
              activeId={active.id}
              onSelect={() => {}}
              variant="light"
            />
          </div>
        </div>
      </div>
    </RoomSection>
  );
}
