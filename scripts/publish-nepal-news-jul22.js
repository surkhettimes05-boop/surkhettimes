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
    title: 'Government Suspends All New Civil Service Recruitment for Current Fiscal Year',
    date: '2026-07-22',
    author: 'SurkhetTimes Administrative Desk',
    facts: [
      'The government of Nepal has officially suspended all new civil service recruitment for the current fiscal year to curb public administrative spending.',
      'The decision was made during a high-level meeting of ministry secretaries presided over by Chief Secretary Govinda Bahadur Karki.',
      'No ministry or public office may initiate hiring or submit staff requisitions to the Public Service Commission without prior OPMCM approval.'
    ],
    fullStory: 'In a major administrative move aimed at managing public expenditure and optimizing civil personnel, the Government of Nepal has officially suspended all new civil service recruitment across ministries and state agencies for the current fiscal year. The policy decision was finalized following a high-level conference of government secretaries chaired by Chief Secretary Govinda Bahadur Karki. Under the newly issued operational guidelines, state departments and public sector offices are strictly barred from publishing new recruitment notices or submitting vacancy requisitions to the Public Service Commission (PSC) without obtaining prior explicit authorization from the Office of the Prime Minister and Council of Ministers (OPMCM).'
  },
  {
    category: 'politics',
    title: 'Secretaries Approve Landmark 22-Point Administrative Reform Package',
    date: '2026-07-22',
    author: 'SurkhetTimes Governance Desk',
    facts: [
      'Government secretaries endorsed a comprehensive 22-point reform package to eliminate bureaucratic bottlenecks and modernize public services.',
      'The framework mandates a "one-door service" system across high-volume offices including land revenue, land survey, and transport departments.',
      'An integrated digital public grievance management portal will be rolled out to directly track and resolve citizen complaints with mandatory deadlines.'
    ],
    fullStory: 'Senior government secretaries have formally approved a landmark 22-point administrative reform agreement designed to overhaul Nepal\'s administrative machinery and enhance public service delivery across federal and local institutions. Key initiatives embedded within the decision include establishing a unified "one-door service" model in high-frequency public offices—specifically targeting land revenue offices, survey departments, and transport management centers nationwide. In addition, the reform introduces a centralized digital grievance management system that empowers citizens to track complaint resolutions in real time under strict administrative accountability guidelines.'
  },
  {
    category: 'business',
    title: 'PM Balendra Shah Orders Creation of Textile and Clothing Development Council',
    date: '2026-07-22',
    author: 'SurkhetTimes Business Desk',
    facts: [
      'Prime Minister Balendra Shah directed the establishment of a specialized Textile and Clothing Development Council.',
      'The council will focus on boosting domestic garment manufacturing, substituting costly imported textiles, and simplifying export logistics.',
      'Policy incentives, financial support, and technical assistance will be provided to empower local textile entrepreneurs across Nepal.'
    ],
    fullStory: 'Prime Minister Balendra Shah has issued directives to establish a specialized "Textile and Clothing Development Council" aimed at revitalizing Nepal\'s domestic garment manufacturing sector and reducing reliance on foreign textile imports. Speaking at a strategic consultation with industry stakeholders, PM Shah emphasized that the council will formulate targeted policy incentives, streamline customs and export documentation, and foster technical innovation for domestic garment manufacturers. The initiative seeks to generate local employment opportunities, upgrade manufacturing infrastructure, and position Nepalese apparel competitively in international export markets.'
  },
  {
    category: 'business',
    title: 'Nepal and India Discuss Expanding Hydropower Cooperation and Cross-Border Power Trade',
    date: '2026-07-22',
    author: 'SurkhetTimes Energy Desk',
    facts: [
      'The Independent Power Producers\' Association of Nepal (IPPAN) held high-level talks with Indian Ambassador Naveen Srivastava.',
      'The meeting prioritized expanding cross-border transmission corridors and expediting commercial power sales from Nepal to India.',
      'Both sides reaffirmed commitments to build on the long-term bilateral electricity trade framework established in 2024.'
    ],
    fullStory: 'Delegates from the Independent Power Producers\' Association of Nepal (IPPAN) met with Indian Ambassador to Nepal Naveen Srivastava in Kathmandu to discuss accelerating bilateral hydropower development and cross-border energy trade. The high-level consultation centered on expanding high-voltage cross-border power transmission corridors, addressing regional grid integration challenges, and facilitating smooth commercial energy exports under the 10-year electricity trade agreement between Nepal and India. Both parties underscored the mutual economic and environmental benefits of tapping Nepal\'s clean hydroelectric potential to satisfy South Asia\'s growing energy demand.'
  },
  {
    category: 'sports',
    title: 'Nepali Congress Marks 44th BP Smriti Diwas with Flagship Green Run and Climate Rally',
    date: '2026-07-22',
    author: 'SurkhetTimes Events Desk',
    facts: [
      'The Nepali Congress organized nationwide events to observe the 44th BP Smriti Diwas in memory of leader Bishweshwar Prasad Koirala.',
      'A flagship 5km "Green Run" road race was held in Kathmandu Valley to champion environmental protection and youth athletic participation.',
      'The party announced the creation of a Humanitarian Assistance Fund alongside policy dialogues on climate adaptation and governance.'
    ],
    fullStory: 'Commemorating the 44th Memorial Day of founding leader and former Prime Minister Bishweshwar Prasad Koirala (BP Smriti Diwas), the Nepali Congress hosted a series of nationwide events on Wednesday, anchored by a flagship 5km "Green Run" in the Kathmandu Valley. Hundreds of participants, including youth athletes, environmental advocates, and political leaders, ran through central Kathmandu to highlight urgent climate action, urban afforestation, and public wellness. In tandem with the athletic event, party leadership formally launched a dedicated "Humanitarian Assistance Fund" to provide rapid relief for communities affected by natural disasters across Nepal.'
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
