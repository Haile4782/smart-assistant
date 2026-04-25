"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Plus, MessageSquare, Send, Bot, User, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, loading]);

  // 🎨 Helper to render a plan as a beautiful task card
  const renderPlan = (goal, steps) => {
    const priorityColors = {
      High: "text-red-400 bg-red-400/10 border-red-400/30",
      Medium: "text-amber-400 bg-amber-400/10 border-amber-400/30",
      Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    };

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span> {goal}
        </h3>
        <ul className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center mt-0.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
              <div className="flex-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                    priorityColors[step.priority] || priorityColors.Medium
                  }`}
                >
                  {step.priority}
                </span>
                <p className="text-white/90 text-sm mt-1">{step.step}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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

      let reply = "";
      if (data.error) {
        reply = `⚠️ ${data.error}`;
      } else if (data.type === "plan") {
        // We'll store the raw goal/steps in content for later rendering
        reply = JSON.stringify({ type: "plan", goal: data.goal, steps: data.steps });
      } else if (data.type === "clarification") {
        reply = data.question;   // plain text, will be rendered with markdown
      } else if (data.type === "general") {
        reply = data.text;       // rendered with markdown
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

  const handleSelectChat = (id) => {
    onSelectChat(id);
    setSidebarOpen(false);
  };

  // Renders a single message – detects if it's a stored plan object
  const renderMessageContent = (msg) => {
    if (msg.role !== "assistant") {
      return <p className="text-sm whitespace-pre-wrap">{msg.content}</p>;
    }

    // Check if the content is a serialized plan (we stored JSON)
    try {
      const parsed = JSON.parse(msg.content);
      if (parsed.type === "plan" && parsed.goal && parsed.steps) {
        return renderPlan(parsed.goal, parsed.steps);
      }
    } catch (e) {
      // Not JSON, render as markdown
    }

    // For everything else, use ReactMarkdown
    return (
      <div className="prose prose-invert max-w-none text-sm">
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a1a] font-sans">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c0c0e]/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ... sidebar content (unchanged) ... */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
            History
          </p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
                chat.id === activeId
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
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
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity"
              >
                <Trash2 size={14} className="text-white/50 hover:text-red-400" />
              </button>
            </div>
          ))}
          {chats.length === 0 && (
            <p className="px-2 text-xs text-white/30 mt-4">No conversations yet</p>
          )}
        </div>

        <div className="p-4 border-t border-white/10 text-[10px] text-white/40 text-center">
          Smart Daily Assistant
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 py-6">
        <div className="w-full max-w-4xl h-full flex flex-col bg-[#111122]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow shadow-purple-500/30">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-white text-sm font-semibold leading-tight">Smart Daily Assistant</h1>
                <p className="text-white/40 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Your personal AI helper
                </p>
              </div>
            </div>
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
            {activeChat.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Bot className="text-white" size={30} />
                </div>
                <h2 className="text-xl font-semibold text-white">How can I assist you?</h2>
                <p className="text-white/50 text-sm max-w-xs">
                  I can help with daily planning, task prioritization, or answering questions.
                </p>
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {["Plan my day", "Study schedule", "Prioritize tasks"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        setTimeout(() => sendMessage({ preventDefault: () => {} }), 100);
                      }}
                      className="px-3 py-1.5 text-xs border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white/40 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl shadow-md ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md px-4 py-3"
                      : "bg-transparent p-0"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    renderMessageContent(msg)
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/5">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/5 p-4">
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-12 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[10px] text-white/30 text-center mt-3 uppercase tracking-tight">
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 8px; }
      `}</style>
    </div>
  );
}