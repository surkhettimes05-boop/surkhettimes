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
    category: 'news',
    title: 'Monsoon Hazards Trigger Landslides and Block Nine Major Highways Across Nepal',
    facts: [
      'Persistent heavy monsoon rainfall across Nepal triggered widespread landslides and flash floods on July 21, 2026.',
      'Nine major national highways, including sections of the Mid-Hill, Mechi, and BP highways, have been rendered impassable.',
      'Disaster response teams and heavy machinery have been deployed by authorities, with travelers advised to check road conditions prior to departure.'
    ],
    fullStory: 'Heavy monsoon rains continuing across Nepal have severely disrupted transport infrastructure, triggering widespread landslides and flash floods that blocked nine major national highways on July 21, 2026. Key transit corridors, including strategic stretches of the Mid-Hill Highway, Mechi Highway, and BP Highway, remain closed as torrents of debris mud and boulders washed down vulnerable hillsides. The Department of Roads and National Disaster Risk Reduction and Management Authority (NDRRMA) have deployed heavy equipment and clearance crews to open single-lane traffic where safe. Authorities have urged passengers and freight operators to delay non-essential travel and verify highway status updates before setting out.'
  },
  {
    category: 'business',
    title: 'NEPSE Rallies 41.7 Points to 2,719.24 as First Kolkata-Biratnagar Rail Cargo Arrives',
    facts: [
      'The Nepal Stock Exchange (NEPSE) index gained 41.70 points to close at 2,719.24 on July 21, 2026.',
      'The first direct commercial rail cargo shipment from Kolkata, India successfully arrived at the Biratnagar Integrated Check Post.',
      'Foreign tourist stays hit a record average of 16.34 days, though daily per-capita spending dropped to $33.09 according to government data.'
    ],
    fullStory: 'Nepal\'s financial and trade sectors saw major developments on July 21, 2026, driven by stock market gains and a trade milestone. The Nepal Stock Exchange (NEPSE) benchmark index rallied by 41.70 points to close at 2,719.24 amid strong investor sentiment across commercial banking and hydropower counters. Concurrently, Nepal expanded its cross-border transit logistics as the first direct rail cargo container movement from Kolkata arrived at the Biratnagar dry port, establishing a major alternative import route beyond Birgunj. Meanwhile, newly released Ministry of Culture, Tourism and Civil Aviation figures revealed that while international tourists stayed longer in Nepal—averaging 16.34 days—average daily spending slipped to $33.09, prompting calls for enhanced high-value tourism offerings.'
  },
  {
    category: 'news',
    title: 'Nepal Drops 26 Places to 111th in 2026 Global Peace Index Report',
    facts: [
      'Nepal dropped 26 positions in the 2026 Global Peace Index (GPI), ranking 111th among 163 surveyed countries.',
      'The Institute for Economics and Peace highlighted governance challenges, public trust deficits, and political instability as primary drivers.',
      'Civil society leaders have called for institutional reforms and inclusive dialogue to strengthen domestic peacefulness.'
    ],
    fullStory: 'Nepal registered one of the sharpest drops in the 2026 Global Peace Index published on July 21, 2026, tumbling 26 positions down to 111th out of 163 nations evaluated worldwide. The annual report by the Institute for Economics and Peace (IEP) cited elevated political polarization, public governance friction, and social discontent following recent youth-led protests as key contributing factors. While Nepal continues to maintain low military spending and external conflict metrics, internal security indicators and confidence in state institutions registered noticeable declines. Policy analysts and civil society leaders emphasized the urgent need for structural governance reforms, anti-corruption measures, and public engagement to restore national social cohesion.'
  },
  {
    category: 'politics',
    title: 'Government Relocates Evicted Riverbank Squatters to Home Districts and Forms 37-Point Fiscal Guidance',
    facts: [
      'The Nepal government initiated the relocation of landless riverbank squatters evicted from Bagmati riverbanks back to their home districts.',
      'A 37-point fiscal discipline guidance was issued to government ministries to tighten spending and improve budget execution.',
      'A high-level task force was established by the Cabinet to review the official public holiday calendar.'
    ],
    fullStory: 'Urban development and public administration underwent key policy execution steps on July 21, 2026, as the government began transporting evicted Bagmati riverbank squatters back to their origin districts due to land scarcity in the Kathmandu Valley. Simultaneously, the Ministry of Finance released a mandatory 37-point fiscal management directive to all government bodies, enforcing strict ceilings on administrative expenditures, vehicle purchases, and foreign travel. Additionally, the Cabinet announced a task force tasked with reviewing Nepal\'s extensive public holiday calendar to improve public service productivity and streamline civil service operations.'
  },
  {
    category: 'news',
    title: 'Nepal and Russia Mark 70th Anniversary of Diplomatic Ties with Kathmandu Cultural Program',
    facts: [
      'Nepal and Russia celebrated 70 years of official diplomatic relations with a joint commemorative program in Kathmandu on July 21, 2026.',
      'The Russian House in Kathmandu hosted a historical photo exhibition showcasing seven decades of bilateral cooperation and development projects.',
      'Foreign ministry officials emphasized expanding partnership in education, energy, and cultural exchanges.'
    ],
    fullStory: 'Marking seven decades of official bilateral ties established in 1956, Nepal and the Russian Federation held a joint 70th anniversary commemoration in Kathmandu on July 21, 2026. Hosted at the Russian Cultural Centre (Russian House), the event featured a photo exhibition detailing historical visits, economic cooperation projects, and educational exchanges between the two nations over seven decades. Senior diplomats, government officials, and community leaders attended the ceremony, re-affirming commitments to bolster mutual ties in hydropower, science and technology, civil aviation, and university scholarship quotas for Nepalese students.'
  }
];

async function publishNews() {
  console.log('Starting publication of 5 latest real news stories for Nepal (July 21, 2026)...');
  const docsToCreate = [];

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-news-july21-${i + 1}-${Date.now()}`);
    
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
      date: '2026-07-21',
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
