export type MessageSender = 'user' | 'line';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  userId: string;
  displayName?: string;
}

export interface UserSession {
  userId: string;
  displayName: string;
  lastMessage: string;
  timestamp: number;
}
