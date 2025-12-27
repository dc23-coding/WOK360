// src/lib/sanityClient.js
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Determine if we're in production
const isProduction = import.meta.env.PROD;
const hasToken = !!import.meta.env.VITE_SANITY_AUTH_TOKEN;

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // Use CDN in production for better performance and CORS handling
  // Only use direct API if we have a token for authenticated requests
  useCdn: isProduction && !hasToken,
  token: import.meta.env.VITE_SANITY_AUTH_TOKEN, // Optional - for admin operations
  perspective: 'published', // Show published content (use 'drafts' to include unpublished)
});

// Helper for generating image URLs with transformations
const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

// Content queries
export const contentQueries = {
  // Get all media for a specific zone and wing
  getZoneContent: (zone, wing) => {
    return sanityClient.fetch(
      `*[_type == "mediaContent" && zone == $zone && wing == $wing] | order(_createdAt desc) {
        _id,
        _createdAt,
        title,
        subtitle,
        zone,
        wing,
        contentType,
        "mediaUrl": mediaFile.asset->url,
        "thumbnailUrl": thumbnail.asset->url,
        duration,
        isLive,
        liveStreamUrl,
        accessLevel,
        featured,
        tags
      }`,
      { zone, wing }
    );
  },

  // Get featured content for a zone
  getFeaturedContent: (zone) => {
    return sanityClient.fetch(
      `*[_type == "mediaContent" && zone == $zone && featured == true] | order(_createdAt desc) [0...6] {
        _id,
        title,
        subtitle,
        "thumbnailUrl": thumbnail.asset->url,
        duration,
        contentType
      }`,
      { zone }
    );
  },

  // Get single content item by ID
  getContentById: (id) => {
    return sanityClient.fetch(
      `*[_type == "mediaContent" && _id == $id][0] {
        _id,
        title,
        subtitle,
        description,
        zone,
        wing,
        contentType,
        "mediaUrl": mediaFile.asset->url,
        "thumbnailUrl": thumbnail.asset->url,
        duration,
        isLive,
        liveStreamUrl,
        accessLevel,
        tags
      }`,
      { id }
    );
  },

  // Get live sessions
  getLiveSessions: () => {
    return sanityClient.fetch(
      `*[_type == "mediaContent" && isLive == true] | order(_createdAt desc) {
        _id,
        title,
        zone,
        "thumbnailUrl": thumbnail.asset->url,
        liveStreamUrl
      }`
    );
  },
};
