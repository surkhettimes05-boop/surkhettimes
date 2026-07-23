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
    title: "Nepal Protests Saudi Arabia's New Skill Test for Migrant Workers",
    slug: "nepal-protests-saudi-skill-test-july23-2026",
    content: "Nepal is officially protesting a unilateral move by Saudi Arabia to mandate a new 'skill certification programme' for migrant workers. The requirement imposes additional costs on workers and has prompted the Nepali government to issue a diplomatic note requesting an immediate review of the policy.",
    category: "Politics",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_migrant_workers_july23_1784776265279.jpg"
  },
  {
    title: "Severe Monsoon Floods and Landslides Block Major Highways",
    slug: "monsoon-floods-block-highways-july23-2026",
    content: "Continuous heavy monsoon rains have triggered widespread flooding and landslides across several provinces in Nepal. Major transport arteries, including the Arniko Highway, BP Highway, and Kanti Lokpath, have been severely disrupted, prompting authorities to advise the public against non-essential travel.",
    category: "National",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_monsoon_flooding_july23_1784776278456.jpg"
  },
  {
    title: "Fertiliser Crisis Deepens During Peak Farming Season",
    slug: "fertiliser-crisis-peak-season-july23-2026",
    content: "Farmers across Nepal are grappling with a severe shortage of chemical fertilisers during the critical monsoon farming season. The ongoing scarcity has forced many farmers to rely on risky, informal procurement channels across the Indian border, threatening this year's agricultural output.",
    category: "Agriculture",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_farmers_fertiliser_july23_1784776295950.jpg"
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
