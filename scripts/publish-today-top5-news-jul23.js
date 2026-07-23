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
    category: 'sports',
    title: 'Nepal Faces Netherlands in Crucial ICC World Cup League 2 Tri-Series Clash in Utrecht',
    date: '2026-07-23',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      'Nepal plays hosts Netherlands today in Utrecht for their second match of the ICC Men\'s Cricket World Cup League 2 tri-series.',
      'Following an opening 8-wicket defeat against Namibia, Nepal aims to register their first points to bolster 2027 CWC qualification hopes.',
      'Meanwhile, Nepal\'s national volleyball team narrowly lost 3-2 to Kazakhstan in their CAVA Championship opener in Islamabad.'
    ],
    fullStory: 'The Nepali national cricket team takes on hosts Netherlands today at Utrecht in a critical fixture of the ICC Men\'s Cricket World Cup League 2 tri-series. Coming off an eight-wicket loss to Namibia in their opening match, skipper Rohit Paudel and his squad are under pressure to bounce back and keep their direct 2027 Cricket World Cup qualification ambitions intact. Concurrently, Nepal\'s national men\'s volleyball team fought hard in Islamabad, pushing Kazakhstan to five sets before falling 3-2 in their CAVA Championship opener.'
  },
  {
    category: 'news',
    title: 'Heavy Monsoon Rains Trigger Landslides across Five Provinces, Blocking Key National Highways',
    date: '2026-07-23',
    author: 'SurkhetTimes National Desk',
    facts: [
      'Persistent heavy rainfall has damaged infrastructure and blocked major highways across Koshi, Gandaki, Karnali, and Sudurpashchim.',
      'Severe disruptions reported on Arniko Highway and BP Highway, leading authorities to ban night travel on vulnerable mountain corridors.',
      'Disaster response units remain on high alert as river levels near safety thresholds.'
    ],
    fullStory: 'Incessant monsoon rains across Nepal have triggered widespread landslides and flash floods, interrupting arterial highway networks in five provinces including Koshi, Gandaki, Karnali, and Sudurpashchim. Crucial transport corridors such as the Arniko Highway and BP Highway suffer blockages from heavy debris, prompting traffic police and local administration to restrict night vehicle movement along high-risk routes like Kanti Lokpath. Emergency road maintenance crews and disaster management teams are deployed to restore traffic flow while monitoring rising river levels across central and western basins.'
  },
  {
    category: 'business',
    title: 'Nepal Power Exports Surge 68% as Net Trade Surplus Exceeds Rs 18.76 Billion',
    date: '2026-07-23',
    author: 'SurkhetTimes Business Bureau',
    facts: [
      'Nepal Electricity Authority (NEA) recorded a 68% surge in electricity exports to India, generating over Rs 18.76 billion surplus.',
      'NEA introduced a new four-tier operational framework to streamline 218 delayed private hydropower projects.',
      'Surplus seasonal hydropower generation has transformed Nepal into a net energy exporter in South Asia.'
    ],
    fullStory: 'Nepal\'s electricity sector achieved a major financial milestone as clean energy exports to India surged by 68 percent, pushing net energy trade surplus past Rs 18.76 billion. The Nepal Electricity Authority (NEA) attributed the impressive growth to expanded cross-border transmission lines and enhanced monsoon generation capacity. To maintain momentum and address commercial delays, NEA also unveiled a four-tier policy framework easing Required Commercial Operation Date (RCOD) extensions for 218 lagging private hydroelectric developments.'
  },
  {
    category: 'politics',
    title: 'Nepal Formally Protests Saudi Skill Certification Requirement for Migrant Workers',
    date: '2026-07-23',
    author: 'SurkhetTimes Diplomatic Bureau',
    facts: [
      'Ministry of Foreign Affairs lodged formal objections against Saudi Arabia\'s unilateral skill verification mandate for Nepali labor.',
      'Officials argue the uncoordinated testing policy adds excessive financial burden and procedural delays on outbound workers.',
      'Nepal requests bilateral consultations to align skill standardizations with existing labor agreements.'
    ],
    fullStory: 'The Government of Nepal has officially expressed strong reservations to Saudi Arabian authorities regarding the unilateral introduction of a mandatory skill certification program for departing Nepali migrant workers. Nepalese diplomatic representatives highlighted that the new requirement imposes unwarranted financial costs and bureaucratic delays on foreign employment seekers without prior bilateral protocol consensus. Kathmandu has called for immediate bilateral negotiations to synchronize occupational testing standards with current labor framework agreements between the two nations.'
  },
  {
    category: 'agriculture',
    title: 'Severe Fertiliser Shortage Grips Tarai Farmers Amid Peak Paddy Transplanting Season',
    date: '2026-07-23',
    author: 'SurkhetTimes Agriculture Desk',
    facts: [
      'Agricultural communities across the Tarai belt face critical shortages of chemical fertilizers (Urea and DAP) during paddy planting.',
      'Delay in government procurement and distribution centers has forced farmers to seek costly informal imports.',
      'Agricultural experts warn that prolonged supply deficits will reduce seasonal crop yields and hit agrarian livelihoods.'
    ],
    fullStory: 'Thousands of agrarian households across Nepal\'s southern Tarai grain belt are battling an acute crisis of essential chemical fertilizers—primarily Urea and DAP—right at the peak of the monsoon paddy transplanting season. Delays in institutional supply chains operated by state distribution enterprises have left cooperatives empty-handed, forcing desperate farmers to procure unverified fertilizers across border points at inflated rates. Local agricultural extension officers caution that delayed fertilization will adversely impact crop yield forecasts and threaten regional food security.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 23, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);

    const imageAssetId = await uploadImage(`nepal-news-jul23-top5-${i + 1}-${timestamp}`);

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
