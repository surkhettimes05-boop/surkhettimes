import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('ERROR: SANITY_WRITE_TOKEN is not set in your environment.');
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

const realNewsData = [
  {
    category: 'news',
    title: 'New Joint UN Mental Health Support Programme Launched in Nepal',
    facts: [
      'Three-year program from 2025 to 2028.',
      'Supported by the Government of Switzerland.',
      'Focuses on Karnali, Lumbini, and Madhesh provinces.'
    ],
    fullStory: 'The Government of Nepal and the United Nations have launched a new three-year Joint UN Mental Health Support Programme (2025–2028). Supported by the Government of Switzerland, this initiative aims to strengthen mental health and psychosocial support systems, particularly focusing on the Karnali, Lumbini, and Madhesh provinces. The initiative highlights a growing commitment to public health infrastructures.'
  },
  {
    category: 'business',
    title: 'Nepal Rastra Bank Issues Rs 100 Billion Deposit Collection Auction',
    facts: [
      'NRB issued the notice on July 15.',
      'Aimed at managing national liquidity.',
      'NEPSE gained 14 points despite a drop in trading turnover.'
    ],
    fullStory: 'The Nepal Rastra Bank (NRB) issued a notice on July 15 for a deposit collection auction worth Rs 100 billion to manage the banking sector’s liquidity. Concurrently, the Nepal Stock Exchange (NEPSE) saw a gain of 14 points, closing at 2,590.29. This positive momentum occurred despite a drop in overall trading turnover to Rs 4.17 billion.'
  },
  {
    category: 'politics',
    title: 'National Assembly Set to Reconvene Amid Disaster Preparedness Concerns',
    facts: [
      'Assembly reconvenes on July 31.',
      'Lawmakers push for better disaster preparedness.',
      'Office of the Attorney General presented its annual report.'
    ],
    fullStory: 'The National Assembly is scheduled to reconvene on July 31. Recent parliamentary proceedings included the presentation of the annual report from the Office of the Attorney General. Lawmakers across the board are emphasizing the urgent need for improved disaster preparedness, governance, and stronger agricultural support in light of the ongoing monsoon season.'
  },
  {
    category: 'news',
    title: 'Prime Minister Directs Establishment of Dedicated Burn Care Centers',
    facts: [
      'PM directed authorities to improve emergency services.',
      'Centers will be established in all seven provinces.',
      'Aims to reduce preventable fatalities from burn injuries.'
    ],
    fullStory: 'In a significant push for public health infrastructure, the Prime Minister has directed relevant authorities to establish dedicated burn care centers in all seven provinces of Nepal. The directive aims to significantly improve emergency health services and reduce fatalities resulting from severe burn injuries that currently require travel to the capital.'
  },
  {
    category: 'agriculture',
    title: 'Heavy Monsoon Rains Disrupt Key Transport Corridors',
    facts: [
      'Hetauda-Kathmandu highways temporarily suspended.',
      'Landslides and floods pose significant risks.',
      'Farmers face logistical challenges transporting goods.'
    ],
    fullStory: 'Recent heavy monsoon rains have led to the temporary suspension of key transport corridors, including the Hetauda-Kathmandu highways such as Kanti Lokpath and the Sisneri-Pharping routes. The disruptions, caused by the high risk of landslides and floods, are also impacting the agricultural sector as farmers face logistical challenges transporting fresh produce to major markets.'
  }
];

async function generateData() {
  console.log('Generating REAL Nepal news data...');
  const docsToCreate: any[] = [];

  for (let i = 0; i < realNewsData.length; i++) {
    const item = realNewsData[i];
    const imageAssetId = await uploadImage(`nepal-news-${i}-${Date.now()}`);
    
    // Notice we do NOT use the "drafts." prefix here, so it is published immediately.
    const doc: any = {
      _type: 'article',
      title: item.title,
      slug: { _type: 'slug', current: `real-news-${item.category}-${i}-${Date.now()}` },
      category: item.category,
      author: 'SurkhetTimes Desk',
      date: new Date().toISOString(),
      facts: item.facts,
      fullStory: item.fullStory,
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

  console.log(`Prepared ${docsToCreate.length} real news documents. Uploading to Sanity...`);

  const transaction = client.transaction();
  docsToCreate.forEach(doc => {
    transaction.create(doc);
  });

  try {
    const result = await transaction.commit();
    console.log(`Successfully published ${result.results.length} real news articles!`);
  } catch (err) {
    console.error('Transaction failed:', err);
  }
}

generateData().catch(console.error);
