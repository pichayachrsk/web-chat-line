"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Message, UserSession } from "@/types";
import { SidebarUser } from "@/components/SidebarUser";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { API_ROUTES } from "@/config/api";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [defaultUserId, setDefaultUserId] = useState<string | null>(null);
  const [isUserMode, setIsUserMode] = useState(true);

  const users = useMemo(() => {
    const userMap: Record<string, UserSession> = {};

    messages.forEach((msg) => {
      const existing = userMap[msg.userId];
      let newDisplayName =
        existing?.displayName || msg.displayName || "Unknown User";

      if (
        msg.sender === "line" &&
        msg.displayName &&
        !["Unknown User"].includes(msg.displayName)
      ) {
        newDisplayName = msg.displayName;
      }

      if (!existing || msg.timestamp > existing.timestamp) {
        userMap[msg.userId] = {
          userId: msg.userId,
          displayName: newDisplayName,
          lastMessage: msg.text,
          timestamp: msg.timestamp,
        };
      } else {
        userMap[msg.userId].displayName = newDisplayName;
      }
    });

    return Object.values(userMap).sort((a, b) => b.timestamp - a.timestamp);
  }, [messages, defaultUserId]);

  const activeChatMessages = useMemo(() => {
    if (!selectedUserId) return [];
    return messages.filter((m) => m.userId === selectedUserId);
  }, [messages, selectedUserId]);

  const updateMessagesSafely = (newMessage: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [configRes, msgRes] = await Promise.all([
          axios.get(API_ROUTES.CONFIG),
          axios.get(API_ROUTES.MESSAGES),
        ]);

        if (configRes.data.defaultUserId) {
          setDefaultUserId(configRes.data.defaultUserId);
          setSelectedUserId((prev) => prev || configRes.data.defaultUserId);
        }
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    init();

    const eventSource = new EventSource(API_ROUTES.MESSAGES_STREAM);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (!data.connected) updateMessagesSafely(data);
      } catch (err) {
        console.error("SSE data parse error:", err);
      }
    };

    return () => eventSource.close();
  }, []);

  const toggleMode = () => {
    setIsUserMode((prev) => {
      const next = !prev;
      if (next && defaultUserId) {
        setSelectedUserId(defaultUserId);
      }
      return next;
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const endpoint = isUserMode
        ? API_ROUTES.RECEIVE_MESSAGE
        : API_ROUTES.SEND_MESSAGE;
      const res = await axios.post(endpoint, { text, userId: selectedUserId });
      if (res.data.message) updateMessagesSafely(res.data.message);
    } catch (err) {
      console.error("Send failed:", err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (userId: string, displayName: string) => {
    if (!confirm(`Delete chat for ${displayName}?`)) return;
    try {
      await axios.delete(API_ROUTES.USERS(userId));
      setMessages((prev) => prev.filter((m) => m.userId !== userId));
      if (selectedUserId === userId) setSelectedUserId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete chat.");
    }
  };

  const selectedUser = users.find((u) => u.userId === selectedUserId);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans antialiased text-slate-900">
      <header className="bg-green-600 text-white px-4 md:px-6 py-3 md:py-4 shadow-lg z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">
            {isUserMode ? "User Console" : "WebChat Admin Console"}
          </h1>
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70 font-semibold">
            CRM System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-green-700/50 p-1 rounded-lg">
            <button
              onClick={() => setIsUserMode(false)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${!isUserMode ? "bg-white text-green-700 shadow-sm" : "text-green-100"}`}
            >
              ADMIN
            </button>
            <button
              onClick={toggleMode}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${isUserMode ? "bg-white text-green-700 shadow-sm" : "text-green-100"}`}
            >
              USER
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {!isUserMode && (
          <aside
            className={`absolute inset-0 z-10 md:relative md:inset-auto w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shadow-inner transition-transform duration-300 ${
              selectedUserId
                ? "-translate-x-full md:translate-x-0"
                : "translate-x-0"
            }`}
          >
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-600 uppercase text-xs tracking-wider">
                Active Chats
              </h2>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {users.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <svg
                    className="w-10 h-10 mx-auto opacity-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                users.map((user) => (
                  <SidebarUser
                    key={user.userId}
                    user={user}
                    isSelected={selectedUserId === user.userId}
                    onSelect={setSelectedUserId}
                    onDelete={handleDeleteChat}
                  />
                ))
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {!selectedUserId ? (
            <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-4 text-slate-400">
              <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center border border-slate-100">
                <svg
                  className="w-10 h-10 text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.233L3 20l1.341-4.022A9.006 9.006 0 014 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-500">
                  Welcome to Chat Console
                </p>
                <p className="text-xs">
                  Select a conversation to start replying
                </p>
              </div>
            </div>
          ) : (
            <>
              <ChatWindow
                messages={activeChatMessages}
                userName={
                  isUserMode
                    ? "WebChat OA (Official)"
                    : selectedUser?.displayName || "User"
                }
                userId={isUserMode ? (defaultUserId || "") : selectedUserId}
                onBack={() => setSelectedUserId(null)}
                showBack={!isUserMode}
                isUserMode={isUserMode}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={loading}
                disabled={!selectedUserId}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
