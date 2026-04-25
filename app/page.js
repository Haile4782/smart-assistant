"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Load chats from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("assistant_chats") || "[]");
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

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length) localStorage.setItem("assistant_chats", JSON.stringify(chats));
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

  const activeChat = chats.find((c) => c.id === activeId) || { id: null, messages: [] };

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

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      if (remaining.length) setActiveId(remaining[0].id);
      else createNewChat();
    }
  };

  return (
    <ChatInterface
      chats={chats}
      activeId={activeId}
      activeChat={activeChat}
      onNewChat={createNewChat}
      onSelectChat={setActiveId}
      onUpdateMessages={updateMessages}
      onDeleteChat={deleteChat}
    />
  );
}