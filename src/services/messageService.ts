import { Message } from "@/types";
import { MessageRepository } from "@/repositories/messageRepository";
import { UserRepository } from "@/repositories/userRepository";
import Pusher from "pusher";
import { pusherConfig } from "@/config/pusher";

type MessageListener = (message: Message) => void;

class MessageService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: pusherConfig.appId,
      key: pusherConfig.key,
      secret: pusherConfig.secret,
      cluster: pusherConfig.cluster,
      useTLS: true,
    });
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

  private async notifyListeners(message: Message) {
    try {
      await this.pusher.trigger("chat-channel", "new-message", message);
    } catch (error) {
      console.error("[MessageService] Pusher trigger error:", error);
    }
  }
}

export const messageService = new MessageService();
