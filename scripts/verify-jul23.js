const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIdx = trimmed.indexOf('=');
      if (equalsIdx !== -1) {
        const key = trimmed.substring(0, equalsIdx).trim();
        let val = trimmed.substring(equalsIdx + 1).trim();
        val = val.replace(/^["']|["']$/g, '').trim();
        process.env[key] = val;
      }
    }
  });
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function verify() {
  const ids = [
    'sdp72N6p3MsDpxU69VY5IP',
    'sdp72N6p3MsDpxU69VY5Kl',
    'sdp72N6p3MsDpxU69VY5BL',
    'sdp72N6p3MsDpxU69VY5Dh',
    'sdp72N6p3MsDpxU69VY5G3'
  ];
  const articles = await client.fetch('*[_id in $ids]{_id, title, category, date, author}', { ids });
  console.log('VERIFIED_ARTICLES_IN_SANITY:');
  console.log(JSON.stringify(articles, null, 2));
}

verify();
