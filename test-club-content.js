// Quick test to see what content exists in Sanity
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'lp1si6d4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'previewDrafts',
});

async function testQuery() {
  console.log('\n=== Testing Sanity Content ===\n');

  // Test 1: Get ALL content
  const allContent = await sanityClient.fetch(
    `*[_type == "mediaContent"] | order(_createdAt desc) {
      _id,
      title,
      contentType,
      zone,
      wing,
      room,
      "hasMedia": defined(mediaFile.asset->url),
      _createdAt
    }`
  );
  console.log('📦 Total content items:', allContent.length);
  console.log('All content:', JSON.stringify(allContent, null, 2));

  // Test 2: Filter by room
  const clubContent = await sanityClient.fetch(
    `*[_type == "mediaContent" && room == "club-main-stage"] {
      _id,
      title,
      contentType,
      room,
      "mediaUrl": mediaFile.asset->url
    }`
  );
  console.log('\n🎭 Club Main Stage content:', clubContent.length, 'items');
  console.log(JSON.stringify(clubContent, null, 2));

  // Test 3: Check for audio content specifically
  const audioContent = await sanityClient.fetch(
    `*[_type == "mediaContent" && contentType == "audio"] {
      _id,
      title,
      room,
      contentType
    }`
  );
  console.log('\n🎵 Audio content:', audioContent.length, 'items');
  console.log(JSON.stringify(audioContent, null, 2));

  // Test 4: Check for Club Hollywood zone
  const clubZone = await sanityClient.fetch(
    `*[_type == "mediaContent" && zone == "clubHollywood"] {
      _id,
      title,
      zone,
      room
    }`
  );
  console.log('\n🌟 Club Hollywood zone content:', clubZone.length, 'items');
  console.log(JSON.stringify(clubZone, null, 2));
}

testQuery().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
