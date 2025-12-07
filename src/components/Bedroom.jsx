
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccessModal from '@/components/AccessModal';

const Bedroom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="bedroom" className="relative py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover opacity-30" 
          alt="Dark intimate bedroom with mystical lighting"
         src="https://images.unsplash.com/photo-1505916444963-51c825eb35d6" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-950/70 to-black/90"></div>
      </div>

      {/* Mystical Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-600/30 to-amber-600/30 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
            <Lock className="w-10 h-10 text-amber-300" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-purple-300 to-amber-300 bg-clip-text text-transparent">
            The Bedroom – Private Live Feed
          </h2>

          <p className="text-lg md:text-xl text-purple-200 mb-4 max-w-2xl mx-auto leading-relaxed">
            Enter the most exclusive room in the World of Karma 360. Experience intimate, 
            behind-the-scenes moments and private live feeds available only to verified members.
          </p>

          <p className="text-purple-300 mb-8 max-w-xl mx-auto">
            This space offers a unique glimpse into exclusive content, personal stories, 
            and interactive experiences reserved for those who seek deeper connection.
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-10 py-6 text-lg rounded-lg shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Lock className="w-5 h-5 mr-2" />
            Locked – Request Access
          </Button>
        </motion.div>
      </div>

      <AccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Bedroom;
