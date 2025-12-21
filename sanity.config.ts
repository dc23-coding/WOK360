// sanity.config.ts - Sanity Studio Configuration
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { mediaContentSchema } from './schemas/mediaContent.js';

export default defineConfig({
  name: 'wok360-studio',
  title: 'WOK360 Content Studio',
  
  projectId: 'lp1si6d4',
  dataset: 'production',
  
  plugins: [
    structureTool(),
    visionTool(), // For testing GROQ queries
  ],
  
  schema: {
    types: [mediaContentSchema],
  },
});
