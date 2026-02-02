"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { ChatBubble } from "./ChatBubble";

interface ChatWindowProps {
  messages: Message[];
  userName: string;
  userId: string;
  onBack: () => void;
  showBack?: boolean;
  isUserMode?: boolean;
}

export function ChatWindow({
  messages,
  userName,
  userId,
  onBack,
  showBack = true,
  isUserMode = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 -ml-1 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Back"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 truncate">{userName}</h3>
          {userId && (
            <p className="text-[10px] text-slate-400 font-mono truncate">
              ID: {userId}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-2">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <p>No messages yet with this user</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} isUserMode={isUserMode} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
