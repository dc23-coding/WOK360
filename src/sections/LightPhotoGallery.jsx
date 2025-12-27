// src/sections/LightPhotoGallery.jsx
import { useState, useEffect } from "react";
import RoomSection from "../components/RoomSection";

export default function LightPhotoGallery({ onToggleMode }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample gallery images - replace with actual gallery content
  const galleryImages = [
    { url: "/Hallway_Light.webp", title: "Light Wing Corridor" },
    { url: "/Bedroon_Light.webp", title: "Peaceful Bedroom" },
    { url: "/Playroom_Light.webp", title: "Creative Studio" },
    { url: "/Hallway_Dark.webp", title: "Night Wing Mystery" },
    { url: "/Bedroom_Dark.webp", title: "Dark Bedroom" },
    { url: "/Playroom_Dark.webp", title: "Dark Playroom" },
  ];

  // Autoscroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <RoomSection bg="/Hallway_Light.webp" className="bg-white">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by frame"
          className="
            absolute
            left-[22%]
            bottom-[22%]
            w-16 h-16 md:w-20 md:h-20
            rounded-full
            bg-transparent
            hover:bg-amber-300/20
            transition
            z-30
          "
        />

        {/* Gallery Container - Centered */}
        <div className="relative w-[90%] max-w-5xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/60">
          {/* Image carousel with smooth transitions */}
          <div className="relative w-full h-full">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`
                  absolute inset-0 transition-opacity duration-1000 ease-in-out
                  ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
                `}
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Image title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="bg-amber-50/95 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg border border-amber-300/60">
              <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">
                Photo Gallery
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-amber-900">
                {galleryImages[currentIndex].title}
              </h3>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="absolute bottom-6 right-6 flex gap-2 z-20">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? "bg-amber-400 w-6" 
                    : "bg-amber-300/50 hover:bg-amber-300"}
                `}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-50/90 backdrop-blur-md border-2 border-amber-300/60 text-amber-900 hover:bg-amber-100 transition-all shadow-lg z-20 flex items-center justify-center"
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % galleryImages.length)}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-50/90 backdrop-blur-md border-2 border-amber-300/60 text-amber-900 hover:bg-amber-100 transition-all shadow-lg z-20 flex items-center justify-center"
          aria-label="Next image"
        >
          →
        </button>
      </div>
    </RoomSection>
  );
}
