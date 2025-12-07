// components/RoomSection.jsx
export default function RoomSection({ bg, children, className = "" }) {
  return (
    <section
      className={
        "relative snap-start min-h-screen w-full flex items-center justify-center overflow-hidden " +
        className
      }
    >
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      />
      {/* Subtle dark overlay for UI contrast */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
