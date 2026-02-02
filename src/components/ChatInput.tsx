"use client";

import { useState, FormEvent } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  disabled,
}: ChatInputProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const message = inputText.trim();
    setInputText("");
    await onSendMessage(message);
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            disabled ? "Select a chat to start messaging" : "Type a message..."
          }
          disabled={disabled || isLoading}
          className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || isLoading || !inputText.trim()}
          className="bg-green-50 text-green-600 border border-green-200 px-4 md:px-6 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="hidden md:inline">Send</span>
              <svg
                className="w-5 h-5"
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
            </>
          )}
        </button>
      </form>
    </div>
  );
}
