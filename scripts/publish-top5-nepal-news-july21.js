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
      'Prime Minister Balendra Shah announced that the government has decided not to implement the 3% equity fee on private education and health sectors.',
      'The tax, introduced in the proposed 2026/27 budget, had sparked widespread protests from private school and hospital operators.',
      'The government stated the decision aims to prevent increased cost burdens on students, patients, and the general public.'
    ],
    fullStory: 'In a major policy reversal, Prime Minister Balendra Shah announced on Tuesday that the government has decided to withdraw the proposed 3% equity fee on private education and health institutions. The tax had been introduced as part of the 2026/27 fiscal budget, drawing intense criticism and joint protests from private school associations and private hospital operators across Nepal. Stakeholders argued that the additional tax would inevitably be passed down to citizens, making healthcare and quality education significantly more expensive. PM Shah stated that after evaluating public feedback and conducting reviews with financial officials, the executive branch decided to cancel the fee implementation to protect citizens from compounding inflation and rising living expenses.'
  },
  {
    category: 'agriculture',
    title: 'FAO Director Meets Nepal Agriculture Minister to Advance Food Security and Climate Resilience',
    date: '2026-07-21',
    author: 'SurkhetTimes Agriculture Desk',
    facts: [
      'Hua Yang, Director of FAO\'s South-South & Triangular Cooperation Division, met Nepal Agriculture Minister Gita Chaudhary in Kathmandu.',
      'Discussions focused on food security, climate-smart agricultural techniques, and controlling cross-border livestock diseases.',
      'Both sides agreed to expand technical assistance and sustainable farming models for smallholder farmers.'
    ],
    fullStory: 'Director of the Food and Agriculture Organization (FAO) South-South and Triangular Cooperation Division, Hua Yang, held a high-level meeting with Nepal\'s Minister for Agriculture, Forests and Environment, Gita Chaudhary, in Kathmandu on Tuesday. The bilateral talks centered on bolstering national food security, accelerating agricultural modernization, and introducing climate-resilient farming techniques across vulnerable rural districts. Minister Chaudhary highlighted the growing impact of unpredictable monsoon patterns on Nepalese crop yields and called for increased international technical collaboration. Both parties committed to joint frameworks aimed at enhancing livestock health monitoring and supporting smallholder farmers with sustainable agricultural tools.'
  },
  {
    category: 'business',
    title: 'Nepal Layers Poultry Farmers Association Hikes Egg Retail Prices to Rs 25 Per Unit',
    date: '2026-07-21',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'The Nepal Layers Poultry Farmers Association raised the recommended retail price of eggs to Rs 25 per unit.',
      'This marks the second price adjustment within four days across commercial poultry markets in Nepal.',
      'Poultry producers cited rising feed production costs, supply chain bottlenecks, and increased transport expenses.'
    ],
    fullStory: 'The Nepal Layers Poultry Farmers Association has announced another increase in egg prices, setting the recommended retail rate at Rs 25 per egg. This decision marks the second price adjustment in just four days, reflecting growing cost pressures within Nepal\'s commercial poultry sector. Association representatives attributed the price hike to skyrocketing costs of essential poultry feed ingredients, elevated transportation expenses, and seasonal supply fluctuations. Retailers across urban markets in Kathmandu, Pokhara, and Nepalgunj have already begun updating prices, raising concerns among consumers about rising food inflation.'
  },
  {
    category: 'sports',
    title: 'Nepal Cricket Team Clash with Namibia in ICC World Cup League 2 Tri-Series in Netherlands',
    date: '2026-07-21',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      'Nepal faced Namibia at Sportpark Marschalkerweerd in Utrecht, Netherlands as part of the ICC Men\'s Cricket World Cup League 2.',
      'Captain Rohit Paudel led a strong squad featuring Dipendra Singh Airee, Kushal Bhurtel, and Sandeep Lamichhane.',
      'The tri-series matches are vital for securing direct qualification standings for the 2027 ICC Men\'s Cricket World Cup.'
    ],
    fullStory: 'Nepal\'s national cricket team took to the field against Namibia on Tuesday at Sportpark Marschalkerweerd in Utrecht, Netherlands, marking a critical fixture in their ICC Men\'s Cricket World Cup League 2 campaign. Led by skipper Rohit Paudel, the Nepalese squad is competing in a high-stakes One-Day International (ODI) tri-series alongside hosts Netherlands and Namibia. With Nepal currently pushing to climb higher in the League 2 standings, every victory in this series is essential for keeping their qualification pathway for the 2027 ICC Cricket World Cup on track. Head coach and team officials expressed confidence in the squad\'s form following rigorous practice sessions in European conditions.'
  },
  {
    category: 'news',
    title: 'MetLife Foundation Awards $120,000 Grant to WWF Nepal for Climate Resilience in Bardiya',
    date: '2026-07-21',
    author: 'SurkhetTimes Climate Desk',
    facts: [
      'MetLife Foundation awarded a $120,000 grant to WWF Nepal for the JEEWAN climate resilience initiative.',
      'The project focuses on nature-based solutions like bio-dykes to protect agricultural land along the Lower Karnali River.',
      'Over 2,500 local households in Bardiya District will benefit from sustainable riverbank protection and livelihood support.'
    ],
    fullStory: 'The MetLife Foundation has announced a $120,000 grant to WWF Nepal to launch the \'JEEWAN\' project, designed to enhance climate resilience and protect vulnerable rural communities along the Lower Karnali River basin in Bardiya District. The initiative focuses on deploying nature-based infrastructure, such as bio-dykes and riverbank vegetation barriers, to shield farmland and homes from recurrent monsoon flooding and soil erosion. Additionally, the project will provide alternative green livelihood opportunities for over 2,500 marginalized households, reinforcing community disaster preparedness and ecological conservation efforts in western Nepal.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 21, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-top5-news-${i + 1}-${timestamp}`);
    
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
