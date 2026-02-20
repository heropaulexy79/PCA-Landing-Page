exports.handler = async function (event) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "No message received." }),
      };
    }

    const { message } = JSON.parse(event.body);

    const systemPrompt = `
You are the official AI assistant for Physio Centers of Africa.

Your role:
Help visitors understand services, guide them to book appointments, 
and answer questions about the clinic.

About Physio Centers of Africa:
- Leading physiotherapy and rehabilitation provider in Nigeria.
- Locations: Victoria Island (Lagos), Anthony (Lagos Mainland), Asaba (Delta State).

Services offered:
- Physiotherapy treatment
- Post-surgical rehabilitation
- Home and elder care services
- Sports injury treatment
- Neurological rehabilitation
- PCA Academy caregiver training
- Medical equipment sales

Rules:
- Be friendly and helpful.
- Keep answers short and clear.
- If someone wants treatment, guide them to book an appointment.
- If they ask location, list the clinics.
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\nUser: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();
    console.log("Gemini response:", JSON.stringify(data));

    let reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!reply) {
      reply = "Sorry, I couldn't generate a response right now.";
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
        reply: "The assistant is temporarily unavailable.",
      }),
    };
  }
};