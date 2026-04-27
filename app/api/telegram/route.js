// app/api/telegram/route.js
import { getAssistantResponse } from "@/lib/assistant";

// In-memory store for conversation history (resets on cold starts – fine for MVP)
const historyStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Telegram update:", JSON.stringify(body));

    // Telegram sends updates in a specific format: { update_id, message: { ... } }
    const message = body.message || body.edited_message;
    if (!message || !message.text) {
      // Ignore non-text messages (e.g., stickers, joins)
      return new Response("OK", { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // Get or create history for this chat
    if (!historyStore.has(chatId)) {
      historyStore.set(chatId, []);
    }
    const history = historyStore.get(chatId);

    // Call the AI assistant (same as web chat)
    const result = await getAssistantResponse(text, history);

    // Update history (keep last 6 exchange pairs)
    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: JSON.stringify(result) });
    if (history.length > 12) history.splice(0, history.length - 12);

    // Format reply
    let reply = "";
    if (result.type === "plan") {
      reply = `🎯 Goal: ${result.goal}\n`;
      result.steps.forEach((step, i) => {
        reply += `\n${i + 1}. [${step.priority}] ${step.step}`;
      });
    } else if (result.type === "clarification") {
      reply = result.question;
    } else if (result.type === "general") {
      reply = result.text;
    } else {
      reply = result.rawText || "Sorry, I didn't understand that.";
    }

    // Send reply back to Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!telegramToken) {
      console.error("TELEGRAM_BOT_TOKEN missing");
      return new Response("OK", { status: 200 });
    }

    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
        // No parse_mode, so it's plain text – avoids Markdown errors
      }),
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}