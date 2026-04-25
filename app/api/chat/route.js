import { getAssistantResponse } from "@/lib/assistant";

export async function POST(req) {
  const { message, history } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await getAssistantResponse(message, history);

        let text = "";

        if (result.type === "plan") {
          text += `🎯 ${result.goal}\n\n`;
          result.steps.forEach((s, i) => {
            text += `${i + 1}. [${s.priority}] ${s.step}\n`;
          });
        } else if (result.type === "clarification") {
          text = result.question;
        } else {
          text = result.text;
        }

        // ✨ STREAM character by character
        for (let i = 0; i < text.length; i++) {
          controller.enqueue(encoder.encode(text[i]));
          await new Promise((r) => setTimeout(r, 10)); // typing speed
        }

        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode("Error generating response"));
        controller.close();
      }
    },
  });

  return new Response(stream);
}