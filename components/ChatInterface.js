"use client";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Plus, MessageSquare, Send, Bot, User, Settings, Mic, MicOff } from "lucide-react";

export default function ChatInterface({ chat = [], setChat }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one sentence for a "clean" feel
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

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
      const history = updatedChat.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await res.json();
      setChat([...updatedChat, { role: "assistant", content: data.text || "Thinking..." }]);
    } catch (err) {
      setChat([...updatedChat, { role: "assistant", content: "❌ Connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-200 overflow-hidden font-sans">
      {/* SIDEBAR (Stays the same) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0c0e] border-r border-zinc-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 mb-6 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white transition-colors text-xs font-bold uppercase tracking-tighter">
            <Plus size={14} /> New Session
          </button>
          <div className="flex-1 overflow-y-auto space-y-1">
            <p className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Recent Conversations</p>
            {["Strategy Draft", "Refactoring UI", "Email Response"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg cursor-pointer transition-all">
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 lg:border-none">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Neural Engine Active</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
            {chat.map((msg, i) => (
              <div key={i} className={`flex gap-5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${msg.role === "user" ? "bg-zinc-100 border-zinc-100" : "bg-zinc-900 border-zinc-800"}`}>
                  {msg.role === "user" ? <User size={14} className="text-zinc-900" /> : <Bot size={14} className="text-zinc-400" />}
                </div>
                <div className={`max-w-[85%] text-sm leading-7 ${msg.role === "user" ? "text-zinc-100 font-medium" : "text-zinc-400"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* REFINED INPUT WITH VOICE */}
        <footer className="p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative flex items-center gap-3">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Tell me what's on your mind..."}
                className={`w-full bg-[#121214] border rounded-2xl pl-5 pr-24 py-4 text-sm transition-all shadow-2xl ${
                  isListening ? "border-red-500/50 ring-1 ring-red-500/20" : "border-zinc-800 focus:border-zinc-500 focus:ring-0"
                }`}
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Voice Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${
                    isListening ? "bg-red-500/10 text-red-500 animate-pulse" : "text-zinc-500 hover:text-white"
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2 bg-zinc-100 text-zinc-900 rounded-xl hover:bg-white disabled:opacity-20 transition-all ml-1"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
          <p className="text-[9px] text-zinc-700 text-center mt-4 tracking-widest uppercase font-bold">Personalized Intelligence Platform</p>
        </footer>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
      `}</style>
    </div>
  );
}
