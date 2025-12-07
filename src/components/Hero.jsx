
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Hero = () => {
  const { toast } = useToast();

  const handleEnterHallway = () => {
    const hallwaySection = document.getElementById('hallway');
    if (hallwaySection) {
      hallwaySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBedroomPrivate = () => {
    const bedroomSection = document.getElementById('bedroom');
    if (bedroomSection) {
      bedroomSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover opacity-40" 
          alt="Darkened house entrance at night"
         src="https://images.unsplash.com/photo-1477600939855-10a534e9a59e" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-950/60 to-black/90"></div>
      </div>

      {/* Mystical Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-300 to-amber-300 bg-clip-text text-transparent"
        >
          World of Karma 360
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-purple-200 mb-12 max-w-2xl mx-auto"
        >
          Step into a live, gamified house where every room has a story
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={handleEnterHallway}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-8 py-6 text-lg rounded-lg shadow-lg shadow-amber-500/50 transition-all duration-300 hover:scale-105"
          >
            Enter Hallway
          </Button>

          <Button
            onClick={handleBedroomPrivate}
            size="lg"
            variant="outline"
            className="border-2 border-purple-400 bg-purple-950/50 hover:bg-purple-900/70 text-purple-200 font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <Lock className="w-5 h-5 mr-2" />
            Bedroom Private
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
