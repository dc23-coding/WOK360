// src/sections/LightMerchShop.jsx
import RoomSection from "../components/RoomSection";

export default function LightMerchShop({ onToggleMode }) {
  return (
    <RoomSection bg="/Hallway_Light.png" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center text-center text-amber-900 px-4">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by storefront"
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

        {/* Main content card */}
        <div className="bg-amber-50/90 rounded-2xl px-4 py-3 md:px-8 md:py-6 shadow-lg backdrop-blur">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-amber-500">
            Day Wing
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
            Merch Shop
          </h2>
          <p className="mt-2 max-w-xl text-sm md:text-base text-amber-800/85 mx-auto">
            Exclusive merchandise and collectibles. Support the story with curated products and limited edition items.
          </p>
        </div>
      </div>
    </RoomSection>
  );
}
