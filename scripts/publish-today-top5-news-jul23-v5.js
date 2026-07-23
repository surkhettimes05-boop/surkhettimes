const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Parse .env.local manually
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
    category: 'politics',
    title: 'RSP Chair Rabi Lamichhane Prepares for High-Level China Visit in Late August',
    date: '2026-07-23',
    author: 'SurkhetTimes Diplomatic Desk',
    facts: [
      'Rastriya Swatantra Party (RSP) Chair Rabi Lamichhane is preparing for an official party-to-party visit to Beijing in late August 2026 upon invitation from the Communist Party of China (CPC).',
      'High-level meetings are scheduled with Chinese Foreign Minister Wang Yi and Vice President Han Zheng, with the RSP seeking to coordinate a meeting with President Xi Jinping.',
      'The visit aims to strengthen bilateral ties and political engagement following Lamichhane\'s previous visit to India in June where he met with Prime Minister Narendra Modi.'
    ],
    fullStory: 'Rastriya Swatantra Party (RSP) Chairman Rabi Lamichhane is preparing for a high-profile visit to China scheduled for late August 2026 following a formal invitation from the Communist Party of China (CPC). Speaking to media representatives on July 23, party officials confirmed that the visit will be conducted in a party-to-party capacity to bolster political dialogue and confidence between Nepal and China. During the trip, Lamichhane is slated to hold bilateral discussions with senior Chinese leaders including Foreign Minister Wang Yi, Vice President Han Zheng, and executive members of the CPC International Department. The RSP delegation has also requested a high-level audience with President Xi Jinping. This upcoming diplomatic outreach follows Lamichhane’s previous bilateral engagement in India in June 2026, underscoring the party\'s proactive international diplomacy.'
  },
  {
    category: 'politics',
    title: 'CPN-UML Ministers Resign En Masse from Bagmati Provincial Government',
    date: '2026-07-23',
    author: 'SurkhetTimes Provincial Desk',
    facts: [
      'All six CPN-UML ministers in Bagmati Province resigned en masse and officially withdrew support from Chief Minister Indra Bahadur Baniya\'s coalition government.',
      'Parliamentary party leader Jagannath Thapaliya handed joint resignation letters to the Chief Minister\'s office, reducing the government to a minority status.',
      'Chief Minister Baniya now faces a constitutional requirement to seek and win a vote of confidence in the Bagmati Provincial Assembly within 30 days.'
    ],
    fullStory: 'The political landscape of Bagmati Province experienced a major realignment on July 23, 2026, after all six ministers representing the CPN-UML tendered their resignations en masse from the provincial cabinet led by Chief Minister Indra Bahadur Baniya. Led by UML parliamentary party leader Jagannath Thapaliya, the ministers formally handed their joint resignation letters to the Chief Minister\'s secretariat while officially withdrawing party support for the coalition government. The mass departure includes key portfolios such as Physical Infrastructure, Agriculture, Health, and Industry. With the UML’s withdrawal, Chief Minister Baniya\'s administration has been relegated to minority status, triggering a 30-day constitutional window within which the Chief Minister must prove a majority in the Bagmati Provincial Assembly or pave the way for a new provincial coalition.'
  },
  {
    category: 'business',
    title: 'Nepal Foreign Direct Investment Commitments Drop 10% to Rs 58 Billion in Fiscal Year 2025/26',
    date: '2026-07-23',
    author: 'SurkhetTimes Economy Desk',
    facts: [
      'Foreign Direct Investment (FDI) commitments to Nepal declined by 10% in the 2025/26 fiscal year, dropping to Rs 58 billion according to Department of Industry records.',
      'Economists attribute the slowdown to ongoing political shifts, policy unpredictability, and bureaucratic delays in repatriating investment capital.',
      'Trade deficit data released simultaneously indicated a total trade deficit of Rs 1.78 trillion for the fiscal year, highlighting continued import dependence.'
    ],
    fullStory: 'Foreign Direct Investment (FDI) commitments to Nepal registered a 10 percent year-on-year decline for the fiscal year 2025/26, falling to Rs 58 billion according to annual economic reports released by the Department of Industry on July 23, 2026. Financial analysts and trade experts attribute the decline in foreign capital pledges primarily to frequent political realignments, regulatory hurdles, and lingering investor uncertainties regarding profit repatriation procedures. Concurrently, government trade data revealed that Nepal’s national trade deficit expanded to Rs 1.78 trillion over the same fiscal period, emphasizing the structural challenge of high import dependency alongside subdued foreign investment inflows.'
  },
  {
    category: 'news',
    title: 'ACAP Reports 25 Altitude Sickness Fatalities in Annapurna Region During FY 2025/26',
    date: '2026-07-23',
    author: 'SurkhetTimes Alpine & Tourism Desk',
    facts: [
      'Annapurna Conservation Area Project (ACAP) reported 25 fatalities caused by acute altitude sickness during the 2025/26 fiscal year.',
      'The victims included 12 Nepalis (including 4 guides and porters), 9 Indian tourists, and 4 foreign nationals from Japan, Mexico, Spain, and Singapore.',
      'Authorities highlighted that rapid road travel to high-altitude destinations like Muktinath without gradual acclimatisation remains the primary cause.'
    ],
    fullStory: 'Data published by the Annapurna Conservation Area Project (ACAP) on July 23, 2026, revealed that 25 trekkers and local staff lost their lives due to high-altitude sickness across the Annapurna region during the 2025/26 fiscal year. The casualties comprised 12 Nepalese citizens—including four mountain guides and porters—nine Indian tourists, and four foreign national trekkers from Japan, Mexico, Spain, and Singapore. ACAP Chief Dr. Rabin Kadariya emphasized that the majority of fatal incidents occurred in Mustang and Manang, where visitors often travel rapidly by vehicle directly to high elevations such as Muktinath without adequate acclimatisation days. Authorities have issued urgent guidelines advising all domestic and international trekkers to limit elevation gains to 500 meters daily and seek immediate descent upon encountering altitude sickness symptoms.'
  },
  {
    category: 'sports',
    title: 'Nepal Falls 3-2 to Sri Lanka in CAVA Men\'s Volleyball Championship',
    date: '2026-07-23',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      'Nepal suffered a hard-fought 3-2 defeat against Sri Lanka in their Central Asian Volleyball Association (CAVA) Men’s Championship match in Islamabad.',
      'Despite winning the second and fourth sets to force a tiebreaker, Nepal narrowly conceded the final fifth set 15-13.',
      'The result marks Nepal\'s second consecutive defeat in the regional tournament as team coaches prepare for upcoming matches against host Pakistan.'
    ],
    fullStory: 'The Nepalese national men’s volleyball team suffered a narrow 3-2 defeat against Sri Lanka in a thrilling five-set encounter at the Central Asian Volleyball Association (CAVA) Men’s Championship in Islamabad, Pakistan, on July 23, 2026. Sri Lanka claimed the opening set before Nepal fought back strongly to claim the second set. After dropping the third set, Nepal displayed commendable resilience to win the fourth set 25-22 and push the match into a decisive tiebreaker. However, Sri Lanka held their nerve in the final set to edge out Nepal 15-13. The loss represents Nepal\'s second consecutive setback in the group stage, with head coach encouraging tactical adjustments ahead of their upcoming fixture against tournament host Pakistan.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 23, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);

    const imageAssetId = await uploadImage(`nepal-real-news-jul23-v5-${i + 1}-${timestamp}`);

    const slugCurrent = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${timestamp}-${i}`;

    const doc = {
      _type: 'article',
      title: story.title,
      slug: { _type: 'slug', current: slugCurrent },
      category: story.category,
      author: story.author,
      date: story.date,
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
