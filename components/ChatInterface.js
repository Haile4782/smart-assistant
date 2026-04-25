"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Plus, MessageSquare, Send, Bot, User, Trash2 } from "lucide-react";

export default function ChatInterface({
  chats = [],
  activeId,
  activeChat = { messages: [] },
  onNewChat,
  onSelectChat,
  onUpdateMessages,
  onDeleteChat,
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    const updatedChat = [...activeChat.messages, { role: "user", content: userMsg }];
    onUpdateMessages(updatedChat);
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

      // Format based on response type
      let reply = "";
      if (data.error) {
        reply = `⚠️ ${data.error}`;
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
        reply = data.rawText || "I couldn't process that.";
      }

      onUpdateMessages([...updatedChat, { role: "assistant", content: reply }]);
    } catch (err) {
      onUpdateMessages([...updatedChat, { role: "assistant", content: "❌ Connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-200 overflow-hidden font-sans">
      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0c0e] border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 w-full p-2.5 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          <p className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-2">
            History
          </p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                setIsSidebarOpen(false);
              }}
              className={`group flex items-center justify-between px-2 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                chat.id === activeId
                  ? "bg-zinc-800/80 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">{chat.title || "New Chat"}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-700 rounded transition-all"
              >
                <Trash2 size={12} className="text-zinc-500 hover:text-red-400" />
              </button>
            </div>
          ))}
          {chats.length === 0 && (
            <p className="px-2 text-xs text-zinc-600 mt-4">No conversations yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 text-[10px] text-zinc-600 text-center">
          Smart Daily Assistant
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* MOBILE HEADER */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-zinc-800 rounded"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-medium">Assistant</span>
          <div className="w-8" />
        </header>

        {/* DESKTOP STATUS BAR */}
        <div className="hidden lg:flex items-center justify-end px-6 py-2 text-[10px] text-zinc-500 gap-4 border-b border-zinc-800/50">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
          </span>
          <span>Powered by NVIDIA AI</span>
        </div>

        {/* CHAT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
            {/* Empty State */}
            {activeChat.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-purple-500/20">
                  <Bot className="text-white" size={28} />
                </div>
                <h2 className="text-xl font-semibold text-white">How can I assist you?</h2>
                <p className="text-zinc-500 text-sm max-w-sm">
                  I can help with daily planning, task prioritization, or answering questions.
                </p>
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {["Plan my day", "Study schedule", "Task prioritization"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        // Auto-submit after a tiny delay
                        setTimeout(() => sendMessage({ preventDefault: () => {} }), 100);
                      }}
                      className="px-3 py-1.5 text-xs border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {activeChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-zinc-200"
                      : "bg-gradient-to-br from-emerald-400 to-teal-500"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={16} className="text-black" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex gap-1 items-center px-4 py-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* INPUT AREA */}
        <footer className="p-4 bg-[#09090b]">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 text-center mt-3 uppercase tracking-tight">
            Powered by NVIDIA AI · Llama 3.1
          </p>
        </footer>
      </div>

      {/* OVERLAY for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}