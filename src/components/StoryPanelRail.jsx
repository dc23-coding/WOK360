// components/StoryPanelRail.jsx
export default function StoryPanelRail({
  panels,
  activeId,
  onSelect,
  variant = "light", // "light" or "dark" styling
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={`mt-4 w-full max-w-4xl mx-auto flex gap-3 overflow-x-auto px-3 py-2 rounded-2xl ${
        isDark ? "bg-slate-900/70" : "bg-amber-50/80"
      }`}
    >
      {panels.map((panel) => {
        const active = panel.id === activeId;
        return (
          <button
            key={panel.id}
            onClick={() => onSelect?.(panel)}
            className={[
              "flex-shrink-0 min-w-[180px] max-w-[220px] text-left rounded-xl px-3 py-2 border text-xs",
              "transition-all duration-200",
              isDark
                ? active
                  ? "bg-cyan-500/20 border-cyan-300 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                  : "bg-slate-900/80 border-slate-600 text-slate-100/80 hover:border-cyan-300 hover:bg-slate-900"
                : active
                ? "bg-white border-cyan-300 text-amber-900 shadow-[0_0_18px_rgba(59,130,246,0.35)]"
                : "bg-amber-50 border-amber-200 text-amber-800 hover:border-cyan-300 hover:bg-white",
            ].join(" ")}
          >
            <div className="font-semibold truncate">{panel.title}</div>
            <div className="text-[10px] opacity-70 truncate">
              {panel.subtitle}
            </div>
            {panel.duration && (
              <div className="mt-1 text-[10px] opacity-60">
                {panel.duration}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
