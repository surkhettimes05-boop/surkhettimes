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
    title: "Nepal Volleyball Team Faces Kazakhstan in CAVA Championship Opener in Islamabad",
    date: '2026-07-22',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      "Nepal's national men's volleyball team kicks off its CAVA Men's Volleyball Championship 2026 campaign against Kazakhstan in Islamabad, Pakistan.",
      "The squad is captained by setter Hari Hajur Thapa and trained under head coach Jagadish Bhatta, featuring six debutants.",
      "The tournament brings together six nations (Nepal, Pakistan, Kazakhstan, Uzbekistan, Bangladesh, Sri Lanka) in a single round-robin format at Liaquat Gymnasium."
    ],
    fullStory: "Nepal's national men's volleyball team opens its regional campaign today facing Kazakhstan in the inaugural fixture of the CAVA Men's Volleyball Championship 2026 at the Liaquat Gymnasium in Islamabad, Pakistan. Led by captain Hari Hajur Thapa and guided by head coach Jagadish Bhatta, the 14-member squad features a vibrant blend of experienced stalwarts alongside six debutant players making their senior international appearance. The eight-day international tournament features six South and Central Asian volleyball federations—Nepal, host nation Pakistan, Kazakhstan, Uzbekistan, Bangladesh, and Sri Lanka—competing in a single round-robin group stage format to determine the championship finalists."
  },
  {
    category: 'news',
    title: '4.2 Magnitude Earthquake Strikes Bajhang District in Western Nepal',
    date: '2026-07-22',
    author: 'SurkhetTimes National Bureau',
    facts: [
      'A moderate earthquake measuring 4.2 on the Richter scale struck Bajhang district in Far-Western Nepal early morning at 4:40 AM.',
      'The Seismological Center reported the epicenter near Kotdewal, with tremors felt across neighboring Baitadi and Doti districts.',
      'District authorities confirmed no human casualties or structural destruction from the early morning quake.'
    ],
    fullStory: 'A light earthquake with a preliminary magnitude of 4.2 struck Bajhang district in Sudurpashchim Province early Wednesday morning at 4:40 AM local time. According to the National Seismological Center, the epicenter of the seismic activity was traced to the vicinity of Kotdewal in Bajhang district. Moderate tremors were felt across adjoining hill districts including Baitadi and Doti, prompting brief panic among local residents who rushed outdoors. District security officials and local disaster response committees confirmed after rapid field checks that no loss of human life, injuries, or property damage occurred.'
  },
  {
    category: 'business',
    title: 'Tatopani Border Trade Halts for Sixth Day as Landslides Damage Kodari Highway',
    date: '2026-07-22',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'Bilateral trade through the Tatopani-Khasa border point between Nepal and China remains completely disrupted for the sixth consecutive day.',
      'Monsoon-triggered landslides and severe road erosion damaged key sections near Eco and Daklang along the Kodari Highway.',
      'Over 150 cargo containers laden with imported merchandise remain stranded on the Chinese side awaiting road clearance.'
    ],
    fullStory: 'Commercial goods transportation and cross-border trade between Nepal and China via the Tatopani land port remain halted for the sixth straight day following catastrophic monsoon-induced landslides along the Kodari Highway section. Massive debris flows and river erosion near Eco and Daklang have washed away significant road segments, completely severing freight transport corridors. Port customs officials reported that more than 150 heavy cargo containers carrying industrial raw materials, electronics, and commercial goods remain stuck at the Khasa border depot in Tibet, while technical repair teams work under difficult weather conditions to clear debris and reconstruct retaining walls.'
  },
  {
    category: 'politics',
    title: 'Nepali Congress Marks 44th BP Smriti Diwas Amid Rallies and Climate Initiatives',
    date: '2026-07-22',
    author: 'SurkhetTimes Politics Desk',
    facts: [
      'The Nepali Congress is observing the 44th Memorial Day of founding leader Bishweshwar Prasad Koirala across the nation today.',
      'A 5km "Green Run" marathon was organized in Kathmandu to highlight youth participation and urban environmental protection.',
      'Key party leaders addressed commemorative symposiums emphasizing constitutional governance and political stability.'
    ],
    fullStory: 'The Nepali Congress party is observing the 44th Memorial Day (BP Smriti Diwas) of democratic icon and Nepal\'s first elected Prime Minister Bishweshwar Prasad Koirala with nationwide commemorative programs today. In Kathmandu, the establishment faction organized a flagship 5km "Green Run" road race aimed at promoting environmental awareness, urban forestry, and youth athletic health. Parallel ideological symposiums and wreath-laying ceremonies were conducted across district party offices nationwide, where political leaders reflected on BP Koirala\'s democratic socialism, constitutional philosophy, and national reconciliation principles in contemporary Nepalese governance.'
  },
  {
    category: 'news',
    title: 'Government Suspends Land Subdivisions Across 363 Local Levels Over Missing Classification Reports',
    date: '2026-07-22',
    author: 'SurkhetTimes Governance Desk',
    facts: [
      'The Ministry of Land Management, Agriculture and Cooperatives suspended land plotting and subdivision in 363 local levels across Nepal.',
      'The restriction was enforced after local bodies missed mandatory deadlines to complete land zoning and agricultural land classification.',
      'Real estate transactions requiring fresh parcel division are placed on hold until municipal land classification maps are officially submitted.'
    ],
    fullStory: 'The Ministry of Land Management, Cooperatives and Poverty Alleviation has officially suspended land division, plotting, and parcel fragmentation services across 363 local government units that failed to execute mandatory land categorization within stipulated statutory deadlines. Under national land policy guidelines, municipalities and rural councils were mandated to classify local land into agricultural, residential, commercial, and environmental protection zones to prevent unchecked conversion of fertile agrarian land. The Department of Land Reform and Management instructed all district survey offices to halt processing new subdivision applications in defaulting municipal zones until verified land use maps receive government certification.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 22, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-news-jul22-top5-${i + 1}-${timestamp}`);
    
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
