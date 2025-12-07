
import React from 'react';
import { motion } from 'framer-motion';
import SponsorCard from '@/components/SponsorCard';

const Hallway = () => {
  // Easily adjustable sponsor links - modify URLs and details here
  const sponsors = [
    {
      id: 1,
      name: 'Sponsor Slot 1',
      description: 'Coming Soon',
      url: null,
      image: 'Interactive poster frame with mystical purple glow',
      available: false
    },
    {
      id: 2,
      name: 'Sponsor Slot 2',
      description: 'Coming Soon',
      url: null,
      image: 'Elegant poster frame with golden accents',
      available: false
    },
    {
      id: 3,
      name: 'Sponsor Slot 3',
      description: 'Coming Soon',
      url: null,
      image: 'Luxury poster frame with dark mystical theme',
      available: false
    },
    {
      id: 4,
      name: 'Sponsor Slot 4',
      description: 'Coming Soon',
      url: null,
      image: 'Premium poster frame with ambient lighting',
      available: false
    },
    {
      id: 5,
      name: 'Sponsor Slot 5',
      description: 'Coming Soon',
      url: null,
      image: 'Ornate poster frame with mystical patterns',
      available: false
    },
    {
      id: 6,
      name: 'Sponsor Slot 6',
      description: 'Coming Soon',
      url: null,
      image: 'Vintage poster frame with purple ambient glow',
      available: false
    }
  ];

  return (
    <section id="hallway" className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/40 to-black"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-purple-300 to-amber-300 bg-clip-text text-transparent">
            Hallway – Interactive Posters
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Explore our exclusive sponsor partnerships and interactive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor, index) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hallway;
