"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "⚠️ No response" },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "Inter, Arial"
    }}>

      {/* SIDEBAR (SaaS feel) */}
      <div style={{
        width: 250,
        background: "#111827",
        color: "white",
        padding: 20
      }}>
        <h2>🤖 Smart AI</h2>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Your personal assistant
        </p>
      </div>

      {/* MAIN CHAT AREA */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>

        {/* CHAT BOX */}
        <div style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          background: "#f9fafb"
        }}>

          {chat.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: c.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12
              }}
            >
              <div style={{
                maxWidth: "70%",
                padding: 14,
                borderRadius: 12,
                background: c.role === "user" ? "#2563eb" : "white",
                color: c.role === "user" ? "white" : "black",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
              }}>
                {c.role === "ai" ? (
                  <ReactMarkdown>{c.text}</ReactMarkdown>
                ) : (
                  c.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ padding: 10, opacity: 0.6 }}>
              🤔 AI is thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR */}
        <div style={{
          padding: 15,
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: 10,
          background: "white"
        }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}