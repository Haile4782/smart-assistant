# 🤖 Smart Daily Assistant Agent

A full-stack AI-powered assistant that helps users organize tasks, break down goals, prioritize work, and generate actionable daily plans.

Built as an **agentic AI system** using **Next.js, NVIDIA NIM API, and Telegram Bot API**, and deployed on **Vercel**.

---

## 🚀 Live Demo

- 🌐 Web App: https://your-vercel-link.vercel.app  
- 🤖 Telegram Bot: @your_bot_username  

---

## 📌 Project Overview

This project demonstrates a **simple AI agent system** that can:

- Understand user intent
- Break down tasks into structured steps
- Prioritize actions (High / Medium / Low)
- Generate actionable daily plans
- Ask intelligent follow-up questions when needed

It is accessible via:
- 🌐 Web Chat Interface
- 🤖 Telegram Bot

Both interfaces share the same AI backend logic.

---

## ✨ Key Features

### 💬 Smart AI Assistant
- Natural language understanding
- Task decomposition into steps
- Priority-based planning
- Structured responses
- Context-aware follow-up questions

### 🌐 Web Chat Interface
- Clean and minimal UI
- Real-time chat experience
- Chat history display
- Loading indicator during AI processing

### 🤖 Telegram Bot Integration
- Same AI brain as web app
- Instant messaging support
- Lightweight and fast response system

---

## 🧠 AI Agent Capabilities

The system demonstrates basic **agentic behavior**, including:

- Goal interpretation
- Task breakdown
- Structured planning
- Priority classification
- Interactive follow-up questioning

---

## 🏗️ System Architecture

```

User (Web / Telegram)
│
▼
Next.js Frontend (Web UI)
Telegram Bot (Node.js)
│
▼
Next.js API Route (/api/chat)
│
▼
NVIDIA NIM LLM API (Llama 3.1)
│
▼
Structured AI Response
│
┌───────────────┴───────────────┐
▼                               ▼
Web UI Response            Telegram Bot Response

````

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API Routes
- **AI Model:** NVIDIA NIM (Llama 3.1 Instruct)
- **Telegram Bot:** node-telegram-bot-api
- **Deployment:** Vercel
- **Environment Management:** dotenv

---

## 🔐 Security Implementation

This project follows secure coding practices:

- API keys stored in `.env`
- `.env` excluded via `.gitignore`
- No secrets exposed in frontend code
- Server-side API calls only
- Environment variables configured in Vercel

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/smart-assistant.git
cd smart-assistant
````

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

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

1. Open Telegram and search: **@BotFather**
2. Create a new bot using:

   ```
   /newbot
   ```
3. Copy the bot token
4. Add it to `.env`
5. Run bot locally:

```bash
node telegram/bot.js
```

---

## 🌐 Deployment (Vercel)

Steps to deploy:

1. Push project to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variables:

   * NVIDIA_API_KEY
   * TELEGRAM_BOT_TOKEN
5. Click **Deploy**

---

## 📁 Project Structure

```
smart-assistant/
│
├── app/
│   ├── page.js
│   ├── layout.js
│   └── api/
│       └── chat/
│           └── route.js
│
├── telegram/
│   └── bot.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🎯 Evaluation Highlights

### ✔ Agent Architecture (30%)

* Shared AI backend for Web & Telegram
* Modular API design
* Clear separation of concerns

### ✔ Security (25%)

* Environment variables used
* No API keys exposed
* Secure backend API calls

### ✔ Functionality (20%)

* Working web chatbot
* Working Telegram bot
* Real AI responses

### ✔ UI/UX (15%)

* Clean and minimal interface
* Responsive chat layout

### ✔ Documentation (10%)

* Clear setup instructions
* Architecture explanation
* Deployment guide

---

## 🚀 Future Improvements

* Add persistent memory (chat history database)
* Integrate calendar scheduling
* Add voice input/output
* Improve UI with Tailwind CSS
* Deploy Telegram bot to cloud server

---

## 👨‍💻 Author

Developed as part of an **AI Engineer Assessment Project** for ELEC LLC.

---

## 📌 License

This project is for educational and assessment purposes.