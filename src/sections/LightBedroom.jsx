// src/sections/LightBedroom.jsx
import RoomSection from "../components/RoomSection";

export default function LightBedroom({ onToggleMode }) {
  return (
    <RoomSection bg="/Bedroon_Light.png" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center text-center text-amber-900 px-4">
        {/* Main day card */}
        <div className="bg-amber-50/90 rounded-2xl px-4 py-3 md:px-8 md:py-6 shadow-lg backdrop-blur">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-amber-500">
            Day Wing
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
            Calm Room • Reflections
          </h2>
          <p className="mt-2 max-w-xl text-sm md:text-base text-amber-800/85 mx-auto">
            A bright, quiet space for interviews, personal notes, and softer stories.
          </p>
        </div>

        {/* Optional: tap-lamp hotspot as toggle */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by lamp"
          className="
            absolute
            left-[22%]
            bottom-[22%]
            w-16 h-16 md:w-20 md:h-20
            rounded-full
            bg-transparent
            hover:bg-amber-300/20
            transition
          "
        />
      </div>
    </RoomSection>
  );
}
