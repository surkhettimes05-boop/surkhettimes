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
    title: 'Government Scraps Controversial 3% Health and Education Equity Tax, Pledges Full Refund Within 50 Days',
    date: '2026-07-23',
    author: 'SurkhetTimes Policy Bureau',
    facts: [
      'Following public backlash, Nepal Cabinet officially decided today to scrap the 3% equity tax levied on education and health services.',
      'The government pledged to refund all duties collected under the tax since July 17 directly back into citizens bank accounts within 50 days.',
      'Concurrently, hoteliers have raised strong objections against proposed amendments to the Integrated Tourism Bill restricting hotel room tariffs.'
    ],
    fullStory: 'In a major policy reversal following widespread public outcry, the Nepal Cabinet today officially decided to withdraw the controversial 3 percent equity tax imposed on education and healthcare services under the recent fiscal budget. Prime Minister and Cabinet representatives confirmed that all taxes collected under this mechanism since July 17 will be refunded directly to citizens verified bank accounts within 50 days. Concurrently, the Ministry of Education has called urgent dialogue sessions with educational consultancies over new regulation frameworks, while hoteliers nationwide voice opposition against proposed government price caps on hotel room rates in the Integrated Tourism Bill.'
  },
  {
    category: 'sports',
    title: 'Nepal Takes On Netherlands in Crucial ICC World Cup League 2 Tri-Series Clash in Utrecht',
    date: '2026-07-23',
    author: 'SurkhetTimes Sports Desk',
    facts: [
      'Nepal plays hosts Netherlands today in Utrecht for their second match of the ICC Mens Cricket World Cup League 2 tri-series.',
      'Following an opening 8-wicket defeat against Namibia, Nepal aims to earn crucial points to boost their top-four standings and 2027 ODI status.',
      'In volleyball, Nepals national mens team narrowly lost 3-2 to Kazakhstan after a thrilling 5-set opener at the CAVA Championship in Islamabad.'
    ],
    fullStory: 'The Nepali national cricket team faces host nation Netherlands today in Utrecht for a critical fixture in the ongoing ICC Mens Cricket World Cup League 2 tri-series. Coming off an opening eight-wicket setback against Namibia, Rohit Paudels side is aiming for a strong comeback to secure points vital for direct qualification into the 2027 Cricket World Cup Qualifiers. Meanwhile, in Islamabad, Nepals national mens volleyball team pushed Kazakhstan to five sets in a high-intensity battle before falling 3-2 in their opening CAVA Mens Volleyball Championship match.'
  },
  {
    category: 'news',
    title: 'Heavy Monsoon Deluge Blocks Major Highways Across Five Provinces; Night Travel Banned on Mountain Corridors',
    date: '2026-07-23',
    author: 'SurkhetTimes Disaster Desk',
    facts: [
      'Continuous monsoon torrential rainfall has triggered severe flooding and landslides across Koshi, Gandaki, Karnali, Bagmati, and Sudurpashchim.',
      'Key transport arteries including the Arniko Highway, BP Highway, Kanti Lokpath, and Kaligandaki Corridor remain blocked due to massive debris.',
      'Disaster authorities have imposed nighttime travel bans on high-risk mountain roads as emergency crews work around the clock to clear slides.'
    ],
    fullStory: 'Incessant monsoon rains across Nepal have caused widespread landslides and torrential flooding, severely disrupting vehicular movement across five provinces. Key highway links including the Arniko Highway in Sindhupalchok, the BP Highway in Kavre, Kanti Lokpath, and sections of the Kaligandaki Corridor and Besisahar-Manang road are currently obstructed by heavy mudslides and debris. In response to heightened risks of overnight landslides, traffic authorities and local administrations have suspended nighttime travel on vulnerable high-altitude corridors while deploying heavy equipment to clear arterial routes.'
  },
  {
    category: 'business',
    title: 'Nepal Power Exports Reach Historic Rs 29.32 Billion Revenue as Net Trade Surplus Touches Rs 18.76 Billion',
    date: '2026-07-23',
    author: 'SurkhetTimes Business Bureau',
    facts: [
      'Nepal Electricity Authority (NEA) reported a record Rs 29.32 billion in total electricity export revenues for FY 2025/26, up 68% year-on-year.',
      'Power exports reached 3.87 billion units while imports dropped sharply to 1.14 billion units, yielding a net surplus of Rs 18.76 billion.',
      'NEA introduced a new four-tier classification policy to facilitate RCOD deadline extensions for 218 delayed private hydropower projects.'
    ],
    fullStory: 'The Nepal Electricity Authority (NEA) announced a landmark milestone in clean energy trade today, earning Rs 29.32 billion from electricity exports to India in the fiscal year 2025/26—a 67.96 percent increase over the previous fiscal period. Total export volume touched 3.87 billion units while cross-border imports dropped significantly to 1.14 billion units, resulting in a net trade surplus of Rs 18.76 billion. To sustain long-term growth and resolve commercial bottlenecks, NEA also launched a four-tier classification framework easing deadline extensions for 218 lagging private hydropower projects.'
  },
  {
    category: 'politics',
    title: 'Bagmati Province Ruling Coalition Collapses as UML Ministers Resign En Masse; Dr. Govinda KC Begins 24th Hunger Strike',
    date: '2026-07-23',
    author: 'SurkhetTimes Political Desk',
    facts: [
      'The ruling coalition in Bagmati Province collapsed today after CPN-UML ministers submitted their en masse resignations and withdrew government support.',
      'On BP Koiralas 44th memorial day, internal strife within Nepali Congress escalated with rival factions announcing a national conclave for August 14.',
      'Medical crusade activist Dr. Govinda KC launched his 24th hunger strike today in Dhangadhi demanding implementation of past healthcare agreements.'
    ],
    fullStory: 'Political instability flared in Bagmati Province today as all CPN-UML ministers resigned en masse, formally withdrawing support from the provincial executive and plunging the coalition government into a political crisis. Meanwhile, internal divisions within the Nepali Congress deepened on the 44th memorial day of founder BP Koirala, with dissident party factions announcing an independent National Conclave for August 14 in protest against party leadership. Concurrently, veteran medical reformer Dr. Govinda KC commenced his 24th fast-unto-death in Dhangadhi today, urging the federal government to honor prior agreements on healthcare reforms and medical education standards.'
  }
];

async function publishNews() {
  console.log('Starting publication of top 5 latest real news stories for Nepal (July 23, 2026)...');
  const docsToCreate = [];
  const timestamp = Date.now();

  for (let i = 0; i < newsStories.length; i++) {
    const story = newsStories[i];
    console.log(`[${i + 1}/5] Processing article: "${story.title}"...`);

    const imageAssetId = await uploadImage(`nepal-real-news-jul23-${i + 1}-${timestamp}`);

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
