"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Load chats safely
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats") || "[]");

    const cleaned = saved.map((c) => ({
      ...c,
      messages: Array.isArray(c.messages) ? c.messages : [],
    }));

    if (cleaned.length) {
      setChats(cleaned);
      setActiveId(cleaned[0].id);
    } else {
      createNewChat();
    }
  }, []);

  // Save chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  const activeChat =
    chats.find((c) => c.id === activeId) || { messages: [] };

  const updateMessages = (newMessages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              messages: newMessages,
              title:
                chat.title === "New Chat" && newMessages.length > 0
                  ? newMessages[0].content.slice(0, 30)
                  : chat.title,
            }
          : chat
      )
    );
  };

  return (
  <div className="flex h-screen bg-[#0b0b1a]">
    
    {/* Sidebar */}
    <div className="w-72 bg-[#0f0f23] border-r border-white/10 p-4 flex flex-col">
      <button
        onClick={createNewChat}
        className="bg-indigo-600 p-3 rounded-lg mb-4"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveId(chat.id)}
            className={`p-3 rounded-lg cursor-pointer ${
              chat.id === activeId
                ? "bg-indigo-600"
                : "hover:bg-white/10"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>

    {/* MAIN CHAT */}
    <div className="flex-1 flex flex-col">
      <ChatInterface
        chat={activeChat.messages}
        setChat={updateMessages}
      />
      </div>
    </div>
  );
}