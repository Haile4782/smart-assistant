"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

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
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: userMsg,
        history: updatedChat.slice(-6),
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let aiText = "";
    let tempChat = [...updatedChat, { role: "assistant", content: "" }];
    setChat(tempChat);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiText += decoder.decode(value);

      tempChat[tempChat.length - 1].content = aiText;
      setChat([...tempChat]);
    }
    } catch {
    setChat([
      ...updatedChat,
      { role: "assistant", content: "❌ Streaming failed" },
    ]);
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0b0b1a] to-[#111133]">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5">
        <h1 className="text-lg font-semibold tracking-wide">
          Smart Daily Assistant
        </h1>
        <p className="text-xs text-gray-400">
          AI-powered planning & productivity
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {Array.isArray(chat) &&
          chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed
                  shadow-md backdrop-blur-md
                  ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-md"
                  }
                `}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

        {loading && (
          <div className="text-gray-400 text-sm animate-pulse">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-white/10 bg-[#0b0b1a]/80 backdrop-blur-md">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="
              flex-1 px-4 py-3 rounded-xl 
              bg-white/5 border border-white/10
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition-all
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              px-6 py-3 rounded-xl 
              bg-indigo-600 hover:bg-indigo-700
              text-white font-medium
              shadow-lg transition-all
              disabled:opacity-50
            "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}