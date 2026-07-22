import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN || 'skJB43Y6SFsiKwQkS7xRGjUWu8xE1iGVT4HxemQFbTFyFa63UGptF6xlGNU74ROWtgSSEZBfUAXHNZtQv79Ii8yJoPee1V8glShQ6t259R7r891FOnoLSGtWqU4u77PjqV089ZH4hciYAM3yagYjc7Vl60HBJUKHNSGQuiW4SRMrxB3VsFvD',
  useCdn: false,
  apiVersion: '2024-01-01',
});

const articles = [
  {
    title: "Government Introduces Sweeping Aviation Incentives at Key Airports",
    slug: "aviation-incentives-pokhara-bhairahawa-2026",
    content: "To boost tourism and air traffic, the Nepal cabinet has approved a 100% waiver on landing, parking, and navigation charges, along with a 50% discount on ground handling fees for international flights at Pokhara and Gautam Buddha international airports, effective until mid-September 2028. This move aims to increase international arrivals and support the struggling domestic aviation sector.",
    category: "Economy",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\pokhara_airport_incentives_1784736470897.jpg"
  },
  {
    title: "Tourism Bill Controversy: Hoteliers Push Back on Price Regulations",
    slug: "tourism-bill-controversy-hotel-rates-2026",
    content: "Lawmakers are currently debating amendments to the Integrated Tourism Bill. Among the most controversial proposals is a measure that would allow the government to regulate hotel room rates. Hoteliers have strongly criticized the move as 'regressive', arguing that room rates should be determined by market demand rather than government intervention.",
    category: "Business",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_hotel_tourism_1784736496049.jpg"
  },
  {
    title: "Prime Minister Backs New Handicrafts Development Board",
    slug: "pm-backs-handicrafts-development-board-2026",
    content: "Prime Minister Balendra Shah has affirmed the government's strong commitment to Nepal's handicraft sector. He recently expressed support for the establishment of a Handicrafts Development Board and proposed the creation of a 'handicrafts village' to promote traditional artisanal skills and boost the export of local goods.",
    category: "Politics",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_handicraft_artisan_1784736514300.jpg"
  }
];

async function publishNews() {
  for (const article of articles) {
    console.log(`Publishing: ${article.title}`);
    
    // Upload image
    const imageBuffer = fs.readFileSync(article.imagePath);
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(article.imagePath)
    });
    
    console.log(`Image uploaded: ${asset._id}`);
    
    // Create post document
    // Using a typical Sanity post schema
    const post = {
      _type: 'post',
      title: article.title,
      slug: {
        _type: 'slug',
        current: article.slug
      },
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      },
      // Use raw string or block text depending on schema, we'll try block text first for body
      body: [
        {
          _type: 'block',
          _key: (Math.random() + 1).toString(36).substring(7),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: (Math.random() + 1).toString(36).substring(7),
              text: article.content,
              marks: []
            }
          ]
        }
      ]
    };
    
    const result = await client.create(post);
    console.log(`Successfully created post: ${result._id}\n`);
  }
}

publishNews().catch(console.error);
