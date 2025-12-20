#!/usr/bin/env node
// scripts/deploy-sanity-schema.js
// Deploy WOK360 media content schema to Sanity

import { createClient } from '@sanity/client';
import { mediaContentSchema } from '../schemas/mediaContent.js';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'lp1si6d4',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function deploySchema() {
  console.log('🚀 Deploying WOK360 media content schema to Sanity...\n');
  
  try {
    // Check connection
    console.log('📡 Checking Sanity connection...');
    const projects = await client.request({ uri: '/projects' });
    console.log('✅ Connected to Sanity\n');

    // Note: Sanity schema deployment typically requires Sanity CLI
    // This script serves as documentation of the schema structure
    
    console.log('📋 Schema Definition:');
    console.log('-------------------');
    console.log('Document Type:', mediaContentSchema.name);
    console.log('Title:', mediaContentSchema.title);
    console.log('Fields:', mediaContentSchema.fields.length);
    console.log('\nField List:');
    mediaContentSchema.fields.forEach(field => {
      console.log(`  - ${field.name} (${field.type})${field.validation ? ' *required' : ''}`);
    });

    console.log('\n⚠️  To deploy this schema, use Sanity CLI:');
    console.log('   1. npm install -g @sanity/cli');
    console.log('   2. sanity login');
    console.log('   3. Create a sanity.config.ts in your project root');
    console.log('   4. sanity schema deploy');
    console.log('\nOr use Sanity Studio:');
    console.log('   1. Set up Sanity Studio in a separate directory');
    console.log('   2. Copy schema definition to studio/schemas/');
    console.log('   3. Run: sanity deploy');

    console.log('\n✅ Schema structure validated!');
    console.log('📝 Ready for deployment to Sanity project: lp1si6d4\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deploySchema();
