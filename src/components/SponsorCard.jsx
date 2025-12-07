
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SponsorCard = ({ sponsor, index }) => {
  const handleClick = () => {
    if (sponsor.url) {
      window.open(sponsor.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-950/60 to-black/80 border border-purple-800/30 shadow-xl shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/20">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            alt={sponsor.name}
           src="https://images.unsplash.com/photo-1530442175330-d883aa6632e9" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-950/40 to-transparent"></div>
          
          {/* Mystical Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-purple-600/0 group-hover:from-amber-500/10 group-hover:to-purple-600/10 transition-all duration-500"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-amber-300 mb-2 group-hover:text-amber-200 transition-colors">
            {sponsor.name}
          </h3>
          <p className="text-purple-200 mb-4">
            {sponsor.description}
          </p>

          {sponsor.available && sponsor.url ? (
            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold transition-all duration-300"
            >
              Visit Sponsor
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-950/50 border border-purple-700/30">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">Coming Soon / Sponsor Slot</span>
            </div>
          )}
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

export default SponsorCard;
