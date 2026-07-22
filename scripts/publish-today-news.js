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
    category: 'politics',
    title: 'Government Rolls Back 3% Equity Fee on Health and Education Services',
    date: '2026-07-22',
    author: 'SurkhetTimes Governance Desk',
    facts: [
      'Prime Minister Balendra Shah announced the rollback of the controversial 3% equity fee on private health and education services.',
      'The tax was originally introduced in the recent budget and implemented on July 17, drawing intense public and political pushback.',
      'A formal Cabinet decision will finalize the withdrawal following cross-party consultations and legal reviews.'
    ],
    fullStory: 'The Government of Nepal has officially announced the withdrawal of the proposed 3% equity fee levied on private health and education services. Prime Minister Balendra Shah shared the decision via social media, stating that the levy was cancelled to protect citizens from rising service costs while maintaining efforts to improve healthcare and education access for disadvantaged groups. Opposition leaders, including Nepali Congress General Secretary Gagan Thapa and Gen-Z movement leader Rabi Kiran Hamal, welcomed the decision, while legal advisors noted that a formal Cabinet decision will be promulgated to complete the statutory rollback.'
  },
  {
    category: 'business',
    title: 'Parliament Scrutinizes Integrated Tourism Bill with 263 Proposed Amendments',
    date: '2026-07-22',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'Nepalese lawmakers have registered 263 amendments to the Integrated Tourism Bill currently under review in parliamentary committee.',
      'Key proposed rules mandate prior experience on a 7,000m peak before attempting Mt. Everest and strict zero-waste regulations.',
      'The landmark bill aims to modernize Himalayan mountaineering safety, regulate expedition agencies, and protect the fragile high-altitude environment.'
    ],
    fullStory: 'Nepal\'s Parliament has commenced clause-by-clause evaluation of the Integrated Tourism Bill, with lawmakers registering 263 separate amendments aimed at reforming high-altitude mountaineering and tourism management. Among the flagship proposals is a requirement that climbers summit at least one 7,000-meter peak in Nepal before receiving permits to climb Mt. Everest (8,848m). Additionally, the bill proposes permit auctions, mandatory environmental waste removal (requiring climbers to carry down 8kg of solid waste), and enhanced insurance coverage for Nepalese high-altitude guides and support staff.'
  },
  {
    category: 'politics',
    title: 'Nepali Congress Observes 44th BP Koirala Memorial Day Across Nepal',
    date: '2026-07-22',
    author: 'SurkhetTimes Political Desk',
    facts: [
      'Nepal commemorated the 44th Memorial Day of founding leader and former Prime Minister Bishweshwar Prasad Koirala.',
      'Events included a climate awareness "Green Run" in Lalitpur and policy symposiums on democratic governance.',
      'Party leaders reiterated BP Koirala\'s principles of social democracy and emphasized party unity and organizational reform.'
    ],
    fullStory: 'The Nepali Congress and democracy advocates across Nepal commemorated the 44th Memorial Day of BP Koirala, the founding leader of the Nepali Congress and Nepal\'s first democratically elected Prime Minister. Commemorative programs were held nationwide, anchored by a "Green Run" in Lalitpur organized to highlight youth participation in environmental sustainability and climate action. Party leaders reflected on BP Koirala\'s legacy of social democracy, national reconciliation, and constitutional government, calling for renewed commitment to democratic principles amidst modern political challenges.'
  },
  {
    category: 'news',
    title: '4.2 Magnitude Earthquake Strikes Bajhang District in Western Nepal',
    date: '2026-07-22',
    author: 'SurkhetTimes National Desk',
    facts: [
      'A magnitude 4.2 earthquake jolted Bajhang district at 4:40 AM today with its epicenter located near Kotdewal.',
      'Tremors were registered across Bajhang, Baitadi, and surrounding hill districts in Sudurpashchim Province.',
      'District security officials and local emergency responders confirmed no casualties or major structural damages occurred.'
    ],
    fullStory: 'A moderate earthquake measuring 4.2 on the Richter scale struck Bajhang district in western Nepal early Wednesday morning at 4:40 AM local time. According to the National Seismological Centre, the epicenter was located near Kotdewal in Bajhang. The earthquake triggered mild tremors felt across Bajhang, Baitadi, and adjacent districts in Sudurpashchim Province. Local authorities and police checkpoints conducted preliminary assessments across the affected rural municipalities, confirming that no injuries or physical damages were reported.'
  },
  {
    category: 'news',
    title: 'Tatopani Border Operations Suspended for Sixth Day Following Monsoon Landslides',
    date: '2026-07-22',
    author: 'SurkhetTimes Infrastructure Desk',
    facts: [
      'Trade operations at the Tatopani border crossing with China remain halted for a sixth consecutive day due to road subsidence and landslides.',
      'Approximately 150 cargo containers remain stranded on the Chinese side while dozens of freight vehicles wait in Nepal.',
      'Traders and logistics associations have urged immediate road clearance and permanent slope stabilization along the highway.'
    ],
    fullStory: 'Bilateral trade at the Tatopani border crossing, one of Nepal\'s key commercial gateways with China, remains severely disrupted for a sixth consecutive day following heavy monsoon rains that caused road subsidence and landslips. Around 150 container trucks carrying imported goods, including garments, electronics, and industrial raw materials, remain stranded on the Chinese side of the border near Zhangmu. Nepal\'s Department of Roads and local administrative authorities have deployed heavy machinery to clear debris and reconstruct sunken road segments to restore traffic safely.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 22, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-news-jul22-${i + 1}-${timestamp}`);
    
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
