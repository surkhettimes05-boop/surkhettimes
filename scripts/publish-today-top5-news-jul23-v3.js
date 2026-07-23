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
    category: 'news',
    title: 'Government Officially Scraps 3% Equity Tax on Education and Health Services Following Public Backlash',
    date: '2026-07-23',
    author: 'SurkhetTimes Policy Desk',
    facts: [
      'The Cabinet of Nepal officially approved the decision to scrap the 3% equity tax imposed on education and health services.',
      'Prime Minister Balendra Shah and Finance Minister Dr. Swarnim Wagle finalized the decision after extensive public consultations.',
      'All revenue collected under the equity tax since its introduction on July 17 will be fully refunded to service seekers.'
    ],
    fullStory: 'In a major policy decision today, July 23, 2026, the Nepal government officially approved the withdrawal of the controversial 3 percent equity tax previously levied on health and education services. The decision was confirmed following high-level deliberations led by Prime Minister Balendra Shah and Finance Minister Dr. Swarnim Wagle after intense widespread criticism from students, medical professionals, and civil society groups. The Cabinet has directed tax authorities to establish a streamlined mechanism to process full refunds for all service seekers who had paid the equity tax since July 17. The move is expected to alleviate financial burdens on households and restore stability in public services.'
  },
  {
    category: 'politics',
    title: 'Dr. Govinda KC Begins 24th Indefinite Hunger Strike in Dhangadhi Demanding Medical Education Reforms',
    date: '2026-07-23',
    author: 'SurkhetTimes Health & Politics Desk',
    facts: [
      'Senior orthopaedic surgeon and crusade activist Dr. Govinda KC launched his 24th fast-unto-death at Krishna Temple Dharamshala in Dhangadhi at 3:00 PM today.',
      'Dr. KC demands the cancellation of recent appointments to the Medical Education Commission and Shahid Dasharath Chand University over alleged conflicts of interest.',
      'He insists on enforcing the National Medical Education Act of 2018 to convert medical education into a non-profit sector by 2028.'
    ],
    fullStory: 'Renowned orthopedic surgeon and health activist Dr. Govinda KC commenced his 24th indefinite hunger strike today, July 23, 2026, in Dhangadhi, Kailali. Starting his fast at 3:00 PM at the Krishna Temple Dharamshala, Dr. KC stated that he was compelled to take extreme action after the government failed to honor past written commitments before his July 21 deadline. His key demands include revoking recent high-level appointments at the Medical Education Commission (MEC) and Shahid Dasharath Chand University of Health Sciences, which he alleges involve individuals with commercial investments in private medical colleges. Furthermore, Dr. KC called for full adherence to the 2018 Medical Education Act to transition medical education to a non-profit model by 2028.'
  },
  {
    category: 'business',
    title: 'Nepal Waives Landing and Navigation Fees at Pokhara and Gautam Buddha Airports to Boost International Aviation',
    date: '2026-07-23',
    author: 'SurkhetTimes Aviation Desk',
    facts: [
      'The Nepal government announced a 100% waiver on landing, parking, and navigation charges for international flights operating from Pokhara and Gautam Buddha airports.',
      'The fee waiver incentive scheme is effective immediately and will remain valid until mid-September 2028.',
      'The initiative aims to decentralize international air traffic from Tribhuvan International Airport in Kathmandu and encourage regional economic growth.'
    ],
    fullStory: 'To spur international flight operations and revitalize regional tourism, the Civil Aviation Authority of Nepal and the Ministry of Culture, Tourism, and Civil Aviation today announced a complete fee exemption for international airlines operating out of Pokhara International Airport and Gautam Buddha International Airport in Bhairahawa. Effective until mid-September 2028, all landing, parking, ground handling, and navigation fees are completely waived. Aviation authorities anticipate that this aggressive incentive package will attract major Asian and Middle Eastern carriers, easing pressure on Kathmandu’s overcrowded Tribhuvan International Airport while promoting regional commercial development.'
  },
  {
    category: 'news',
    title: 'Monsoon Floods and Landslides Block Key National Highways Across Five Provinces; Emergency Teams Deployed',
    date: '2026-07-23',
    author: 'SurkhetTimes Disaster Management Desk',
    facts: [
      'Torrential monsoon downpours caused heavy landslides, blocking major transport arteries including the Araniko and BP Highways.',
      'Disasters have disrupted connectivity across Koshi, Bagmati, Gandaki, Karnali, and Sudurpaschim provinces.',
      'The National Disaster Risk Reduction and Management Authority (NDRRMA) issued travel advisories and restricted nighttime mountain travel.'
    ],
    fullStory: 'Incessant monsoon rainfall over the past 24 hours has triggered severe mudslides and river overflows, blocking crucial road corridors across five provinces in Nepal. Major transport channels including the Araniko Highway in Sindhupalchok, the BP Highway corridor, and several provincial highways in Koshi, Gandaki, Karnali, and Sudurpaschim are currently impassable due to massive landslide debris. Heavy equipment and security forces have been deployed by the National Disaster Risk Reduction and Management Authority (NDRRMA) for clearing operations. Authorities have strongly advised commuters to avoid non-essential travel and imposed night travel restrictions along vulnerable mountain highways.'
  },
  {
    category: 'business',
    title: 'Nepal Formally Protests Saudi Arabia’s New Mandatory Skill Certification for Migrant Workers',
    date: '2026-07-23',
    author: 'SurkhetTimes Foreign Affairs & Labor Desk',
    facts: [
      'The Nepal Ministry of Labour, Employment and Social Security sent a formal diplomatic protest to Saudi authorities regarding unilateral skill testing requirements.',
      'The new rule mandates costly skill verification tests for Nepali migrant workers before visa issuance.',
      'Nepal contends that the additional burden unfairly affects thousands of aspiring workers seeking employment in the Gulf region.'
    ],
    fullStory: 'The Ministry of Labour, Employment and Social Security has registered a formal diplomatic objection with Saudi authorities concerning the unilateral implementation of a mandatory skill certification program for Nepali outbound workers. Under the new directive, Nepali workers applying for employment visas to Saudi Arabia are required to clear accredited skill testing examinations, incurring extra processing delays and financial overheads. Nepalese labor officials urged Saudi counterparts to suspend the unilateral requirement and initiate bilateral talks to ensure fair recruitment practices and protect the financial wellbeing of migrant workers.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 23, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);

    const imageAssetId = await uploadImage(`nepal-real-news-jul23-v3-${i + 1}-${timestamp}`);

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
