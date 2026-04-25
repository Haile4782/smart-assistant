import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

dotenv.config();

// ✅ Create bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Telegram bot is running...");

// ✅ Listen for messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore empty messages
  if (!text) return;

  console.log("📩 Incoming:", text);

  // ✅ Handle simple messages (nice UX)
  if (text.toLowerCase().includes("thank")) {
    return bot.sendMessage(
      chatId,
      "You're welcome 😊 Let me know if you need help!"
    );
  }

  if (text.toLowerCase() === "/start") {
    const name = msg.from.first_name || "there";
    return bot.sendMessage(
      chatId,
      "👋 Hello! I’m your Smart Daily Assistant 🤖\n\nI can help you plan tasks, organize your day, prioritize work, and create action plans.\n\n💡 Try something like:\n• Plan my study schedule for 3 days\n• Help me organize my daily tasks\n• Create a workout plan\n\n👉 What would you like to do today?"
    );
  }

  try {
    // ✅ Call your Next.js API
    const res = await axios.post("http://127.0.0.1:3000/api/chat", {
      message: text,
    });

    const reply = res.data.reply || "⚠️ No response from AI";

    console.log("✅ Reply:", reply);

    // ✅ Send response to Telegram
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.log("❌ ERROR:", err.message);
    console.log("❌ DETAILS:", err.response?.data);

    await bot.sendMessage(
      chatId,
      "⚠️ AI service is currently unavailable. Please try again."
    );
  }
});