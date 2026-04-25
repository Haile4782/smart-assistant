"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatInterface({ chat = [], setChat }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    const updatedChat = [...chat, { role: "user", content: userMsg }];
    setChat(updatedChat);
    setLoading(true);

    try {
      const history = updatedChat.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });

      const data = await res.json();

      let reply = "";
      if (data.error) {
        reply = "⚠️ Something went wrong. Please try again.";
      } else if (data.type === "plan") {
        reply = `🎯 **Goal:** ${data.goal}\n`;
        data.steps.forEach((step, i) => {
          reply += `\n${i + 1}. [${step.priority}] ${step.step}`;
        });
      } else if (data.type === "clarification") {
        reply = data.question;
      } else if (data.type === "general") {
        reply = data.text;
      } else {
        reply = data.rawText || "I couldn't process that. Could you rephrase?";
      }

      setChat([...updatedChat, { role: "assistant", content: reply }]);
    } catch (err) {
      setChat([...updatedChat, { role: "assistant", content: "❌ Failed to reach the assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e20]">
      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-[#12122a]">
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-[#12122a]"></div>
        </div>
        <div>
          <h1 className="text-white text-lg font-semibold leading-tight">Smart Daily Assistant</h1>
          <p className="text-white/40 text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online · NVIDIA AI
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
        {chat.map((msg, i) => (
          <div key={i} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
              msg.role === "user"
                ? "bg-gradient-to-br from-violet-400 to-fuchsia-500"
                : "bg-gradient-to-br from-emerald-400 to-teal-500"
            }`}>
              <span className="text-white text-xs font-bold">{msg.role === "user" ? "You" : "AI"}</span>
            </div>
            {/* Bubble */}
            <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-lg ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-tr-lg"
                : "bg-[#1e1e3a] text-gray-100 rounded-tl-lg border border-white/5"
            }`}>
              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="max-w-[70%] px-5 py-3 rounded-2xl bg-[#1e1e3a] border border-white/5 rounded-tl-lg">
              <div className="flex space-x-1.5">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="border-t border-white/5 bg-[#12122a] px-6 py-4">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... I'm here to help ✨"
            className="flex-1 bg-[#1a1a34] border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Send
          </button>
        </form>
      </div>

      {/* Custom scrollbar (global injection) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}