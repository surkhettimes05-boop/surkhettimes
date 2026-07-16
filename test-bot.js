// test-bot.js
// 1. Replace the token below with your actual AGENT_SUBMIT_TOKEN from Vercel
const AGENT_SUBMIT_TOKEN = "YOUR_SECRET_TOKEN_HERE";

// 2. Put your raw bullet points here
const bulletPoints = `
- Karnali province budget of 32 billion passed today.
- Focus on infrastructure and agriculture.
- Opposition protested but eventually agreed.
`;

async function testAgent() {
  console.log("Sending bullet points to AI Agent...");
  
  try {
    const response = await fetch("https://surkhettimes.vercel.app/api/agent/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AGENT_SUBMIT_TOKEN}`
      },
      body: JSON.stringify({
        category: "politics",
        bulletPoints: bulletPoints
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("\n✅ SUCCESS!");
      console.log("Draft created successfully.");
      console.log("Sanity Document ID:", data.documentId);
    } else {
      console.log("\n❌ FAILED!");
      console.error(data);
    }
  } catch (err) {
    console.error("Error making request:", err);
  }
}

testAgent();
