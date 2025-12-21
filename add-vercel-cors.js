// Script to add Vercel CORS origin to Sanity project
// Run this with: node add-vercel-cors.js
import dotenv from 'dotenv';
import https from 'https';

dotenv.config({ path: '.env.local' });

const projectId = 'lp1si6d4';
const token = process.env.VITE_SANITY_AUTH_TOKEN;

// Vercel preview domain pattern
const origins = [
  'https://wok-360-frtisryhc-dc23-codings-projects.vercel.app', // Current preview
  'https://wok-360.vercel.app', // Production domain (if you have one)
  'https://*.vercel.app' // All Vercel deployments
];

async function addCorsOrigin(origin) {
  const data = JSON.stringify({
    origin: origin,
    allowCredentials: true
  });

  const options = {
    hostname: 'api.sanity.io',
    port: 443,
    path: `/v2021-06-07/projects/${projectId}/cors`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Added CORS origin: ${origin}`);
          resolve(JSON.parse(responseData));
        } else {
          console.error(`❌ Failed to add ${origin}: ${res.statusCode}`);
          console.error(responseData);
          reject(new Error(responseData));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request error for ${origin}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Adding Vercel CORS origins to Sanity...\n');
  
  if (!token) {
    console.error('❌ VITE_SANITY_AUTH_TOKEN not found in .env.local');
    process.exit(1);
  }

  for (const origin of origins) {
    try {
      await addCorsOrigin(origin);
    } catch (error) {
      // Continue even if one fails
      console.log(`Skipping ${origin} - may already exist or error occurred\n`);
    }
  }

  console.log('\n✅ CORS setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Redeploy on Vercel');
  console.log('2. Test the site - CORS errors should be gone');
}

main().catch(console.error);
