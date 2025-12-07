// sections/DarkHallway.jsx
import RoomSection from "../components/RoomSection";

export default function DarkHallway() {
  return (
    <RoomSection bg="/Hallway_Dark.png" className="bg-black" >
      <div
        id="dark-hallway"
        className="flex w-full h-full items-center justify-between px-6 md:px-16"
      >
        {/* Left: vertical nav */}
        <div className="space-y-4 text-cyan-100">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            Night Wing
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Hallway of Stories
          </h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li className="opacity-80">▶ Private Bedroom</li>
            <li className="opacity-60">Live Night Sessions</li>
            <li className="opacity-60">Hidden Doors (Coming Soon)</li>
          </ul>
        </div>

        {/* Right: small prompt near the end door */}
        <div className="hidden md:flex flex-col items-end text-right text-cyan-100/70">
          <span className="text-xs mb-2">Scroll or tap the door to enter</span>
          <div className="w-16 h-16 rounded-full border border-cyan-400/70 animate-pulse" />
        </div>
      </div>
    </RoomSection>
  );
}
