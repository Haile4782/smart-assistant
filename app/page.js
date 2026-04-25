"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.reply || "No response" },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI service error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        🤖 Smart Daily Assistant
      </div>

      {/* CHAT */}
      <div style={styles.chatContainer}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: c.role === "user" ? "flex-end" : "flex-start",
              background: c.role === "user" ? "#2563eb" : "#1f2937",
              color: "white",
            }}
          >
            {c.text}
          </div>
        ))}

        {loading && (
          <div style={styles.typing}>
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, #0f172a, #020617)",
    color: "white",
    fontFamily: "Arial",
  },

  header: {
    padding: 18,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderBottom: "1px solid #1f2937",
  },

  chatContainer: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  bubble: {
    padding: 12,
    borderRadius: 14,
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.4,
  },

  typing: {
    fontStyle: "italic",
    opacity: 0.6,
  },

  inputBar: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid #1f2937",
    gap: 10,
    background: "#0b1220",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #334155",
    outline: "none",
    background: "#111827",
    color: "white",
  },

  button: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};