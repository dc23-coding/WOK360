// src/sections/LightHallway.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";

export default function LightHallway({ mode, onToggleMode, onNavigate }) {
  const [activeNav, setActiveNav] = useState(0);

  const navItems = [
    { label: "Calm Bedroom", action: "scroll", target: "light-bedroom" },
    { label: "Music Room", action: "modal", target: "music-room" },
    { label: "Photo Gallery", action: "modal", target: "photo-gallery" },
    { label: "Merch Shop", action: "modal", target: "merch-shop" },
    { label: "Ask Cle", action: "modal", target: "ask-cle" },
    { label: "Coming Soon", action: "none", target: null },
  ];

  return (
    <RoomSection bg="/Hallway_Light.png" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* RIGHT-SIDE GLASS PANEL FOR TEXT */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 max-w-sm">
          <div className="
            rounded-3xl
            bg-amber-50/90
            backdrop-blur-md
            border border-amber-200/70
            shadow-[0_0_35px_rgba(251,191,36,0.35)]
            px-6 py-5 md:px-8 md:py-6
          ">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-amber-500">
              Day Wing
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-amber-900">
              Welcome Home
            </h2>
            <ul className="mt-3 space-y-2 text-sm md:text-base text-amber-800/90">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={`cursor-pointer transition-all ${
                    activeNav === index
                      ? "opacity-100 font-semibold"
                      : "opacity-60 hover:opacity-80"
                  }`}
                  onClick={() => {
                    setActiveNav(index);
                    if (item.action === "scroll" && item.target) {
                      document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
                    } else if (item.action === "modal" && item.target) {
                      onNavigate(item.target);
                    }
                  }}
                >
                  {activeNav === index ? "▶" : " "} {item.label}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] md:text-xs text-amber-700/90">
              Explore stories, music, gallery, shop, and more. Switch to Night Wing for exclusive content and live sessions.
            </p>
          </div>
        </div>

        {/* HALLWAY MODE TOGGLE (Regular vs Exclusive) */}
        <div className="absolute left-[8%] top-10">
          <div className="inline-flex items-center rounded-full bg-amber-100/70 backdrop-blur px-1 py-1 border border-amber-200/80 shadow-sm">
            <button
              type="button"
              onClick={() => mode !== "light" && onToggleMode()}
              className={`
                px-3 py-1 rounded-full text-[11px] md:text-xs
                ${mode === "light"
                  ? "bg-amber-300 text-amber-900 font-semibold shadow"
                  : "text-amber-700/80 hover:bg-amber-200/60"}
              `}
            >
              Regular (Day Wing)
            </button>
            <button
              type="button"
              onClick={() => mode !== "dark" && onToggleMode()}
              className={`
                px-3 py-1 rounded-full text-[11px] md:text-xs
                ${mode === "dark"
                  ? "bg-amber-300 text-amber-900 font-semibold shadow"
                  : "text-amber-700/80 hover:bg-amber-200/60"}
              `}
            >
              Exclusive (Night Wing)
            </button>
          </div>
        </div>
      </div>
    </RoomSection>
  );
}
