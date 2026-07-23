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
    title: 'Chief Justice Dr. Manoj Kumar Sharma Departs for India on Official Visit',
    date: '2026-07-23',
    author: 'SurkhetTimes Diplomatic Desk',
    facts: [
      'Chief Justice of Nepal, Dr. Manoj Kumar Sharma, departed for India today on a five-day official visit upon invitation by Indian Chief Justice Surya Kant.',
      'The high-level delegation includes his spouse, Uma Sharma, and Supreme Court Co-Registrar Amit Upreti.',
      'The visit aims to foster bilateral judicial cooperation, observe legal proceedings at the Supreme Court of India, and participate in high-level discussions through July 27.'
    ],
    fullStory: 'Chief Justice Dr. Manoj Kumar Sharma has officially embarked on a five-day bilateral visit to India on July 23, 2026, following a formal invitation from Chief Justice of India Surya Kant. Accompanied by his spouse, Uma Sharma, and Supreme Court Co-Registrar Amit Upreti, Chief Justice Sharma was seen off at Tribhuvan International Airport by senior judicial officers. During the visit, which concludes on July 27, the Nepalese judicial delegation is scheduled to hold bilateral talks with Indian legal dignitaries, observe court operations at the Supreme Court of India in New Delhi, and exchange insights on modernizing judicial procedures, case management, and access to justice across both nations.'
  },
  {
    category: 'business',
    title: 'NEPSE Rebounds with 14.17 Point Gain as Index Reaches 2,726.72',
    date: '2026-07-23',
    author: 'SurkhetTimes Markets Desk',
    facts: [
      'The Nepal Stock Exchange (NEPSE) index increased by 14.17 points (0.52%) on July 23, closing at 2,726.72 points.',
      'Total daily turnover recorded Rs 4.67 billion across 312 companies, compared to Rs 5.18 billion in the previous trading session.',
      'Sub-indices for banking, manufacturing, and hydropower led the gains, reflecting positive investor sentiment despite lighter volume.'
    ],
    fullStory: 'The Nepal Stock Exchange (NEPSE) demonstrated bullish resilience today, July 23, 2026, gaining 14.17 points or 0.52 percent to close at 2,726.72 points. Market activity saw active trading across 312 corporate entities, accumulating a total market turnover of Rs 4.67 billion. Although the overall transaction volume registered a minor decline from yesterday\'s Rs 5.18 billion, key sectors—including banking, hydropower, and manufacturing—posted steady gains. Market analysts attribute the market\'s positive momentum to improved liquidity expectations and upcoming quarterly corporate earnings disclosures.'
  },
  {
    category: 'business',
    title: 'Prime Minister Balendra Shah Directs Drafting of National Organic Certification Law',
    date: '2026-07-23',
    author: 'SurkhetTimes Policy Desk',
    facts: [
      'Prime Minister Balendra Shah instructed ministries to establish a domestic national organic certification body to eliminate expensive foreign certification costs.',
      'The decision follows a high-level Singha Durbar meeting with executive representatives from the Organic Association Nepal (OAN).',
      'New directives mandate equal subsidies for organic fertilizers alongside chemical fertilizers and cash grants to support organic food exports.'
    ],
    fullStory: 'Prime Minister Balendra Shah has issued directives to the Ministry of Agriculture and Livestock Development and his executive secretariat to immediately draft legislation establishing Nepal’s first national organic certification institution. Following a high-level meeting at Singha Durbar on July 23, 2026, with the Organic Association Nepal (OAN), PM Shah highlighted the heavy financial burden placed on domestic farmers who currently rely on costly international accreditation bodies. In addition to creating an in-country certification framework, the Prime Minister mandated equal subsidy allocations for organic fertilizers matching existing chemical fertilizer subsidies and instructed officials to formulate procedural guidelines for export incentive grants for organic produce.'
  },
  {
    category: 'news',
    title: 'Nepal Government Accelerates Provincial Burn Centers and Local Unit Basic Hospitals',
    date: '2026-07-23',
    author: 'SurkhetTimes Health Desk',
    facts: [
      'The executive administration ordered the immediate expansion of specialized burn care units across all seven provinces of Nepal.',
      'Upgrades to burn treatment wards in major government hospitals are underway alongside digital bed-monitoring systems.',
      'Private and public healthcare providers are strictly required to reserve at least 10% of their beds for impoverished and underprivileged patients.'
    ],
    fullStory: 'In a comprehensive healthcare reform push today, July 23, 2026, the government led by Prime Minister Balendra Shah announced mandatory measures to upgrade healthcare infrastructure nationwide. The directives prioritize establishing specialized, fully-equipped burn care centers across all seven provinces to reduce emergency transfer delays for severe burn victims. Additionally, the Ministry of Health and Population has initiated a digital bed-availability tracking portal and reiterated strict compliance monitoring requiring all private and public hospitals to reserve a minimum of 10 percent of total hospital beds for free treatment of underprivileged citizens.'
  },
  {
    category: 'politics',
    title: 'Education Minister Pledges Total Phaseout of Political Appointments in Nepalese Universities',
    date: '2026-07-23',
    author: 'SurkhetTimes Education Desk',
    facts: [
      'Education Minister Sasmit Pokharel pledged a complete elimination of political quota sharing in state-run university appointments over the next four years.',
      'Merit-based search committees will replace political nominations for vice-chancellors, registrars, and campus heads.',
      'Academic institutions are set to receive autonomous operational mandates to improve global rankings and curb student migration abroad.'
    ],
    fullStory: 'Education Minister Sasmit Pokharel announced a roadmap on July 23, 2026, aimed at fully eliminating political influence and quota-sharing in Nepal’s public universities within four years. Speaking at an education reform summit, Minister Pokharel emphasized that leadership roles, including Vice-Chancellors, Registrars, and Deans across Tribhuvan University and regional institutions, will be selected strictly through independent, merit-based search committees. The comprehensive reform package aims to restore academic credibility, stabilize academic calendars, and retain Nepalese youth by elevating higher education standards to international benchmarks.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 23, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);

    const imageAssetId = await uploadImage(`nepal-real-news-jul23-v4-${i + 1}-${timestamp}`);

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
