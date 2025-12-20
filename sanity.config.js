// sanity.config.js
import { defineConfig } from '@sanity/client';

export default defineConfig({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for fast delivery
  token: import.meta.env.SANITY_AUTH_TOKEN, // For mutations
});
