import { UserSession } from "@/types";

interface SidebarUserProps {
  user: UserSession;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onDelete: (userId: string, displayName: string) => void;
}

export function SidebarUser({
  user,
  isSelected,
  onSelect,
  onDelete,
}: SidebarUserProps) {
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(user.userId)}
        className={`w-full p-4 text-left border-b border-slate-100 transition-colors flex flex-col gap-1 pr-12 ${
          isSelected
            ? "bg-green-50 border-r-4 border-r-green-500"
            : "hover:bg-slate-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-800 truncate">
            {user.displayName}
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(user.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate">{user.lastMessage}</p>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(user.userId, user.displayName);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        title="Delete Chat"
      >
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
