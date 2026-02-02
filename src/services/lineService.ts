import { messagingApi, validateSignature, WebhookEvent } from "@line/bot-sdk";
import { lineConfig, targetUserId } from "@/config/line";
import { messageService } from "./messageService";

const { MessagingApiClient } = messagingApi;

class LineService {
  private client: messagingApi.MessagingApiClient;

  constructor() {
    this.client = new MessagingApiClient({
      channelAccessToken: lineConfig.channelAccessToken,
    });
  }

  public validateIncomingSignature(body: string, signature: string): boolean {
    return validateSignature(body, lineConfig.channelSecret, signature);
  }

  public async handleWebhook(events: WebhookEvent[]) {
    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const text = event.message.text;
        const userId = event.source.userId || "unknown";
        let displayName: string | undefined;

        try {
          if (userId !== "unknown") {
            const profile = await this.client.getProfile(userId);
            displayName = profile.displayName;
          }
        } catch (error) {
          console.error("Failed to get user profile in webhook:", error);
        }

        await messageService.addMessage("line", text, userId, displayName);
      }
    }
  }

  public async getUserProfile(userId: string) {
    try {
      return await this.client.getProfile(userId);
    } catch (error) {
      console.error(`Failed to get profile for ${userId}:`, error);
      return null;
    }
  }

  public async sendMessageToUser(text: string, toUserId?: string) {
    const finalUserId = toUserId || targetUserId;

    if (!finalUserId) {
      throw new Error(
        "No target user ID provided and LINE_USER_ID is not configured",
      );
    }

    let displayName: string | undefined;
    try {
      const profile = await this.client.getProfile(finalUserId);
      displayName = profile.displayName;
    } catch (error) {
      console.error("Failed to get profile during sendMessage:", error);
    }

    await this.client.pushMessage({
      to: finalUserId,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    });

    return await messageService.addMessage("user", text, finalUserId, displayName);
  }
}

export const lineService = new LineService();
