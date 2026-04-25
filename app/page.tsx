"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    { role: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = message;

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      { role: "ai", text: data.reply },
    ]);

    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Smart Daily Assistant 🤖</h1>

      <div style={{ marginTop: 20 }}>
        {chat.map((c, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{c.role === "user" ? "You" : "AI"}:</b> {c.text}
          </div>
        ))}
      </div>

      {loading && <p>Thinking...</p>}

      <div style={{ marginTop: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "80%", padding: 10 }}
          placeholder="Type your task..."
        />

        <button
          onClick={sendMessage}
          style={{ padding: 10, marginLeft: 10 }}
        >
          Send
        </button>
      </div>
    </main>
  );
}