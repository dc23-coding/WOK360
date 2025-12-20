// src/hooks/useZoneContent.js
// Hook for fetching and managing zone-specific content from Sanity
import { useState, useEffect } from 'react';
import { contentQueries } from '../lib/sanityClient';

export function useZoneContent(zone, wing) {
  const [content, setContent] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContent() {
      if (!zone) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch all content for this zone/wing
        const [zoneData, featured] = await Promise.all([
          contentQueries.getZoneContent(zone, wing),
          contentQueries.getFeaturedContent(zone)
        ]);

        if (isMounted) {
          setContent(zoneData || []);
          setFeaturedContent(featured || []);
        }
      } catch (err) {
        console.error('Error fetching zone content:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [zone, wing]);

  return {
    content,
    featuredContent,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      contentQueries.getZoneContent(zone, wing).then(setContent).finally(() => setLoading(false));
    }
  };
}

export function useLiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    contentQueries.getLiveSessions()
      .then(data => {
        if (isMounted) setSessions(data || []);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { sessions, loading };
}
