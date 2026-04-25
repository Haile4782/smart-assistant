import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Bot running...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const res = await axios.post(
      process.env.API_URL, // 🔥 IMPORTANT
      {
        message: text,
        userId: String(chatId),
      },
      { timeout: 15000 }
    );

    await bot.sendMessage(chatId, res.data.reply);
  } catch (err) {
    console.error("BOT ERROR:", err.message);

    await bot.sendMessage(
      chatId,
      "⚠️ AI temporarily unavailable. Try again."
    );
  }
});