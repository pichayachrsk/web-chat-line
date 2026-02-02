import { Message } from "@/types";
import { MessageRepository } from "@/repositories/messageRepository";
import { UserRepository } from "@/repositories/userRepository";

type MessageListener = (message: Message) => void;

class MessageService {
  private static instance: MessageService;
  private listeners: Set<MessageListener> = new Set();

  private constructor() {}

  public static getInstance(): MessageService {
    if (process.env.NODE_ENV === "development") {
      const g = global as any;
      if (!g.messageServiceInstance) {
        g.messageServiceInstance = new MessageService();
      }
      return g.messageServiceInstance;
    }

    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  public subscribe(listener: MessageListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async getMessages(): Promise<Message[]> {
    return MessageRepository.getAll();
  }

  public async addMessage(
    sender: "user" | "line",
    text: string,
    userId: string,
    displayName?: string,
  ): Promise<Message> {
    await UserRepository.ensureExists(userId, displayName);

    const newMessage = await MessageRepository.create({ sender, text, userId });

    this.notifyListeners(newMessage);

    return newMessage;
  }

  public async deleteUserChat(userId: string): Promise<void> {
    await MessageRepository.deleteByUserId(userId);
    await UserRepository.deleteById(userId);
  }

  private notifyListeners(message: Message) {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error("[MessageService] Error notifying listener:", error);
      }
    });
  }
}

export const messageService = MessageService.getInstance();
