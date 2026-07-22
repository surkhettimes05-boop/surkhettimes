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
    title: 'PM Balendra Shah Cancels Proposed 3% Equity Fee on Private Schools and Hospitals',
    date: '2026-07-21',
    author: 'SurkhetTimes Political Desk',
    facts: [
      'Prime Minister Balendra Shah announced that the government has decided to withdraw the 3% equity fee proposed in the 2026/27 budget on private education and health sectors.',
      'The decision followed consultations with Finance Minister Swarnim Wagle and intense opposition from private school and hospital associations.',
      'The government stated that the fee cancellation aims to prevent added inflationary burdens on students, healthcare patients, and families across Nepal.'
    ],
    fullStory: 'In a major policy decision, Prime Minister Balendra Shah announced on Tuesday that the government has officially withdrawn the proposed 3 percent equity fee on private education and health institutions. The tax, which was initially introduced in the 2026/27 fiscal budget, had triggered widespread concern and joint protests from private school operators, medical organizations, and consumer rights advocates across Nepal. Opponents argued that the levy would directly translate into higher tuition fees and medical expenses for ordinary citizens. Following high-level consultations with Finance Minister Swarnim Wagle and financial experts, PM Shah stated that the executive branch decided to scrap the tax to cushion households against compounding living costs and preserve access to private social services.'
  },
  {
    category: 'business',
    title: 'Finance Ministry Issues Strict Austerity Directives to Restrain Public Expenditure',
    date: '2026-07-21',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'The Ministry of Finance issued a nationwide austerity directive mandating strict spending limits across all state departments and public enterprises.',
      'Under the new rules, government offices must receive prior approval from the Finance Ministry before purchasing new vehicles or organizing international official travel.',
      'Public agencies have been instructed to optimize state-owned real estate and facilities rather than renting expensive commercial buildings.'
    ],
    fullStory: "Nepal's Ministry of Finance has introduced a comprehensive set of austerity guidelines aimed at curbing unnecessary public spending and promoting financial fiscal discipline across government agencies. Effective immediately, state departments and public sector enterprises are prohibited from procuring new executive vehicles or authorizing foreign study tours and official delegations without prior authorization from the Finance Ministry. Furthermore, the directive instructs all government organizations to prioritize utilizing existing state-owned buildings and public facilities for office space and conferences, drastically reducing rental expenses paid to commercial real estate developers in urban centers like Kathmandu."
  },
  {
    category: 'agriculture',
    title: 'FAO Director and Agriculture Minister Meet to Advance Climate Resilience and Food Security in Nepal',
    date: '2026-07-21',
    author: 'SurkhetTimes Agriculture Desk',
    facts: [
      "Hua Yang, Director of FAO's South-South & Triangular Cooperation Division, met with Agriculture Minister Gita Chaudhary in Kathmandu.",
      'The bilateral meeting focused on advancing climate-smart agricultural techniques, strengthening food security, and controlling cross-border livestock diseases.',
      'Both parties agreed to scale up technical assistance programs and sustainable farming tools for smallholder farmers across rural Nepal.'
    ],
    fullStory: "Director of the Food and Agriculture Organization (FAO) South-South and Triangular Cooperation Division, Hua Yang, met with Nepal's Minister for Agriculture, Forests and Environment, Gita Chaudhary, in Kathmandu on Tuesday to discuss strategic agricultural partnerships. The talks focused on enhancing national food security, deploying climate-smart farming solutions to mitigate erratic monsoon rainfall patterns, and improving disease surveillance for livestock along border corridors. Minister Chaudhary emphasized the urgent need for modernized technical tools for rural smallholders, while the FAO delegation pledged expanded technical support and knowledge-sharing frameworks tailored to Nepal's diverse agricultural topography."
  },
  {
    category: 'sports',
    title: "Nepali Congress Organizes 5km 'Green Run' in Kathmandu for Climate Action on BP Smriti Diwas",
    date: '2026-07-21',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      'A 5km "Green Run" road race was held in Kathmandu to mark BP Smriti Diwas and promote climate awareness.',
      'Hundreds of youth athletes, sports enthusiasts, and party leaders participated, starting from Sanepa and finishing at Durbar Marg.',
      'The event highlighted urban greening, reducing carbon footprints, and promoting health and physical fitness among Nepalese youth.'
    ],
    fullStory: 'Hundreds of runners, youth sports enthusiasts, and political leaders gathered in Kathmandu on Tuesday morning to participate in a 5km \'Green Run\' held to commemorate BP Smriti Diwas. Organized to blend athletic participation with environmental advocacy, the road race took runners through major urban corridors from Sanepa to Durbar Marg. Participants carried messages promoting urban afforestation, plastic waste reduction, and proactive climate policy. Event organizers emphasized that combining physical fitness with environmental awareness serves as a powerful medium to rally young Nepalese behind national sustainability goals and healthy lifestyles.'
  },
  {
    category: 'news',
    title: "Government Revamps 'Hello Sarkar' Portal with Direct Oversight by Chief Secretary to Resolve Grievances",
    date: '2026-07-21',
    author: 'SurkhetTimes News Desk',
    facts: [
      'The Office of the Prime Minister has revamped the national \'Hello Sarkar\' public grievance hotline and web portal.',
      'All incoming complaints related to service delays, infrastructure contract irregularities, and local corruption will be directly supervised by the Chief Secretary.',
      'The upgraded system introduces automated tracking and mandatory resolution deadlines for government ministries and local administrative offices.'
    ],
    fullStory: 'In an effort to enforce administrative accountability and speed up public service delivery, the Nepalese government has rolled out an upgraded operational model for its flagship grievance portal, \'Hello Sarkar\'. Under the new mechanism, public complaints regarding administrative delays, contractor negligence in infrastructure projects, and local corruption allegations will fall under the direct monitoring of the Office of the Chief Secretary. The updated system incorporates automated tracking tools that assign mandatory response windows to responsible government departments, ensuring that citizens receive timely updates and resolutions to their reported grievances.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 21, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-news-jul21-eve-${i + 1}-${timestamp}`);
    
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
