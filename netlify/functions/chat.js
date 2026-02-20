exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body || "{}");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{
  text: `You are the AI assistant for Physio Centers of Africa.
You help visitors understand services, locations, and booking appointments.

User: ${message}`
}],

            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("Gemini response:", JSON.stringify(data));

    let reply = "Sorry, I couldn't respond.";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      reply = parts.map(p => p.text).join(" ");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
