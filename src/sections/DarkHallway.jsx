// sections/DarkHallway.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";
import { useZoneContent } from "../hooks/useZoneContent";

export default function DarkHallway({ mode, onToggleMode, onNavigate }) {
  const [activeNav, setActiveNav] = useState(0);
  
  // Fetch Kazmo Mansion Dark Wing content
  const { content, featuredContent, loading } = useZoneContent('kazmo', 'dark');

  const navItems = [
    { label: "Private Bedroom", action: "scroll", target: "dark-bedroom" },
    { label: "Exclusive Studio", action: "scroll", target: "dark-playroom" },
    { label: "Ask Cle AI", action: "none", info: "Available in all dark rooms" },
    { label: "Premium Features", action: "none", info: "Coming Soon" },
  ];

  return (
    <RoomSection bg="/Hallway_Dark.png" className="bg-black" >
      <div
        id="dark-hallway"
        className="flex w-full h-full items-center justify-between px-6 md:px-16"
      >
        {/* Left: vertical nav with interactive links */}
        <div className="space-y-4 text-cyan-100">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            Night Wing
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Exclusive Stories
          </h2>
          <ul className="space-y-2 text-sm md:text-base">
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
                  }
                }}
              >
                {activeNav === index ? "▶" : " "} {item.label}
                {item.info && <span className="text-[10px] text-cyan-400/60 ml-2">({item.info})</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* HALLWAY MODE TOGGLE (Night vs Day) - Dark Theme - RIGHT SIDE */}
      <div className="absolute right-[8%] top-10">
        <div className="inline-flex items-center rounded-full bg-slate-900/70 backdrop-blur px-1 py-1 border border-cyan-400/60 shadow-sm">
          <button
            type="button"
            onClick={() => mode !== "dark" && onToggleMode()}
            className={`
              px-3 py-1 rounded-full text-[11px] md:text-xs
              ${mode === "dark"
                ? "bg-cyan-400 text-slate-900 font-semibold shadow"
                : "text-cyan-300/80 hover:bg-cyan-400/20"}
            `}
          >
            Exclusive (Night Wing)
          </button>
          <button
            type="button"
            onClick={() => mode !== "light" && onToggleMode()}
            className={`
              px-3 py-1 rounded-full text-[11px] md:text-xs
              ${mode === "light"
                ? "bg-cyan-400 text-slate-900 font-semibold shadow"
                : "text-cyan-300/80 hover:bg-cyan-400/20"}
            `}
          >
            Regular (Day Wing)
          </button>
        </div>
      </div>
    </RoomSection>
  );
}
