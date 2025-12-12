// src/sections/LightBedroom.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import RoomSection from "../components/RoomSection";

export default function LightBedroom({ onToggleMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Featured gallery images
  const galleryImages = [
    { id: 1, title: "Morning Light", url: "/gallery-1.jpg" },
    { id: 2, title: "Quiet Moments", url: "/gallery-2.jpg" },
    { id: 3, title: "Reflections", url: "/gallery-3.jpg" },
  ];

  const currentImage = galleryImages[activeGalleryIndex];

  return (
    <RoomSection bg="/Bedroon_Light.png" className="bg-white">
      <div className="relative w-full h-full flex flex-col items-center justify-center text-amber-900 px-4 py-8">
        
        {/* FEATURED GALLERY */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center max-w-4xl w-full mb-8">
          {/* Gallery Image Container */}
          <motion.div
            className="relative w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-amber-200/50">
              {/* Placeholder for gallery image */}
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-amber-700/60 text-sm">{currentImage.title}</p>
                </div>
              </div>

              {/* Gallery Navigation */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {galleryImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeGalleryIndex === index
                        ? "bg-amber-600 w-6"
                        : "bg-amber-300/60 hover:bg-amber-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>

            {/* Ambient glow animation */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-amber-100 rounded-2xl opacity-20 blur-xl -z-10"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* BRAND NARRATIVE & INFO */}
          <motion.div
            className="w-full md:w-1/2 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-amber-50/80 rounded-2xl p-6 backdrop-blur border border-amber-200/50">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-semibold">
                About This Space
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-amber-900">
                The Calm Room
              </h2>
              <p className="mt-3 text-sm md:text-base text-amber-800/85 leading-relaxed">
                A sanctuary for introspection and connection. This space holds intimate conversations, personal reflections, and the stories that matter most. Here, every moment is intentional.
              </p>
              
              {/* Audio Player */}
              <div className="mt-5 p-4 bg-white/50 rounded-lg border border-amber-200/40">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold hover:bg-amber-500 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </motion.button>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-900">
                      {isPlaying ? "Playing..." : "Ambient Audio"}
                    </p>
                    <motion.div
                      className="h-1 bg-gradient-to-r from-amber-300 to-amber-500 mt-1 rounded-full"
                      animate={{ scaleX: isPlaying ? [0, 1, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* THEME TOGGLE HOTSPOT */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by lamp"
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

        {/* SOFT AMBIENT PARTICLES */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300/40 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </RoomSection>
  );
}
