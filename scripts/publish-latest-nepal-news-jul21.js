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
    title: 'Government Freezes Civil Service Hiring for FY 2026/27 to Rationalize Public Service',
    date: '2026-07-21',
    author: 'SurkhetTimes Political Desk',
    facts: [
      'The Nepal Government has suspended all new civil service recruitments for the current fiscal year to control state administrative spending.',
      'The decision was made in a meeting of ministry secretaries led by Chief Secretary Govinda Bahadur Karki.',
      'Government departments are barred from filling permanent vacancies or sending requests to the Public Service Commission (PSC) without OPCM approval.'
    ],
    fullStory: 'In a major administrative policy decision, the Government of Nepal has officially halted all new recruitment into the civil service for the current fiscal year. The directive was issued following a high-level meeting of ministry secretaries chaired by Chief Secretary Govinda Bahadur Karki. Under the new guidelines, government agencies and ministries are prohibited from hiring permanent personnel or requesting the Public Service Commission (PSC) to conduct recruitment exams without explicit prior authorization from the Office of the Prime Minister and Council of Ministers (OPCM).'
  },
  {
    category: 'business',
    title: 'Central Bank Reform Bill Advances in Parliament as Development Budget Spending Drops to 46.79%',
    date: '2026-07-21',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'Parliamentary review of the Nepal Rastra Bank Act Amendment Bill has commenced to modernize central bank regulatory frameworks.',
      'Capital expenditure for the 2025/26 fiscal year dropped to a decade low of 46.79% of the allocated budget.',
      'Discussions continue with the IMF on a potential successor policy framework following the conclusion of the Extended Credit Facility (ECF).'
    ],
    fullStory: 'Financial sector reforms picked up momentum in Kathmandu as the House of Representatives\' Finance Committee began reviewing the proposed Nepal Rastra Bank Act Amendment Bill. The legislative effort aims to enhance central bank independence, strengthen financial institution oversight, and align monetary regulation with international standards. Meanwhile, annual economic data revealed that capital expenditure reached just 46.79% for the 2025/26 fiscal year—its lowest level in ten years outside pandemic lockdowns—highlighting the necessity for structural spending efficiency and project execution improvements.'
  },
  {
    category: 'news',
    title: 'Draft Bill Introduced to Split CAAN into Separate Aviation Regulator and Airport Operations Service Bodies',
    date: '2026-07-21',
    author: 'SurkhetTimes Civil Aviation Desk',
    facts: [
      'Draft legislation presented in parliament proposes dividing the Civil Aviation Authority of Nepal (CAAN) into two separate entity types.',
      'The reform separates regulatory aviation safety oversight from commercial airport management and air navigation services.',
      'The restructuring aligns with International Civil Aviation Organization (ICAO) guidelines to help remove Nepal from the EU air safety blacklist.'
    ],
    fullStory: 'Nepal\'s aviation industry reached a key legislative threshold with new draft bills presented to split the Civil Aviation Authority of Nepal (CAAN) into autonomous regulatory and service operations organizations. The proposed division resolves long-standing conflicts of interest by separating safety regulation from airport administration and ground navigation services. Aligned with International Civil Aviation Organization (ICAO) standards, the reform is expected to significantly improve safety compliance and support efforts to remove Nepalese airlines from the European Union\'s air safety restriction list.'
  },
  {
    category: 'news',
    title: 'Land Commission Issues Final 35-Day Notice for Settlers in Banke, Jajarkot, and Dolpa',
    date: '2026-07-21',
    author: 'SurkhetTimes Regional Desk',
    facts: [
      'The National Land Commission published a 35-day final notice for landless squatters and unorganized settlers to submit claims.',
      'Target regions include municipalities and rural areas across Banke, Jajarkot, and Dolpa districts.',
      'Verified applicants will be granted official land tenure certificates to formalize land ownership.'
    ],
    fullStory: 'In an effort to resolve persistent landlessness across mid-western Nepal, the National Land Commission has announced a final 35-day application window for unorganized settlers and landless households. The initiative focuses on targeted local units in Banke, Jajarkot, and Dolpa districts where informal settlements are prevalent. Municipal committees and field surveyors will conduct verification to grant land ownership certificates, providing legal security and integration into local tax and agricultural credit systems.'
  },
  {
    category: 'news',
    title: 'Nepal Ranked 111th in 2026 Global Peace Index Amid Institutional Governance Challenges',
    date: '2026-07-21',
    author: 'SurkhetTimes Policy Desk',
    facts: [
      'Nepal dropped 26 places to rank 111th among 163 countries in the 2026 Global Peace Index (GPI) report.',
      'The Institute for Economics and Peace cited political instability and reduced public trust in state institutions as main factors.',
      'Despite internal scores, Nepal maintains low external conflict metrics and stable international peacekeeping contributions.'
    ],
    fullStory: 'Nepal registered a decline in peacefulness according to the newly released 2026 Global Peace Index (GPI) published by the Institute for Economics and Peace (IEP). Tumbling 26 spots to 111th worldwide, the country\'s index reflected heightened internal political friction and governance challenges. While Nepal continues to score favorably in external security and international peacekeeping engagements, researchers emphasized that rebuilding public trust, strengthening institutional transparency, and fostering constructive civic dialogue will be essential to restoring national social cohesion.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 21, 2026)...');
  const docsToCreate = [];

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);
    
    const imageAssetId = await uploadImage(`nepal-latest-news-${i + 1}-${Date.now()}`);
    
    const slugCurrent = story.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now()}`;

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
