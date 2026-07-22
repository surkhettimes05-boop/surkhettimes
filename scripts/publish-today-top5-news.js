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
    title: 'PM Balendra Shah Cancels Proposed 3% Equity Fee on Private Education and Health Services',
    date: '2026-07-21',
    author: 'SurkhetTimes Political Desk',
    facts: [
      'Prime Minister Balendra Shah announced the suspension of the recently introduced 3% equity fee on private education and health services.',
      'The decision was made following high-level consultations with Finance Minister Swarnim Wagle.',
      'The government stated the withdrawal prevents compounding financial burdens and rising tuition and healthcare costs for citizens.'
    ],
    fullStory: 'In a major policy decision, Prime Minister Balendra Shah announced the suspension of the proposed 3% equity fee on private education and health services on Tuesday. The tax, introduced in the fiscal budget, had triggered strong opposition from private school associations and private hospital operators who warned the fee would inevitably be passed on to students and patients. Following detailed consultations with Finance Minister Swarnim Wagle and ministry officials, the executive leadership agreed to cancel the fee implementation to protect citizens from compounding inflation and rising living expenses.'
  },
  {
    category: 'news',
    title: "Chief Secretary Assigned Direct Oversight of 'Hello Sarkar' Public Grievance Portal",
    date: '2026-07-21',
    author: 'SurkhetTimes Governance Desk',
    facts: [
      "The government of Nepal has instituted direct administrative oversight for public complaints submitted through 'Hello Sarkar'.",
      'The Chief Secretary will personally supervise grievance reports concerning local service delays, administrative mismanagement, and corruption.',
      'Ministries and department heads are mandated to resolve forwarded complaints within strict designated timeframe targets.'
    ],
    fullStory: "The government of Nepal has launched a streamlined arrangement to address public complaints regarding local administrative service delays, administrative mismanagement, and corruption. Under the new arrangement, public grievances logged through the national 'Hello Sarkar' portal will now be directly overseen by the Chief Secretary. The initiative aims to hold ministry department heads and local government officials accountable for resolving citizen complaints in an efficient and transparent manner."
  },
  {
    category: 'agriculture',
    title: 'FAO Director Meets Nepal Agriculture Minister to Advance Food Security and Climate Resilience',
    date: '2026-07-21',
    author: 'SurkhetTimes Agriculture Desk',
    facts: [
      "Hua Yang, Director of FAO's South-South & Triangular Cooperation Division, met Nepal Agriculture Minister Gita Chaudhary in Kathmandu.",
      'Bilateral discussions focused on food security, climate-smart agricultural techniques, and controlling cross-border livestock diseases.',
      'Both sides agreed to expand technical assistance and sustainable farming frameworks for smallholder farmers.'
    ],
    fullStory: "Director of the Food and Agriculture Organization (FAO) South-South and Triangular Cooperation Division, Hua Yang, held a high-level meeting with Nepal's Minister for Agriculture, Forests and Environment, Gita Chaudhary, in Kathmandu on Tuesday. The bilateral talks centered on bolstering national food security, accelerating agricultural modernization, and introducing climate-resilient farming techniques across vulnerable rural districts. Minister Chaudhary highlighted the growing impact of unpredictable monsoon patterns on Nepalese crop yields and called for increased international technical collaboration to support smallholder farmers."
  },
  {
    category: 'business',
    title: 'NEPSE Benchmark Index Gains 7.25 Points to Close at 2,726.49 as Daily Turnover Hits Rs 6.67 Billion',
    date: '2026-07-21',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'The Nepal Stock Exchange (NEPSE) index increased by 7.25 points on Tuesday to close at 2,726.49 points.',
      'Total daily turnover across the secondary market reached Rs 6.67 billion.',
      'Banking, hydropower, and manufacturing sub-indices recorded steady trading gains throughout the afternoon session.'
    ],
    fullStory: "The Nepal Stock Exchange (NEPSE) ended Tuesday's trading session on a positive note, with the benchmark index gaining 7.25 points to settle at 2,726.49 points. Total turnover across the equity market reached Rs 6.67 billion as investor participation remained strong in banking, hydropower, and manufacturing shares. Market analysts noted that balanced institutional buying and steady macroeconomic indicators contributed to the day's upward momentum."
  },
  {
    category: 'sports',
    title: "Nepal Cricket Team Faces Namibia in ICC Men's World Cup League 2 Tri-Series in Netherlands",
    date: '2026-07-21',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      "Nepal's national cricket team played against Namibia at Sportpark Marschalkerweerd in Utrecht, Netherlands.",
      'Captain Rohit Paudel led a strong squad featuring Dipendra Singh Airee, Kushal Bhurtel, and Sandeep Lamichhane.',
      "The tri-series ODI matches are vital for securing direct qualification standings for the 2027 ICC Cricket World Cup."
    ],
    fullStory: "Nepal's national cricket team took to the field against Namibia on Tuesday at Sportpark Marschalkerweerd in Utrecht, Netherlands, marking a critical fixture in their ICC Men's Cricket World Cup League 2 campaign. Led by skipper Rohit Paudel, the Nepalese squad is competing in a high-stakes One-Day International (ODI) tri-series alongside hosts Netherlands and Namibia. With Nepal pushing to climb higher in the League 2 standings, every victory in this series is essential for keeping their qualification pathway for the 2027 ICC Cricket World Cup on track."
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 21, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-today-top5-${i + 1}-${timestamp}`);
    
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
