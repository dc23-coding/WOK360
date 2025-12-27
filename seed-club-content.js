// Quick script to check Sanity content and create test data for Club Hollywood
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'lp1si6d4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.VITE_SANITY_AUTH_TOKEN, // Needs write token
});

async function checkAndSeedClubContent() {
  console.log('\n🔍 Checking Sanity for Club Hollywood content...\n');

  // Check what exists
  const existing = await sanityClient.fetch(
    `*[_type == "mediaContent" && room == "club-hollywood-main"] {
      _id,
      title,
      room,
      "hasMedia": defined(mediaFile.asset)
    }`
  );

  console.log(`Found ${existing.length} items for club-hollywood-main`);
  
  if (existing.length > 0) {
    console.log('✅ Content already exists:');
    existing.forEach(item => {
      console.log(`   - ${item.title} (Media: ${item.hasMedia ? '✓' : '✗'})`);
    });
    return;
  }

  console.log('\n📝 No content found. Creating sample mixes...\n');

  // Sample mixes for Club Hollywood
  const testMixes = [
    {
      _type: 'mediaContent',
      title: 'Deep House Sunset Mix',
      subtitle: 'Sunset vibes for the dance floor',
      room: 'club-hollywood-main',
      zone: 'clubHollywood',
      contentType: 'audio',
      duration: '62:30',
      tags: ['house', 'sunset', 'chill'],
      description: 'A warm deep house mix perfect for sunset sessions',
      featured: true,
    },
    {
      _type: 'mediaContent',
      title: 'Techno Midnight Session',
      subtitle: 'Dark and driving beats',
      room: 'club-hollywood-main',
      zone: 'clubHollywood',
      contentType: 'audio',
      duration: '74:15',
      tags: ['techno', 'midnight', 'dark'],
      description: 'High-energy techno for peak hours',
      featured: true,
    },
    {
      _type: 'mediaContent',
      title: 'Ambient Lounge Mix',
      subtitle: 'Chill background vibes',
      room: 'club-hollywood-main',
      zone: 'clubHollywood',
      contentType: 'audio',
      duration: '45:20',
      tags: ['ambient', 'lounge', 'chill'],
      description: 'Relaxed ambient sounds for the lounge',
    },
  ];

  try {
    for (const mix of testMixes) {
      const result = await sanityClient.create(mix);
      console.log(`✅ Created: ${result.title} (${result._id})`);
    }

    console.log('\n🎉 Sample content created!');
    console.log('\n⚠️  NOTE: These documents have no media files attached yet.');
    console.log('   To make them playable:');
    console.log('   1. Open Sanity Studio');
    console.log('   2. Find each document');
    console.log('   3. Upload an audio file to the "Media File" field\n');
  } catch (err) {
    console.error('\n❌ Error creating content:', err.message);
    if (err.message.includes('Insufficient permissions')) {
      console.log('\n💡 You need a write token in VITE_SANITY_AUTH_TOKEN');
      console.log('   Get one from: https://sanity.io/manage/project/lp1si6d4/api');
    }
  }
}

checkAndSeedClubContent().catch(console.error);
