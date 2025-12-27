// Client helper to call secure API
const API_URL = import.meta.env.PROD 
  ? '/api/sanity-admin' 
  : 'http://localhost:3000/api/sanity-admin';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_ACCESS_CODE || '3104';

export async function secureAdminCall(action, data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY,
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Usage examples:
// await secureAdminCall('fetchAll');
// await secureAdminCall('updateRoom', { contentId: '123', newRoom: 'music-room' });
// await secureAdminCall('toggleFeatured', { contentId: '123', featured: true });
// await secureAdminCall('delete', { contentId: '123' });
