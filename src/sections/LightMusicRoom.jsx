// src/sections/LightMusicRoom.jsx
import RoomSection from "../components/RoomSection";
import VibePlayer from "../components/VibePlayer";

export default function LightMusicRoom({ onToggleMode }) {
  return (
    <RoomSection bg="/Hallway_Light.webp" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
        {/* Music Player - Center */}
        <div className="w-full max-w-3xl">
          <VibePlayer
            variant="light"
            mode="vod"
            locked={false}
            roomId="music-room"
          />
        </div>

        {/* Theme toggle button */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by speaker"
          className="
            absolute
            left-[22%]
            bottom-[22%]
            w-16 h-16 md:w-20 md:h-20
            rounded-full
            bg-transparent
            hover:bg-amber-300/20
            transition
          "
        />
      </div>
    </RoomSection>
  );
}
