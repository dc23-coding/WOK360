// sections/DarkHallway.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";

export default function DarkHallway({ mode, onToggleMode }) {
  const [activeNav, setActiveNav] = useState(0);

  const navItems = [
    { label: "Dark Navi", href: "#dark-bedroom" },
    { label: "Private Bedroom", href: "#" },
    { label: "Hidden Doors (Coming Soon)", href: "#" },
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
                  if (item.href !== "#") {
                    document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {activeNav === index ? "▶" : " "} {item.label}
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
