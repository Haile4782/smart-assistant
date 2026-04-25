import axios from "axios";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a Smart Daily Assistant Agent.

Always respond in this EXACT format:

📌 Summary:
(1-2 short sentences)

📋 Steps:
1. ...
2. ...
3. ...

🔥 Priority:
High: ...
Medium: ...
Low: ...

❓ Follow-up question:
(Ask one relevant question)

Rules:
- Keep answers short and clear
- Do NOT add extra explanation
- Always follow the format strictly
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    return Response.json({ reply: aiReply });
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);

    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}