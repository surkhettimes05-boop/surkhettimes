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
    "c8qhc0hXKR3LnM5L6haU8H",
    "c8qhc0hXKR3LnM5L6haUCs",
    "c8qhc0hXKR3LnM5L6haTuU",
    "c8qhc0hXKR3LnM5L6haTz5",
    "c8qhc0hXKR3LnM5L6haU3g"
  ];
  const articles = await client.fetch('*[_id in $ids]{_id, title, category, date, author, "hasCover": defined(coverImage)}', { ids });
  console.log('VERIFIED_ARTICLES_IN_SANITY:');
  console.log(JSON.stringify(articles, null, 2));
}

verify();
