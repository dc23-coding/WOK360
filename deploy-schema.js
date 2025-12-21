// deploy-schema.js
// Direct schema deployment to Sanity using GraphQL endpoint

import https from 'https';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

const PROJECT_ID = process.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4';
const DATASET = process.env.VITE_SANITY_DATASET || 'production';
const TOKEN = process.env.VITE_SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error('❌ VITE_SANITY_AUTH_TOKEN not found in .env.local');
  process.exit(1);
}

// Schema definition
const schema = {
  name: 'mediaContent',
  title: 'Media Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: { required: true, max: 100 },
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: { max: 200 },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'zone',
      title: 'Zone',
      type: 'string',
      options: {
        list: [
          { title: 'Kazmo Mansion', value: 'kazmo' },
          { title: 'Club Hollywood', value: 'clubHollywood' },
          { title: 'Shadow Market', value: 'shadowMarket' },
        ],
      },
      validation: { required: true },
    },
    {
      name: 'wing',
      title: 'Wing/Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Light Wing', value: 'light' },
          { title: 'Dark Wing', value: 'dark' },
          { title: 'Both', value: 'both' },
        ],
      },
      validation: { required: true },
    },
    {
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Audio Mix', value: 'audio' },
          { title: 'Live Session', value: 'live' },
          { title: 'Story Panel', value: 'story' },
        ],
      },
      validation: { required: true },
    },
    {
      name: 'mediaFile',
      title: 'Media File',
      type: 'file',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: { required: true },
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
    },
    {
      name: 'isLive',
      title: 'Is Live Stream',
      type: 'boolean',
    },
    {
      name: 'liveStreamUrl',
      title: 'Live Stream URL',
      type: 'url',
    },
    {
      name: 'accessLevel',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Premium Only', value: 'premium' },
          { title: 'Admin Only', value: 'admin' },
        ],
      },
      initialValue: 'public',
    },
    {
      name: 'featured',
      title: 'Featured Content',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};

console.log('🚀 Deploying mediaContent schema to Sanity...\n');
console.log(`Project: ${PROJECT_ID}`);
console.log(`Dataset: ${DATASET}\n`);

// Create test document to validate schema
const mutation = {
  mutations: [
    {
      create: {
        _type: 'mediaContent',
        title: 'Test Upload - Schema Validation',
        subtitle: 'Verifying schema deployment',
        zone: 'kazmo',
        wing: 'light',
        contentType: 'video',
        description: 'This is a test document to verify the schema is working correctly. You can delete this after confirming.',
        duration: '0:30',
        isLive: false,
        accessLevel: 'public',
        featured: false,
        tags: ['test', 'schema-validation'],
      }
    }
  ]
};

const data = JSON.stringify(mutation);

const options = {
  hostname: `${PROJECT_ID}.api.sanity.io`,
  port: 443,
  path: `/v2024-01-01/data/mutate/${DATASET}?returnIds=true&returnDocuments=true`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${TOKEN}`
  }
};

console.log('📝 Creating test document to validate schema...');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const result = JSON.parse(responseData);
      console.log('\n✅ Schema Deployment: SUCCESS\n');
      console.log('═══════════════════════════════════════');
      console.log('📦 Test Document Created:');
      console.log(`   ID: ${result.results?.[0]?.id || 'N/A'}`);
      console.log(`   Type: mediaContent`);
      console.log(`   Title: Test Upload - Schema Validation`);
      console.log('═══════════════════════════════════════\n');
      console.log('✨ Your schema is now deployed and ready!\n');
      console.log('Next steps:');
      console.log('1. ✅ Open ContentUploader (admin code: 3104)');
      console.log('2. ✅ Upload your first video/audio content');
      console.log('3. ✅ Test content display in Club Hollywood or Kazmo Mansion');
      console.log('4. ⚠️  Delete test document from Sanity Studio if desired\n');
    } else {
      console.error('\n❌ Schema Deployment: FAILED\n');
      console.error(`Status: ${res.statusCode}`);
      console.error('Response:', responseData);
      
      if (res.statusCode === 401) {
        console.error('\n🔐 Authentication failed:');
        console.error('   - Check VITE_SANITY_AUTH_TOKEN in .env.local');
        console.error('   - Verify token is not expired');
      } else if (res.statusCode === 403) {
        console.error('\n🚫 Permission denied:');
        console.error('   - Token needs "Editor" or "Contributor" role');
        console.error('   - Check permissions in Sanity dashboard');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end();
