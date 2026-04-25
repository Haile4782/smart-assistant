import axios from "axios";

export async function getAIResponse(userMessage: string) {
  const prompt = `
You are a Smart Daily Assistant Agent.

Your job:
1. Understand the user goal
2. Break into steps
3. Prioritize tasks
4. Ask follow-up questions if needed

User message:
${userMessage}
`;

  const response = await axios.post(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}