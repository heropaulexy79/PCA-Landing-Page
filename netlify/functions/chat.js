// In-memory conversation store (simple session memory)
const conversations = {};

exports.handler = async function (event) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "No message received." }),
      };
    }

    const { message, sessionId = "default" } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Please enter a message." }),
      };
    }

    // Create conversation history if it doesn't exist
    if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    const systemPrompt = `
You are the official AI assistant for Physio Centers of Africa.

Act like a real human support agent working at the clinic.

Your role:
- Help visitors understand services
- Guide them to book appointments
- Answer questions clearly and professionally
- Be warm, conversational, and helpful

About Physio Centers of Africa:
- Leading physiotherapy and rehabilitation provider in Nigeria
- Locations:
  • Victoria Island (Lagos)
  • Anthony (Lagos Mainland)
  • Asaba (Delta State)

Services:
- Physiotherapy treatment
- Post-surgical rehabilitation
- Home and elder care
- Sports injury treatment
- Neurological rehabilitation
- PCA Academy caregiver training
- Medical equipment sales

Behavior rules:
- Keep responses short and helpful
- If a user greets you, welcome them and ask how you can help
- If someone wants treatment, guide them to book an appointment
- If they ask for locations, list the clinics
- If unsure, ask a clarifying question
`;

    // Add user message to history
    conversations[sessionId].push({
      role: "user",
      parts: [{ text: message }],
    });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            ...conversations[sessionId],
          ],
        }),
      }
    );

    const data = await geminiResponse.json();
    console.log("Gemini response:", JSON.stringify(data));

    let reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!reply) {
      reply =
        "I'm here to help with appointments, treatments, or clinic information. What would you like to know?";
    }

    // Save AI reply to memory
    conversations[sessionId].push({
      role: "model",
      parts: [{ text: reply }],
    });

    // Prevent memory from growing too large
    if (conversations[sessionId].length > 12) {
      conversations[sessionId] = conversations[sessionId].slice(-12);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply:
          "The assistant is temporarily unavailable. Please try again in a moment.",
      }),
    };
  }
};