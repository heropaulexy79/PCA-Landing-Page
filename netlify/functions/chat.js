import { GoogleAuth } from "google-auth-library";

export async function handler(event, context) {
  try {
    const { message } = JSON.parse(event.body);

    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT}/locations/us-central1/publishers/google/models/text-bison-001:generateText`;

    const aiResponse = await client.request({
      url,
      method: "POST",
      data: {
        text: `The user asks: "${message}". Respond like a helpful customer support agent.`,
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ aiReply: aiResponse.data.generatedText }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "AI request failed" }) };
  }
}
