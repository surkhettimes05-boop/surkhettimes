const https = require('https');

// Read environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables must be set.");
  process.exit(1);
}

/**
 * Pushes a new article summary to the Telegram channel.
 *
 * @param {string} title The article title
 * @param {string} summary The article summary
 * @param {string} articleUrl The full URL to the article
 * @param {boolean} hasAudio Whether the article has an AI audio brief
 */
function pushToTelegram(title, summary, articleUrl, hasAudio) {
  const audioBadge = hasAudio ? ' 🎧 (अडियो उपलब्ध छ)' : '';
  const message = `📰 *${title}*${audioBadge}\n\n${summary}\n\n🔗 पूरा पढ्न: ${articleUrl}`;

  const data = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      const parsed = JSON.parse(responseData);
      if (parsed.ok) {
        console.log(`Successfully sent to Telegram: ${title}`);
      } else {
        console.error('Failed to send to Telegram:', parsed.description);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  // Write data to request body
  req.write(data);
  req.end();
}

// Example usage when called directly
// e.g. node scripts/telegram-push.js "Headline" "Summary text" "https://surkhettimes.com/article/slug" "true"
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Usage: node telegram-push.js <title> <summary> <url> [hasAudio:true|false]");
    process.exit(1);
  }
  
  const [title, summary, url, hasAudioStr] = args;
  const hasAudio = hasAudioStr === 'true';
  
  pushToTelegram(title, summary, url, hasAudio);
}

module.exports = { pushToTelegram };
