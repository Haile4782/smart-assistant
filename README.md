# 🤖 Smart Daily Assistant Agent

A simple AI-powered assistant that helps users organize tasks, break down goals, prioritize work, and generate actionable daily plans.  
Built as a full-stack agent using **Next.js, NVIDIA NIM API, and Telegram Bot API**, and deployed on **Vercel**.

---

## 🚀 Live Demo

- 🌐 Web App: https://vercel-link.vercel.app  
- 🤖 Telegram Bot: @smart_daily_assistant_bot

---

## 📌 Features

### 💬 Smart AI Assistant
- Understands user goals
- Breaks tasks into steps
- Prioritizes actions
- Suggests daily plans
- Asks follow-up questions when needed

### 🌐 Web Chat Interface
- Clean chatbot UI
- Real-time AI responses
- Chat history view

### 🤖 Telegram Bot
- Same AI engine as web app
- Instant responses inside Telegram
- Lightweight and fast interaction

---

## 🧠 AI Agent Behavior

The assistant demonstrates basic agentic capabilities:

- Goal understanding
- Task decomposition
- Prioritization (High / Medium / Low)
- Structured responses
- Context-aware follow-up questions

---

## 🏗️ System Architecture

```

Web App (Next.js)
│
▼
API Route (/api/chat)
│
▼
NVIDIA NIM API (LLM)
│
▼
AI Response
│
├── Web UI Response
└── Telegram Bot Response

````

Both Web and Telegram use the same backend logic.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API Routes
- **AI Model:** NVIDIA NIM (Llama 3.1)
- **Bot:** node-telegram-bot-api
- **Deployment:** Vercel
- **Environment Management:** dotenv

---

## 🔐 Security Implementation

To ensure secure deployment:

- API keys stored in `.env`
- `.env` excluded via `.gitignore`
- No secrets committed to GitHub
- Environment variables configured in Vercel
- Backend-only API calls (no exposed keys in frontend)

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Haile4782/smart-assistant.git
cd smart-assistant
````

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create Environment Variables

Create a `.env` file:

```env
NVIDIA_API_KEY=your_nvidia_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

---

### 4. Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🤖 Telegram Bot Setup

1. Create bot using **@BotFather**
2. Get bot token
3. Add token to `.env`
4. Run bot script:

```bash
node telegram/bot.js
```

---

## 🌐 Deployment (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:

   * NVIDIA_API_KEY
   * TELEGRAM_BOT_TOKEN
4. Deploy

---

## 📁 Project Structure

```
smart-assistant/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
│       └── chat/
│           └── route.js
│
├── telegram/
│   └── bot.js
│
├── .env.example
├── package.json
└── README.md
```

---


## 📈 Future Improvements

* Add memory (chat history storage)
* Add task saving database (MongoDB/Firebase)
* Add voice assistant input
* Add calendar integration
* Improve UI design

---

## 👨‍💻 Author

Built as an assessment project for **ELEC LLC AI Engineer Application**

---

## 📌 License

This project is for educational and assessment purposes.
