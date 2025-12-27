// sections/DarkHallway.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";
import AdminContentManager from "../components/AdminContentManager";
import { useZoneContent } from "../hooks/useZoneContent";

export default function DarkHallway({ mode, onToggleMode, onNavigate }) {
  const [showControlRoom, setShowControlRoom] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  
  // Fetch Kazmo Mansion Dark Wing content
  const { content, featuredContent, loading } = useZoneContent('kazmo', 'dark');

  const navItems = [
    { label: "Content Control Room", action: "toggle-manager", target: null },
    { label: "← Back to Light Wing", action: "toggle-mode", target: null },
    { label: "Private Bedroom", action: "scroll", target: "dark-bedroom" },
    { label: "Exclusive Studio", action: "scroll", target: "dark-playroom" },
    { label: "Ask Cle AI", action: "none", info: "Available in all dark rooms" },
  ];

  return (
    <RoomSection bg="/Hallway_Dark.webp" className="bg-black" >
      {/* Admin Content Manager Overlay */}
      {showControlRoom && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl">
          <button
            onClick={() => setShowControlRoom(false)}
            className="absolute top-4 right-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm hover:bg-red-500/30 transition"
          >
            ✕ Close Control Room
          </button>
          <AdminContentManager />
        </div>
      )}

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
            Admin Control Center
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
                  if (item.action === "toggle-manager") {
                    setShowControlRoom(true);
                  } else if (item.action === "toggle-mode") {
                    onToggleMode();
                  } else if (item.action === "scroll" && item.target) {
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

      {/* CONTENT DISPLAY SECTION - Bottom Right */}
      <div className="absolute bottom-8 right-8 w-[90%] md:w-[400px] max-w-md">
        {/* Featured Content Banner */}
        {!loading && featuredContent.length > 0 && (
          <div className="mb-4 bg-slate-900/90 backdrop-blur-md rounded-xl border-2 border-cyan-400/60 p-3 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <p className="text-xs text-cyan-400 font-medium">Exclusive Featured</p>
                <p className="text-sm text-cyan-100 font-semibold">{featuredContent[0].title}</p>
              </div>
              <button 
                onClick={() => onNavigate('featured-content')}
                className="px-3 py-1.5 bg-cyan-400 text-slate-900 text-xs font-medium rounded-lg hover:bg-cyan-300 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        )}

        {/* Content Thumbnail Grid */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border-2 border-cyan-400/60 p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-cyan-100">Premium Content</h3>
            <span className="text-xs text-cyan-400">{content.length} exclusive</span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-cyan-300/70">No exclusive content yet</p>
              <p className="text-xs text-cyan-400/60 mt-1">Upload premium content via Admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {content.slice(0, 4).map((item) => (
                <div 
                  key={item._id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate(item._id)}
                >
                  <div className="aspect-video bg-slate-800/60 rounded-lg overflow-hidden border border-cyan-400/30 group-hover:border-cyan-400 transition-all">
                    {item.thumbnail?.asset?.url ? (
                      <img 
                        src={item.thumbnail.asset.url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {item.contentType === 'video' ? '🎬' : '🎵'}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-cyan-100 font-medium mt-1.5 truncate">{item.title}</p>
                  <p className="text-[10px] text-cyan-400/70 truncate">{item.duration || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoomSection>
  );
}
