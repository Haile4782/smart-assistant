"use client";

import { useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar({
  chats,
  activeId,
  setActiveId,
  createNewChat,
}) {
  const [user, setUser] = useState(null);

  // 🔐 Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 🔑 Login
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="w-72 bg-[#0f172a] border-r border-white/10 flex flex-col h-full">

      {/* TOP */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <button
          onClick={createNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          + New Chat
        </button>

        {/* Auth Section */}
        {!user ? (
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Login with Google
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt="user"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 text-xs">
              <p className="text-white font-medium truncate">
                {user.displayName}
              </p>
              <p className="text-white/40 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chats.length === 0 && (
          <p className="text-white/40 text-xs text-center mt-4">
            No conversations yet
          </p>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveId(chat.id)}
            className={`group p-3 rounded-lg cursor-pointer text-sm transition-all flex items-center justify-between ${
              activeId === chat.id
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span className="truncate">
              {chat.title || "New Chat"}
            </span>

            {/* subtle hover indicator */}
            <span className="opacity-0 group-hover:opacity-100 text-xs text-white/40">
              →
            </span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10 text-xs text-white/40 flex justify-between items-center">
        <span>Smart Assistant ⚡</span>
        <span className="text-white/20">v1.0</span>
      </div>
    </div>
  );
}