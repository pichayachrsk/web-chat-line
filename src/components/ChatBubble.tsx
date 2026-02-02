import { Message } from "@/types";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isRightSide = message.sender === "user";

  return (
    <div className={`flex ${isRightSide ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
          isRightSide
            ? "bg-green-500 text-white rounded-tr-none"
            : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">
          {message.text}
        </p>
        <span className="text-[10px] opacity-70 mt-1 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
