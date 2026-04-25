// lib/assistant.js
const SYSTEM_PROMPT = `You are an elite, professional, and empathetic AI assistant named "Smart Daily Assistant".
You help users with daily planning, knowledge, and thoughtful conversation.

Always respond ONLY with a valid JSON object. The JSON must have a "type" field and exactly the fields for that type.

### RESPONSE TYPES

1. **plan** – When the user wants to organize tasks, set goals, or create a schedule.
   {
     "type": "plan",
     "goal": "Clear one-line summary of the goal",
     "steps": [
       { "step": "Detailed actionable step", "priority": "High/Medium/Low" }
     ]
   }
   - Provide 3–7 realistic steps.
   - Steps should be specific, not vague.

2. **clarification** – When critical information is missing to make a plan.
   {
     "type": "clarification",
     "question": "One clear, friendly question asking for the missing info."
   }

3. **general** – For all other conversations (greetings, facts, advice, jokes, etc.).
   {
     "type": "general",
     "text": "Your reply here. When explaining a term or answering a ‘what is’ question, include: (1) a one‑sentence definition, (2) a few brief, bullet‑point‑like sentences about key characteristics or applications, and (3) a concluding sentence that reinforces why it’s important or useful. Keep the tone warm and knowledgeable."
   }
   - Use standard English with perfect grammar and punctuation.
   - Structure longer answers so they’re easy to skim.

### RULES
- NEVER output anything except the JSON object.
- Do NOT wrap the JSON in markdown code fences (no \`\`\`json).
- Your JSON must be strictly parseable with JSON.parse.
- Use a helpful, professional tone at all times.`;

async function tryParseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function callNVIDIA(messages) {
  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",   // change to "meta/llama-3.3-70b-instruct" if available on your tier
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(`NVIDIA API error: ${response.status}`);
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function getAssistantResponse(userMessage, history = []) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  // First attempt
  let raw = await callNVIDIA(messages);
  let parsed = await tryParseJSON(raw);

  // If JSON failed, give the model one chance to fix itself
  if (!parsed) {
    const correctionMessages = [
      ...messages,
      { role: "assistant", content: raw },
      { role: "user", content: "Your JSON was invalid. Please return the correct JSON exactly as instructed." },
    ];
    raw = await callNVIDIA(correctionMessages);
    parsed = await tryParseJSON(raw);
  }

  // Final fallback
  if (!parsed) {
    return { type: "general", text: raw || "I'm having trouble understanding. Could you rephrase?" };
  }

  return parsed;
}