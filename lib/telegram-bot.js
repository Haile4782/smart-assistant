import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import TelegramBot from "node-telegram-bot-api";
import { getAssistantResponse } from "./assistant.js";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is missing!");
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// In-memory history store (resets when bot restarts)
const historyStore = new Map();

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  // Get or create history array for this user
  if (!historyStore.has(chatId)) {
    historyStore.set(chatId, []);
  }
  const history = historyStore.get(chatId);

  try {
    // Send the user message AND the recent history
    const result = await getAssistantResponse(text, history);

    // Update history (keep last 6 exchange pairs = 12 messages)
    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: JSON.stringify(result) });
    if (history.length > 12) history.splice(0, history.length - 12);

    // Format the reply based on response type
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
      // Fallback for unexpected structure
      reply = result.rawText || "Sorry, I didn't understand that.";
    }

    // Send as plain text (no Markdown parsing)
    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Telegram bot error:", error);
    bot.sendMessage(chatId, "Sorry, something went wrong.");
  }
});

console.log("Telegram bot is running...");