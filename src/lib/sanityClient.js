// src/lib/sanityClient.js
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Use direct API for authenticated requests with private datasets
  token: import.meta.env.VITE_SANITY_AUTH_TOKEN, // Required for private dataset reads
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
