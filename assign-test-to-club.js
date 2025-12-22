// Quick patch: Assign test audio to Club Hollywood Main Stage
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'lp1si6d4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.VITE_SANITY_AUTH_TOKEN,
});

async function assignToClub() {
  console.log('\n🎭 Assigning test audio to Club Hollywood Main Stage...\n');

  // Update the "Dannn" track to show in Club
  const result = await sanityClient
    .patch('2Tmb7ZgWJ2LGZDfjLMRW39') // Dannn track ID
    .set({ 
      room: 'club-main-stage',
      zone: 'clubHollywood',
      wing: 'dark' // Club Hollywood is in dark wing
    })
    .commit();

  console.log('✅ Updated:', result.title);
  console.log('   Room:', result.room);
  console.log('   Zone:', result.zone);
  console.log('\n🎵 Now check Club Hollywood - "Dannn" should appear in the playlist\n');
}

assignToClub().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
