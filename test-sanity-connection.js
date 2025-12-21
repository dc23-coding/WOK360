// test-sanity-connection.js
// Quick test to verify Sanity connection with new token

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env.local') });

// Create Sanity client
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.VITE_SANITY_AUTH_TOKEN,
});

console.log('🔍 Testing Sanity Connection...\n');

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('Test 1: Verifying project configuration...');
    const config = sanityClient.config();
    console.log(`✅ Project ID: ${config.projectId}`);
    console.log(`✅ Dataset: ${config.dataset}`);
    console.log(`✅ API Version: ${config.apiVersion}`);
    console.log(`✅ Token present: ${config.token ? 'Yes' : 'No'}\n`);

    // Test 2: Fetch datasets
    console.log('Test 2: Fetching available datasets...');
    const datasets = await sanityClient.request({
      url: `/datasets`,
      method: 'GET',
    });
    console.log(`✅ Found ${datasets.length} dataset(s):`);
    datasets.forEach(ds => console.log(`   - ${ds.name} (${ds.aclMode})`));
    console.log('');

    // Test 3: Query for documents
    console.log('Test 3: Testing document query...');
    const query = `*[_type == "mediaContent"][0...3] {_id, title, _type}`;
    const result = await sanityClient.fetch(query);
    
    if (result.length === 0) {
      console.log('⚠️  No documents found - schema may not be deployed or no content uploaded yet');
    } else {
      console.log(`✅ Found ${result.length} document(s):`);
      result.forEach(doc => console.log(`   - ${doc.title || doc._id} (${doc._type})`));
    }
    console.log('');

    // Test 4: Check permissions
    console.log('Test 4: Testing write permissions...');
    try {
      // Try to fetch project info (requires read access)
      await sanityClient.request({
        url: `/projects/${config.projectId}`,
        method: 'GET',
      });
      console.log('✅ Read permissions: OK');
      console.log('ℹ️  Write permissions: Not tested (would create test document)');
    } catch (err) {
      console.log('⚠️  Limited permissions detected:', err.message);
    }
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('🎉 Sanity Connection Test: PASSED');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy your schema if not done yet');
    console.log('2. Upload content via ContentUploader (admin code: 3104)');
    console.log('3. Update Vercel environment variables with new token');
    console.log('');

  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ Sanity Connection Test: FAILED');
    console.error('═══════════════════════════════════════');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.statusCode === 401) {
      console.error('🔐 Authentication Error:');
      console.error('   - Token is invalid or expired');
      console.error('   - Check VITE_SANITY_AUTH_TOKEN in .env.local');
      console.error('   - Verify token has proper permissions in Sanity dashboard');
    } else if (error.statusCode === 403) {
      console.error('🚫 Permission Error:');
      console.error('   - Token lacks required permissions');
      console.error('   - Grant "Viewer" or "Editor" role in Sanity dashboard');
    } else if (error.statusCode === 404) {
      console.error('🔍 Not Found:');
      console.error('   - Project ID may be incorrect');
      console.error('   - Dataset may not exist');
    } else {
      console.error('Stack trace:', error.stack);
    }
    
    process.exit(1);
  }
}

testConnection();
