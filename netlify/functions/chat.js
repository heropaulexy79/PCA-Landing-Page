import { GoogleAuth } from "google-auth-library";

export async function handler(event, context) {
  try {
    console.log("GCP_PROJECT:", process.env.GCP_PROJECT?.length);
    console.log("GOOGLE_APPLICATION_CREDENTIALS_JSON:", process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length);

    if (!process.env.GCP_PROJECT || !process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return { statusCode: 500, body: "Env variables missing or undefined" };
    }

    const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const auth = new GoogleAuth({
      credentials: creds,
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT}/locations/us-central1/publishers/google/models/text-bison-001:generateText`;

    const { data } = await client.request({
      url,
      method: "POST",
      data: {
        text: "Hello world!",
        temperature: 0.7,
        maxOutputTokens: 256,
      },
    });

    return { statusCode: 200, body: JSON.stringify({ aiReply: data.generatedText }) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
