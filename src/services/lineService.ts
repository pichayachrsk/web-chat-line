import { messagingApi, validateSignature, WebhookEvent } from "@line/bot-sdk";
import { lineConfig } from "@/config/line";
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
        const sourceId = event.source.userId || "unknown";
        const userIdForProfile = event.source.userId;
        let displayName: string | undefined;

        try {
          if (userIdForProfile) {
            const profile = await this.client.getProfile(userIdForProfile);
            displayName = profile.displayName;
          }
        } catch (error) {
          console.error("Failed to get user profile in webhook:", error);
        }

        await messageService.addMessage("line", text, sourceId, displayName);
      }
    }
  }

  public async getUserProfile(userId: string) {
    try {
      return await this.client.getProfile(userId);
    } catch (error) {
      console.error('Failed to get profile for ' + userId, error);
      return null;
    }
  }

  public async sendMessageToUser(text: string, toId: string) {
    if (!toId) {
      throw new Error("No target ID provided");
    }

    let displayName: string | undefined;
    try {
      const profile = await this.client.getProfile(toId);
      displayName = profile.displayName;
    } catch (error) {
      console.error("Failed to get profile during sendMessage:", error);
    }

    await this.client.pushMessage({
      to: toId,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    });

    return await messageService.addMessage("user", text, toId, displayName);
  }
}

export const lineService = new LineService();
