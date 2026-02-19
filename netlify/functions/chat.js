exports.handler = async function (event) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No body received" }),
      };
    }

    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is missing" }),
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an assistant for Physio Centers of Africa. Help visitors understand services, answer questions, and guide them to book appointments.

User message: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data));

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Gemini API error",
          details: data,
        }),
      };
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help! Could you rephrase that?";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.log("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
