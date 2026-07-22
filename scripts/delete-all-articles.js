const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split(/\r?\n/).forEach((line) => {
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

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw').trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
const token = process.env.SANITY_WRITE_TOKEN ? process.env.SANITY_WRITE_TOKEN.trim() : null;

if (!token) {
  console.error('ERROR: SANITY_WRITE_TOKEN is not set in environment or .env.local.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
});

async function deleteAllArticles() {
  console.log('Fetching all articles to delete...');
  
  const query = `*[_type == "article"][0...1000]{ _id }`;
  const docsToDelete = await client.fetch(query);
  
  if (docsToDelete.length === 0) {
    console.log('No articles found to delete.');
    return;
  }
  
  console.log(`Found ${docsToDelete.length} articles to delete. Deleting...`);
  
  const transaction = client.transaction();
  docsToDelete.forEach((doc) => {
    transaction.delete(doc._id);
  });
  
  try {
    const result = await transaction.commit();
    console.log(`Successfully deleted ${result.results.length} articles.`);
  } catch (err) {
    console.error('Failed to delete articles:', err);
  }
}

deleteAllArticles().catch(console.error);
