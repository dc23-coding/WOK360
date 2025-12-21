// src/sections/LightHallway.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";
import { useZoneContent } from "../hooks/useZoneContent";

export default function LightHallway({ mode, onToggleMode, onNavigate }) {
  const [activeNav, setActiveNav] = useState(0);
  
  // Fetch Kazmo Mansion Light Wing content
  const { content, featuredContent, loading } = useZoneContent('kazmo', 'light');

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
        
        {/* HALLWAY MODE TOGGLE - Priority positioning for mobile */}
        <div className="absolute left-4 md:left-[8%] top-4 md:top-10 z-20">
          <div className="inline-flex items-center rounded-full bg-amber-100/90 backdrop-blur-md px-1 py-1 border border-amber-300/80 shadow-lg">
            <button
              type="button"
              onClick={() => mode !== "light" && onToggleMode()}
              className={`
                px-2 md:px-3 py-1.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium
                ${mode === "light"
                  ? "bg-amber-400 text-amber-900 font-semibold shadow"
                  : "text-amber-700/80 hover:bg-amber-200/60"}
              `}
            >
              Day Wing
            </button>
            <button
              type="button"
              onClick={() => mode !== "dark" && onToggleMode()}
              className={`
                px-2 md:px-3 py-1.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium
                ${mode === "dark"
                  ? "bg-amber-400 text-amber-900 font-semibold shadow"
                  : "text-amber-700/80 hover:bg-amber-200/60"}
              `}
            >
              Night Wing
            </button>
          </div>
        </div>

        {/* NAVIGATION PANEL - Centered for mobile, right side for desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[8%] top-20 md:top-1/2 md:-translate-y-1/2 max-w-[90%] md:max-w-sm w-full md:w-auto">
          <div className="
            rounded-2xl md:rounded-3xl
            bg-amber-50/95
            backdrop-blur-md
            border-2 border-amber-300/80
            shadow-[0_0_40px_rgba(251,191,36,0.4)]
            px-4 py-4 md:px-8 md:py-6
          ">
            {/* Header - Hidden on mobile for space */}
            <div className="hidden md:block mb-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500">
                Day Wing
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-amber-900">
                Navigate
              </h2>
            </div>
            
            {/* Mobile Header - Compact */}
            <div className="block md:hidden mb-2">
              <h2 className="text-lg font-semibold text-amber-900">Where to?</h2>
            </div>

            {/* Navigation Grid - Better mobile layout */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0 md:space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`
                    text-left px-3 py-2 md:py-1.5 rounded-lg md:rounded-none
                    text-xs md:text-base transition-all
                    ${activeNav === index
                      ? "bg-amber-200/60 md:bg-transparent text-amber-900 font-semibold md:opacity-100"
                      : "bg-amber-100/30 md:bg-transparent text-amber-800/70 md:opacity-60 hover:bg-amber-200/40 md:hover:bg-transparent md:hover:opacity-80"}
                  `}
                  onClick={() => {
                    setActiveNav(index);
                    if (item.action === "scroll" && item.target) {
                      document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
                    } else if (item.action === "modal" && item.target) {
                      onNavigate(item.target);
                    }
                  }}
                >
                  <span className="hidden md:inline">{activeNav === index ? "▶ " : "   "}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Footer text - Desktop only */}
            <p className="hidden md:block mt-4 text-[11px] text-amber-700/80 leading-relaxed">
              Explore stories, music, gallery & shop. Switch to Night Wing for exclusive content.
            </p>
          </div>
        </div>

        {/* CONTENT DISPLAY SECTION - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl">
          {/* Featured Content Banner */}
          {!loading && featuredContent.length > 0 && (
            <div className="mb-4 bg-amber-50/90 backdrop-blur-md rounded-xl border-2 border-amber-300/80 p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <p className="text-xs text-amber-600 font-medium">Featured Now</p>
                  <p className="text-sm text-amber-900 font-semibold">{featuredContent[0].title}</p>
                </div>
                <button 
                  onClick={() => onNavigate('featured-content')}
                  className="px-3 py-1.5 bg-amber-400 text-amber-900 text-xs font-medium rounded-lg hover:bg-amber-500 transition-colors"
                >
                  Watch
                </button>
              </div>
            </div>
          )}

          {/* Content Thumbnail Rail */}
          <div className="bg-amber-50/90 backdrop-blur-md rounded-xl border-2 border-amber-300/80 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-900">Available Content</h3>
              <span className="text-xs text-amber-600">{content.length} items</span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
              </div>
            ) : content.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-amber-700/70">No content uploaded yet</p>
                <p className="text-xs text-amber-600/60 mt-1">Upload via Admin Panel (code 3104)</p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {content.slice(0, 8).map((item) => (
                  <div 
                    key={item._id}
                    className="flex-shrink-0 w-32 group cursor-pointer"
                    onClick={() => onNavigate(item._id)}
                  >
                    <div className="aspect-video bg-amber-200/40 rounded-lg overflow-hidden border border-amber-300/50 group-hover:border-amber-400 transition-all">
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
                    <p className="text-xs text-amber-900 font-medium mt-1.5 truncate">{item.title}</p>
                    <p className="text-[10px] text-amber-600/70 truncate">{item.duration || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </RoomSection>
  );
}
