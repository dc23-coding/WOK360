
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Mail, url: 'mailto:info@worldofkarma360.com', label: 'Email' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-black via-purple-950/30 to-black border-t border-purple-800/30 py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text text-transparent">
              World Of Karma 360
            </span>
            <p className="text-purple-200 mt-4 leading-relaxed">
              An immersive, gamified experience where every room tells a story. 
              Step into our world and discover exclusive content, interactive experiences, 
              and connections that transcend the ordinary.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:pl-12"
          >
            <span className="text-lg font-semibold text-amber-300 block mb-4">
              Explore
            </span>
            <nav className="space-y-2">
              <a href="#hallway" className="block text-purple-200 hover:text-amber-300 transition-colors duration-300">
                Hallway
              </a>
              <a href="#bedroom" className="block text-purple-200 hover:text-amber-300 transition-colors duration-300">
                Bedroom
              </a>
              <a href="#" className="block text-purple-200 hover:text-amber-300 transition-colors duration-300">
                Sponsors
              </a>
            </nav>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-lg font-semibold text-amber-300 block mb-4">
              Connect With Us
            </span>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-purple-950/50 border border-purple-700/50 flex items-center justify-center text-purple-300 hover:text-amber-300 hover:border-amber-500/50 hover:bg-purple-900/50 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-purple-200 mt-4">
              <span className="block text-sm">Email:</span>
              <a href="mailto:info@worldofkarma360.com" className="text-amber-300 hover:text-amber-200 transition-colors">
                info@worldofkarma360.com
              </a>
            </p>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-purple-800/30 text-center"
        >
          <p className="text-purple-300 text-sm">
            © {new Date().getFullYear()} World of Karma 360. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
