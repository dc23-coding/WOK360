// Quick script to add CORS origin to Sanity project
import https from 'https';

const PROJECT_ID = 'lp1si6d4';
const TOKEN = process.env.SANITY_AUTH_TOKEN;
const ORIGIN = 'https://wok-360-4x16hwbar-dc23-codings-projects.vercel.app';

if (!TOKEN) {
  console.error('❌ SANITY_AUTH_TOKEN not found in environment');
  process.exit(1);
}

const data = JSON.stringify({
  origin: ORIGIN,
  allowCredentials: true
});

const options = {
  hostname: 'api.sanity.io',
  port: 443,
  path: `/v2021-06-07/projects/${PROJECT_ID}/cors`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${TOKEN}`
  }
};

console.log(`🔧 Adding CORS origin: ${ORIGIN}`);

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ CORS origin added successfully!');
      console.log(JSON.parse(responseData));
    } else {
      console.error(`❌ Error: ${res.statusCode}`);
      console.error(responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error);
});

req.write(data);
req.end();
