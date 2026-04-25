# 🤖 Smart Daily Assistant Agent

A full-stack AI-powered assistant that helps users organize tasks, break down goals, prioritize work, and generate actionable daily plans.

Built as an **agentic AI system** using **Next.js, NVIDIA NIM API, and Telegram Bot API**, and deployed on **Vercel**.

---

## 🚀 Live Demo

- 🌐 **Web App:** [https://smart-assistant-psi.vercel.app/](https://smart-assistant-psi.vercel.app/)
- 🤖 **Telegram Bot:** [@smart_daily_assistant_bot](https://t.me/smart_daily_assistant_bot)

---

## 📌 Project Overview

This project demonstrates a **simple AI agent system** that can:

- Understand user intent
- Break down tasks into structured steps
- Prioritize actions (High / Medium / Low)
- Generate actionable daily plans
- Ask intelligent follow-up questions when needed

It is accessible via:
- 🌐 **Web Chat Interface** (centered glass‑morphism card on Vercel)
- 🤖 **Telegram Bot** (standalone Node.js process)

Both interfaces share the same AI backend logic (`lib/assistant.js`).

---

## ✨ Key Features

### 💬 Smart AI Assistant
- Natural language understanding
- Task decomposition into steps
- Priority-based planning
- Three response types: **plan**, **clarification**, **general**
- Context-aware follow-up questions
- Conversation memory (last 6 exchanges)

### 🌐 Web Chat Interface
- Elegant centered glass‑morphism card with animated background orbs
- Multi‑chat sidebar (slide‑out) — create, switch, and delete conversations
- Chats persist in localStorage
- Rich rendering: plans appear as styled task cards with color‑coded priorities (High‑red, Medium‑amber, Low‑emerald)
- General messages rendered with Markdown
- Typing indicator with animated bouncing dots
- Responsive design (mobile sidebar with overlay)

### 🤖 Telegram Bot Integration
- Same AI brain as web app (`lib/assistant.js`)
- In‑memory conversation history per user
- Plain‑text responses (no Markdown parsing issues)
- Lightweight and fast response system

---

## 🧠 AI Agent Capabilities

The system demonstrates strong **agentic behavior**, including:

- Goal interpretation with a structured system prompt
- Task breakdown into actionable steps with priorities
- Decision to ask a clarification question when critical information is missing
- Self‑healing JSON parsing (model gets a second chance to fix invalid JSON)
- Fallback to general text if JSON parsing ultimately fails

### Response Types

| Type | Trigger | Example |
|------|---------|---------|
| **plan** | User wants to organize tasks / set goals | Structured goal + steps with priorities |
| **clarification** | Missing critical info (time, context, details) | One clear follow‑up question |
| **general** | Greetings, facts, advice, casual chat | Natural, informative reply |

---

## 🏗️ System Architecture

```
User (Web / Telegram)
          │
          ▼
Next.js Frontend (Web UI)          Telegram Bot (Node.js)
          │                              │
          ▼                              ▼
Next.js API Route (/api/chat)      lib/assistant.js
          │                              │
          └──────────────┬───────────────┘
                         ▼
              NVIDIA NIM LLM API (Llama 3.1 8B)
                         │
                         ▼
              Structured AI Response (JSON)
                         │
          ┌──────────────┴───────────────┐
          ▼                              ▼
    Web UI Response              Telegram Bot Response
```

> **Key design decision:** `lib/assistant.js` is a shared module imported by both the Next.js API route and the standalone Telegram bot script. This ensures **identical AI behavior** across both interfaces.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (React) + Tailwind CSS |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes (server‑side) |
| **AI Model** | NVIDIA NIM — `meta/llama-3.1-8b-instruct` |
| **Telegram Bot** | `node-telegram-bot-api` (polling mode) |
| **Deployment** | Vercel (web) + Render/Railway (bot) |
| **Environment** | `dotenv` |

---

## 🔐 Security Implementation

This project follows secure coding practices:

| Practice | Implementation |
|----------|---------------|
| API keys in `.env` | Never committed to GitHub |
| `.gitignore` | Excludes `.env`, `.env.local`, `node_modules`, `.next` |
| No frontend secrets | AI calls happen exclusively in server‑side routes |
| Server‑side only | `lib/assistant.js` reads `process.env.NVIDIA_API_KEY` — never bundled for the browser |
| Vercel env vars | Encrypted at rest, injected at build time |
| `.env.example` | Placeholder values only — safe to commit |

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Haile4782/smart-assistant.git
cd smart-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

> **Get your NVIDIA API key** at [build.nvidia.com](https://build.nvidia.com/settings/api-keys) — free tier includes 40 requests/minute.

> **Get your Telegram bot token** from [@BotFather](https://t.me/botfather) — send `/newbot` and follow the prompts.

### 4. Run Development Server

```bash
npm run dev
```

Visit: [`http://localhost:3000`](http://localhost:3000)

---

## 🤖 Telegram Bot Setup

### Run Locally
```bash
node lib/telegram-bot.js
```

### Deploy to Render (Free — 24/7)
1. Sign up at [render.com](https://render.com)
2. Create a **Web Service** connected to this GitHub repo
3. **Build Command:** `npm install`
4. **Start Command:** `node lib/telegram-bot.js`
5. Add environment variables: `NVIDIA_API_KEY`, `TELEGRAM_BOT_TOKEN`
6. Deploy

> The free tier sleeps after 15 minutes of inactivity, but wakes automatically when a message arrives.

---

## 🌐 Deployment (Vercel)

1. Push project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repository
3. Add environment variables:
   - `NVIDIA_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
4. Click **Deploy**

---

## 📁 Project Structure

```
smart-assistant/
│
├── app/
│   ├── page.js                  # Manages chats, localStorage, passes props
│   ├── layout.js                # Root layout with metadata
│   ├── globals.css              # Tailwind directives + custom scrollbar
│   └── api/
│       └── chat/
│           └── route.js         # POST handler → calls lib/assistant.js
│
├── components/
│   └── ChatInterface.js         # Elite UI: centered card, sidebar, markdown rendering
│
├── lib/
│   ├── assistant.js             # Shared AI logic (NVIDIA NIM + JSON parsing)
│   └── telegram-bot.js          # Standalone Telegram bot (polling)
│
├── .env.example                 # Placeholder environment variables
├── .gitignore                   # Excludes secrets and build artifacts
├── jsconfig.json                # Path alias (@/) resolution
├── package.json
└── README.md
```

---

## 📊 Example Output

### Input:
```
Plan my study schedule for 3 days
```

### Output:
```
🎯 Goal: Create a structured 3-day study plan

1. [High] Identify all subjects and topics to cover
2. [High] Allocate specific time slots for each subject (morning/afternoon/evening)
3. [Medium] Add review sessions at the end of each day
4. [Medium] Include short breaks between study blocks
5. [Low] Set up a distraction-free study environment
```

> In the web UI, this appears as a styled task card with color‑coded priority badges.

---

## 🚀 Future Improvements

- [ ] Persistent chat history database (e.g., Firebase / Supabase)
- [ ] User authentication (Google login partially implemented)
- [ ] Calendar integration (Google Calendar API)
- [ ] Voice input/output
- [ ] Export plans as PDF / Markdown
- [ ] Deploy Telegram bot to cloud server (Render)

---

## 👨‍💻 Author

Developed by **Haiyleyesus Abayneh Belay**

---

## 📌 License

This project is for educational and assessment purposes only.
```
