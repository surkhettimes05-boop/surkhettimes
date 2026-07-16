import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export const runtime = 'edge';

// Validate Authorization Header
function validateAuth(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];
  return token === process.env.AGENT_SUBMIT_TOKEN;
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    if (!validateAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bulletPoints, category } = body;

    // 2. Validate Input
    if (!bulletPoints || typeof bulletPoints !== 'string' || bulletPoints.trim().length < 20) {
      return NextResponse.json(
        { error: 'Invalid input. bulletPoints must be a string of at least 20 characters.' },
        { status: 400 }
      );
    }

    // 3. Call NVIDIA NIM API
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (!nvidiaKey) {
      console.error('Missing NVIDIA_API_KEY');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const systemPrompt = `You are an expert, professional journalist for SurkhetTimes, a local broadsheet newspaper in Karnali Province, Nepal.
Your task is to take the provided raw bullet points and write a professional, objective news article in Nepali.
STRICT RULES:
1. ONLY use the facts provided in the bullet points. Do NOT invent, hallucinate, or add any numbers, quotes, names, or events not present in the input.
2. If the bullet points are brief, write a short news brief. Do NOT pad with fluff.
3. Write in standard Nepali broadsheet style (formal journalistic tone).
4. Structure the body with a short lede paragraph followed by body paragraphs. Use \\n\\n for paragraph breaks.
5. You MUST output a valid JSON object matching this schema exactly:
{
  "headline": "A strong Nepali headline",
  "body": "The full article text...",
  "suggestedTags": ["tag1", "tag2"]
}
Respond ONLY with the JSON object, no markdown blocks, no other text.`;

    const nvidiaResponse = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Raw Bullet Points:\n${bulletPoints}` }
          ],
          response_format: { type: 'json_object' }
        }),
      }
    );

    if (!nvidiaResponse.ok) {
      const err = await nvidiaResponse.text();
      console.error('NVIDIA API Error:', err);
      return NextResponse.json({ error: 'Failed to generate article with AI.' }, { status: 502 });
    }

    const nvidiaData = await nvidiaResponse.json();
    const generatedText = nvidiaData.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 502 });
    }

    // 4. Parse JSON Output
    let parsedArticle;
    try {
      parsedArticle = JSON.parse(generatedText);
    } catch (e) {
      console.error('Failed to parse NVIDIA JSON:', generatedText);
      return NextResponse.json({ error: 'AI returned invalid JSON format.' }, { status: 502 });
    }

    if (!parsedArticle.headline || !parsedArticle.body) {
      return NextResponse.json({ error: 'AI response missing headline or body.' }, { status: 502 });
    }

    // 5. Publish to Sanity as a Draft
    const writeToken = process.env.SANITY_WRITE_TOKEN;
    if (!writeToken) {
      console.error('Missing SANITY_WRITE_TOKEN');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const writeClient = client.withConfig({
      token: writeToken,
      useCdn: false, // Ensure we write to live API
    });

    // Create a unique Draft ID. 'drafts.' prefix tells Sanity this is unpublished.
    const draftId = `drafts.${crypto.randomUUID()}`;

    // Helper to generate a URL-friendly slug from headline
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0900-\u097F]+/g, '-') // Allow alphanumeric and Nepali characters
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
    };

    const doc = {
      _type: 'article',
      _id: draftId,
      title: parsedArticle.headline,
      slug: {
        _type: 'slug',
        current: generateSlug(parsedArticle.headline)
      },
      category: category || 'news', // Default fallback
      date: new Date().toISOString(),
      fullStory: parsedArticle.body,
      rawInput: bulletPoints,
      sourceType: 'ai_draft',
      suggestedTags: parsedArticle.suggestedTags || [],
    };

    const createdDraft = await writeClient.create(doc);

    return NextResponse.json({
      success: true,
      message: 'Article successfully generated and saved as a draft.',
      documentId: createdDraft._id,
      studioUrl: `/studio/structure/article;${createdDraft._id}`
    });

  } catch (error: unknown) {
    console.error('Agent Submit Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: msg }, { status: 500 });
  }
}
