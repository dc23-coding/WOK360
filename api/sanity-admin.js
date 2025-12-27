// API route for Sanity admin operations
// Keeps auth token server-side
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Server-side only!
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple admin key verification (enhance this for production)
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { action, data } = req.body;

    switch (action) {
      case 'fetchAll':
        const content = await sanityClient.fetch(
          `*[_type == "mediaContent"] | order(_createdAt desc) {
            _id, _createdAt, title, subtitle, zone, wing, room,
            contentType, accessLevel, featured,
            "thumbnailUrl": thumbnail.asset->url,
            "mediaUrl": mediaFile.asset->url,
            duration, tags
          }`
        );
        return res.json({ content });

      case 'updateRoom':
        const result = await sanityClient
          .patch(data.contentId)
          .set({ room: data.newRoom })
          .commit();
        return res.json({ result });

      case 'toggleFeatured':
        const toggle = await sanityClient
          .patch(data.contentId)
          .set({ featured: data.featured })
          .commit();
        return res.json({ result: toggle });

      case 'delete':
        await sanityClient.delete(data.contentId);
        return res.json({ success: true });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
