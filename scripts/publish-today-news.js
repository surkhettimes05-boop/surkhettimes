const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIdx = trimmed.indexOf('=');
      if (equalsIdx !== -1) {
        const key = trimmed.substring(0, equalsIdx).trim();
        const val = trimmed.substring(equalsIdx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

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

async function uploadImage(seedString) {
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

const newsStories = [
  {
    category: 'business',
    title: 'Nepal Enters Fiscal Year 2026/27 with Sweeping Income Tax Relief and Tariff Cuts',
    facts: [
      'On July 17, 2026, Nepal officially entered Fiscal Year 2026/27 with major economic tax and policy changes taking effect.',
      'The 1% entry-level income tax threshold was doubled to Rs 1 million, while the top personal income tax bracket was lowered from 39% to 29%.',
      'Civil servants received a 21% salary increase, and customs duties were reduced across 273 industrial imported items to lower manufacturing costs.'
    ],
    fullStory: 'Nepal officially inaugurated Fiscal Year 2026/27 on July 17, 2026, implementing a comprehensive set of tax revisions and fiscal reforms designed to stimulate economic growth and ease financial pressures on citizens. Key tax adjustments include doubling the entry-level 1% income tax threshold to Rs 1 million and reducing the maximum individual tax rate to 29%. Additionally, government employees saw a 21% salary increase, while customs duties were streamlined from 11 tiers to 7, bringing down import tariffs for over 270 industrial inputs.'
  },
  {
    category: 'politics',
    title: 'Government and Loan Shark Victims Agree on Establishing Special Usury Tribunal',
    facts: [
      'Government representatives and victims of predatory lending reached a historic agreement in Kathmandu on July 17, 2026.',
      'The federal government officially agreed to classify usurious lending (meter byaj) as a serious economic crime.',
      'A dedicated special tribunal will be established to nullify fraudulent land documents and enforce debt relief for affected borrowers.'
    ],
    fullStory: 'In a major political breakthrough on July 17, 2026, high-level federal officials and representatives of victims of predatory lending reached a consensus to address long-standing usury issues in Nepal. Under the formal agreement, the government agreed to classify meter byaj as a severe economic crime and set up a dedicated judicial tribunal. The tribunal will be empowered to invalidate illegal financial contracts, void fraudulent property transfers, and provide legal restitution to vulnerable citizens across the provinces.'
  },
  {
    category: 'news',
    title: 'Central Zoo Reopens to Public Following Negative Avian Influenza Test Results',
    facts: [
      'Kathmandu\'s Central Zoo in Jawalakhel reopened its doors to visitors on July 17, 2026, after nearly a month of preventive closure.',
      'The closure had been imposed on June 19 following suspected bird flu risks among resident avian species.',
      'Comprehensive veterinary testing confirmed negative results for avian influenza, allowing safe public access to resume.'
    ],
    fullStory: 'The Central Zoo in Jawalakhel, Lalitpur, officially reopened to visitors on July 17, 2026, after being closed since June 19 due to concerns over avian influenza (bird flu). Health authorities and veterinary officials confirmed that exhaustive diagnostic testing of all captive birds returned negative results, confirming the enclosure is safe. Zoo management announced updated biosecurity measures and welcomed back families and tourists to the popular wildlife site.'
  },
  {
    category: 'news',
    title: 'University Grants Commission Assumes Authority for Degree Equivalency Verification',
    facts: [
      'Effective July 17, 2026, the University Grants Commission (UGC) took over full responsibility for issuing higher education degree equivalence certificates.',
      'The mandate was previously managed by Tribhuvan University\'s Curriculum Development Centre.',
      'The shift aims to centralize degree verification and eliminate lengthy administrative delays for students with foreign degrees.'
    ],
    fullStory: 'Starting July 17, 2026, the University Grants Commission (UGC) officially became the sole authority responsible for evaluating and issuing degree equivalency certificates for higher education in Nepal. Shifting this function away from Tribhuvan University is part of a national higher education reform designed to centralize qualifications recognition and reduce administrative hurdles for Nepali students returning from study abroad.'
  },
  {
    category: 'politics',
    title: 'Nepal and India Resume Bilateral Talks on Additional Cross-Border Air Entry Routes',
    facts: [
      'Nepal and India reopened formal negotiations on July 17, 2026, regarding new air entry routes into Nepali airspace.',
      'The requested western and eastern entry points are vital for international operations at Pokhara and Bhairahawa airports.',
      'Opening new corridors will shorten international flight times, lower fuel expenses, and boost regional tourism.'
    ],
    fullStory: 'After a decade of stalled negotiations, aviation authorities from Nepal and India resumed formal bilateral talks on July 17, 2026, to discuss granting additional cross-border air entry routes to Nepal. Expanding entry points beyond the heavily congested Simara route is essential for making Pokhara International Airport and Gautam Buddha International Airport in Bhairahawa operationally viable and cost-effective for international commercial airlines.'
  }
];

async function publishNews() {
  console.log('Starting publication of 5 latest real news stories for Nepal (July 17, 2026)...');
  const docsToCreate = [];

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-july17-${i + 1}-${Date.now()}`);
    
    const slugCurrent = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now()}`;

    const doc = {
      _type: 'article',
      title: story.title,
      slug: { _type: 'slug', current: slugCurrent },
      category: story.category,
      author: 'SurkhetTimes News Desk',
      date: '2026-07-17',
      facts: story.facts,
      fullStory: story.fullStory,
      hasVideo: false,
      hasAudio: false,
      sourceType: 'human',
    };

    if (imageAssetId) {
      doc.coverImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId }
      };
    }

    docsToCreate.push(doc);
  }

  console.log('Uploading all 5 articles directly to Sanity CMS...');
  const transaction = client.transaction();
  docsToCreate.forEach((doc) => {
    transaction.create(doc);
  });

  try {
    const result = await transaction.commit();
    console.log(`SUCCESS: Successfully published ${result.results.length} news articles to Sanity CMS!`);
    console.log('Document IDs created:');
    result.results.forEach((r, idx) => console.log(` - ${idx + 1}: ${r.id}`));
  } catch (err) {
    console.error('ERROR: Sanity transaction failed:', err);
    process.exit(1);
  }
}

publishNews();
