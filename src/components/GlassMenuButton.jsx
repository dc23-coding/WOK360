export default function GlassMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      className="
        fixed top-6 left-6 z-30
        w-12 h-12
        flex flex-col items-center justify-center gap-1.5
        rounded-xl
        backdrop-blur-md
        bg-white/5
        hover:bg-white/10
        border border-white/20
        shadow-[0_0_20px_rgba(0,200,255,0.25)]
        transition
      "
    >
      <span className="w-6 h-0.5 bg-cyan-300 rounded-full"></span>
      <span className="w-6 h-0.5 bg-cyan-300 rounded-full"></span>
      <span className="w-6 h-0.5 bg-cyan-300 rounded-full"></span>
    </button>
  );
}
