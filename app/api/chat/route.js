import axios from "axios";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    const prompt = `
You are a Smart Daily Assistant.

Rules:
- Be clear and structured
- Always respond (never empty)
- Use simple language

User request:
${message}
`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const prompt = `
You are a Smart Daily Assistant AI.

RULES:
- Always respond in clean markdown style
- Use headings and bullet points
- Never write long paragraphs
- Always structure like this:

TITLE
Summary (1-2 lines)

LIST:
- item 1
- item 2

OPTIONAL DETAILS:
- prices
- location

User request:
${message}
`;
    const aiReply = response?.data?.choices?.[0]?.message?.content || "⚠️ AI returned empty response. Please try again.";
    return Response.json({ reply: aiReply });
  } catch (error) {
    console.error("AI ERROR:", error?.response?.data || error.message);

    return Response.json(
      { reply: "⚠️ AI service temporarily unavailable. Try again." },
      { status: 500 }
    );
  }
}