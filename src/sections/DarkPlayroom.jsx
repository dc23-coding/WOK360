import RoomSection from "../components/RoomSection";

export default function DarkPlayroom() {
  return (
    <RoomSection bg="/Playroom_Dark.png" className="bg-black">
      <div className="relative w-full h-full flex items-center justify-center text-cyan-50 px-4">
        {/* MAIN LONG SPACE CONTAINER */}
        <div
          className="
            relative
            w-full max-w-6xl
            h-[70%] md:h-[65%]
            rounded-[2.5rem]
            bg-gradient-to-b from-cyan-950/60 via-black to-black
            border border-cyan-400/60
            shadow-[0_0_140px_rgba(34,211,238,0.85)]
            overflow-hidden
          "
        >
          {/* OVERHEAD LIGHT STRIP */}
          <div
            className="
              absolute
              top-6 left-1/2 -translate-x-1/2
              w-[65%] h-1
              bg-cyan-300/80
              blur-[3px]
            "
          />

          {/* FAR-END PORTAL / TARGET */}
          <div
            className="
              absolute
              top-10 left-1/2 -translate-x-1/2
              w-40 md:w-52 h-20
              rounded-3xl
              bg-cyan-900/40
              border border-cyan-300/70
              shadow-[0_0_60px_rgba(56,189,248,0.8)]
              flex items-center justify-center
            "
          >
            <div className="text-center px-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
                Night Wing
              </p>
              <p className="text-xs md:text-sm text-cyan-50/90">
                Infinite Playroom
              </p>
            </div>
          </div>

          {/* SUBTLE FLOOR GLOW */}
          <div
            className="
              absolute
              left-1/2 bottom-0 -translate-x-1/2
              w-[120%] h-40
              bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.4)_0,transparent_60%)]
              opacity-70
            "
          />

          {/* LANES AREA */}
          <div
            className="
              absolute
              inset-x-8
              top-24
              bottom-10
              grid grid-cols-3 gap-4
            "
          >
            {[0, 1, 2].map((lane) => (
              <div
                key={lane}
                className="
                  relative
                  rounded-[999px]
                  bg-gradient-to-b from-cyan-950/40 via-slate-950 to-black
                  border border-cyan-500/30
                  overflow-hidden
                "
              >
                {/* outer lane edges */}
                <div className="absolute inset-y-3 left-2 w-px bg-cyan-400/25 blur-[0.5px]" />
                <div className="absolute inset-y-3 right-2 w-px bg-cyan-400/25 blur-[0.5px]" />

                {/* center guide line */}
                <div className="absolute inset-y-5 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/60 via-cyan-400/20 to-transparent" />

                {/* dashed distance markers */}
                <div className="absolute inset-x-4 top-1/3 h-px bg-[repeating-linear-gradient(to_right,rgba(56,189,248,0.5)_0,rgba(56,189,248,0.5)_4px,transparent_4px,transparent_10px)] opacity-40" />
                <div className="absolute inset-x-6 top-2/3 h-px bg-[repeating-linear-gradient(to_right,rgba(56,189,248,0.35)_0,rgba(56,189,248,0.35)_4px,transparent_4px,transparent_10px)] opacity-40" />

                {/* soft highlight down the lane */}
                <div className="absolute inset-x-10 top-0 bottom-0 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent" />
              </div>
            ))}
          </div>

          {/* LABEL AT NEAR END */}
          <div
            className="
              absolute
              bottom-8 left-1/2 -translate-x-1/2
              text-center px-4
            "
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/80">
              Exclusive • Experimental Space
            </p>
            <p className="mt-1 text-xs md:text-sm text-cyan-100/80">
              Long neon lanes for live sets, prototypes, and whatever you want
              to load into the house next.
            </p>
          </div>
        </div>
      </div>
    </RoomSection>
  );
}
