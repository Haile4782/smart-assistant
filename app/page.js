"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Load chats safely from localStorage
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

  // Save chats to localStorage whenever they change
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

  const activeChat = chats.find((c) => c.id === activeId) || { messages: [] };

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
    <div className="flex h-screen bg-[#0b0b1a] font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#0f0f23] border-r border-white/5 flex flex-col p-4">
        <button
          onClick={createNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl mb-6 shadow-lg shadow-indigo-500/20 transition-colors"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveId(chat.id)}
              className={`p-3 rounded-xl cursor-pointer text-sm text-gray-300 transition-colors ${
                chat.id === activeId
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5"
              }`}
            >
              {chat.title}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 text-gray-500 text-xs">
          Smart Daily Assistant
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface chat={activeChat.messages} setChat={updateMessages} />
      </div>
    </div>
  );
}