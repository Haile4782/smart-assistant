import axios from "axios";

// simple in-memory store (upgrade later to DB)
const memoryStore = new Map();

export async function POST(req) {
  try {
    const { message, userId = "default" } = await req.json();

    if (!message) {
      return Response.json({ error: "No message" }, { status: 400 });
    }

    // get old memory
    const history = memoryStore.get(userId) || [];

    const aiPrompt = `
You are a Smart Daily Assistant.

Use conversation memory below:
${history.map(h => `${h.role}: ${h.text}`).join("\n")}

User: ${message}

Respond clearly in structured format:
Summary, Steps, Priority, Follow-up question
`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: aiPrompt }],
        temperature: 0.7,
        max_tokens: 600,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // update memory
    memoryStore.set(userId, [
      ...history,
      { role: "user", text: message },
      { role: "ai", text: reply },
    ]);

    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI failed" }, { status: 500 });
  }
}