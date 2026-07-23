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
    title: "Bagmati Province Coalition Collapses",
    slug: "bagmati-coalition-collapse-july23-2026",
    content: "The governing coalition between the Nepali Congress (NC) and the CPN-UML in Bagmati Province has officially ended, leading to significant political shifts and uncertainty in the provincial assembly.",
    category: "Politics",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_politics_bagmati_july23_1784787214582.jpg"
  },
  {
    title: "Government Disburses Rs507 Million for Bird Flu Compensation",
    slug: "bird-flu-compensation-nepal-july23-2026",
    content: "Following an outbreak that affected 162 poultry farms over the past four months, the Department of Livestock Services reported that the government has disbursed over Rs507 million in compensation to affected farmers. Fortunately, no new cases have been reported since mid-July.",
    category: "Agriculture",
    imagePath: "C:\\Users\\QCS\\.gemini\\antigravity\\brain\\915e19c0-3e16-4e8d-b9c6-8a903eb7757b\\nepal_poultry_birdflu_july23_1784787232311.jpg"
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
