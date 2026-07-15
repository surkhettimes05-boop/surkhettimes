import { NextResponse } from 'next/server';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

// These should be configured in your environment variables
const secret = process.env.SANITY_WEBHOOK_SECRET || '';
const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const channelId = process.env.TELEGRAM_CHANNEL_ID || '';

export async function POST(req: Request) {
  try {
    // 1. Read the body as text for signature validation
    const body = await req.text();
    const signature = req.headers.get(SIGNATURE_HEADER_NAME);

    // 2. Validate the signature (if a secret is configured)
    if (secret && signature) {
      if (!isValidSignature(body, signature, secret)) {
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
      }
    }

    // 3. Parse the body as JSON
    const payload = JSON.parse(body);

    // 4. We only want to trigger on published articles
    if (payload._type !== 'article') {
      return NextResponse.json({ success: true, message: 'Ignored non-article document' }, { status: 200 });
    }

    // Ensure we have the required fields
    const title = payload.title;
    const slug = payload.slug?.current;

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: 'Missing title or slug' }, { status: 400 });
    }

    // 5. Format the Telegram message
    // HTML parse mode is generally safer for Telegram bots than MarkdownV2
    const message = `🚨 <b>${title}</b>\n\n🔗 https://surkhettimes.vercel.app/article/${slug}`;

    // 6. Send to Telegram
    if (botToken && channelId) {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Telegram API Error:', errorData);
        return NextResponse.json({ success: false, message: 'Failed to send to Telegram' }, { status: 500 });
      }
    } else {
      console.warn('Telegram Bot Token or Channel ID is missing. Message not sent.');
    }

    return NextResponse.json({ success: true, message: 'Broadcast sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ success: false, message: 'Webhook error' }, { status: 500 });
  }
}
