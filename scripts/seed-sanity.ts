import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Load environment variables manually if needed, 
// but usually tsx/dotenv does it. Let's just use process.env and remind user.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('ERROR: SANITY_WRITE_TOKEN is not set in your environment.');
  console.error('Please set it in .env.local or export it before running this script.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
});

async function uploadImage(seedString: string) {
  try {
    const response = await fetch(`https://picsum.photos/seed/${seedString}/800/600`);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `${seedString}.jpg`,
    });
    return asset._id;
  } catch (error) {
    console.error(`Failed to upload image for seed ${seedString}:`, error);
    return null;
  }
}

function getRandomDate() {
  const now = new Date();
  const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime())).toISOString();
}

const categories = ['news', 'politics', 'sports', 'business', 'agriculture'];
const docsToCreate: any[] = [];

async function generateData() {
  console.log('Generating seed data...');

  // 1. Articles (News, Politics, Sports, Business, Agriculture)
  for (const category of categories) {
    for (let i = 1; i <= 3; i++) {
      const id = `drafts.sample-article-${category}-${i}-${Date.now()}`;
      const imageAssetId = await uploadImage(`article-${category}-${i}`);
      
      const doc: any = {
        _id: id,
        _type: 'article',
        title: `[SAMPLE] Generic ${category.charAt(0).toUpperCase() + category.slice(1)} Article ${i}`,
        slug: { _type: 'slug', current: `sample-${category}-${i}-${Date.now()}` },
        category,
        author: 'Sample Content',
        date: getRandomDate(),
        facts: [
          'First generic bullet point with sample facts.',
          'Second generic bullet point with more details.',
          'Third generic bullet point concluding the facts.'
        ],
        fullStory: `This is a generic full story for the ${category} category. It contains no real individuals, companies, or events. This is paragraph one.\n\nThis is paragraph two, expanding on the completely fictional and placeholder topic. It provides more padding for the design to be tested.\n\nThis is paragraph three, summarizing the sample content. Remember that this is an unpublished draft.`,
        hasVideo: false,
      };

      if (imageAssetId) {
        doc.coverImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId }
        };
      }

      docsToCreate.push(doc);
    }
  }

  // 2. Obituaries
  for (let i = 1; i <= 3; i++) {
    const id = `drafts.sample-obituary-${i}-${Date.now()}`;
    const imageAssetId = await uploadImage(`obituary-${i}`);
    
    const doc: any = {
      _id: id,
      _type: 'obituary',
      name: `[SAMPLE] Placeholder Name ${i}`,
      age: 60 + i,
      dateOfDeath: getRandomDate(),
      description: `This is a sample obituary for testing purposes. We respectfully honor the memory of this placeholder individual. They will be remembered fondly in this design test.`,
    };
    
    if (imageAssetId) {
      doc.photo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId }
      };
    }
    
    docsToCreate.push(doc);
  }

  // 3. Jobs
  for (let i = 1; i <= 4; i++) {
    const id = `drafts.sample-job-${i}-${Date.now()}`;
    const doc = {
      _id: id,
      _type: 'job',
      title: `[SAMPLE] Local Job Opportunity ${i}`,
      company: `Sample Company ${i}`,
      location: `Sample Location, Karnali`,
      deadline: getRandomDate(),
      description: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: `This is a generic job description for a local position (e.g., retail, agriculture, teaching). We are looking for placeholder candidates to apply.` }]
        }
      ],
      applyLink: 'https://example.com/apply'
    };
    docsToCreate.push(doc);
  }

  // 4. Government Notices
  for (let i = 1; i <= 3; i++) {
    const id = `drafts.sample-notice-${i}-${Date.now()}`;
    const doc = {
      _id: id,
      _type: 'notice',
      title: `[SAMPLE] Public Notice ${i} (Tender/Exam)`,
      issuer: `Placeholder Government Body ${i}`,
      date: getRandomDate(),
      description: `This is a sample government notice for testing. It represents a generic tender or exam result. Not a real government publication.`
    };
    docsToCreate.push(doc);
  }

  console.log(`Prepared ${docsToCreate.length} documents. Uploading to Sanity...`);

  // Use a transaction to create them all
  const transaction = client.transaction();
  docsToCreate.forEach(doc => {
    transaction.createOrReplace(doc);
  });

  try {
    const result = await transaction.commit();
    console.log(`Successfully seeded ${result.results.length} documents!`);
  } catch (err) {
    console.error('Transaction failed:', err);
  }
}

generateData().catch(console.error);
