import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: false,
});

export async function generateNewsletterDraft() {
  try {
    // 1. Fetch Top 5 Recent Articles from Sanity
    const query = `*[_type == "post"] | order(publishedAt desc)[0...5] {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt
    }`;
    const posts = await sanity.fetch(query);

    if (!posts || posts.length === 0) {
      throw new Error("No recent posts found to generate newsletter.");
    }

    // 2. Prepare prompt for AI
    const promptData = posts
      .map((p: any, i: number) => `${i + 1}. Title: ${p.title}\nExcerpt: ${p.excerpt}`)
      .join("\n\n");

    const prompt = `
      You are the Editor-in-Chief for Surkhet Times, a premium news publication in Nepal.
      Write an engaging, professional, and concise HTML newsletter introducing today's top stories.
      
      Here are the top stories:
      ${promptData}
      
      Requirements:
      - Start with a warm greeting.
      - Provide a brief 2-3 sentence AI summary of the overarching theme of today's news.
      - Format the top stories nicely using <h2> and <p> tags.
      - Return ONLY the HTML body content (no <html>, <head>, or markdown code blocks).
      - Make it sound like a premium "Morning Brief".
    `;

    // 3. Call AI API (Using NVIDIA NIM as per project setup, or fallback to standard OpenAI SDK)
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (!nvidiaKey) {
      throw new Error("NVIDIA_API_KEY is missing from environment variables.");
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama3-70b-instruct", // or any available NVIDIA model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate AI newsletter content.");
    }

    const data = await response.json();
    const htmlContent = data.choices[0].message.content.trim();

    // 4. Return the generated draft data
    return {
      subject: `Surkhet Times Morning Brief: ${posts[0].title}`,
      content: htmlContent,
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
