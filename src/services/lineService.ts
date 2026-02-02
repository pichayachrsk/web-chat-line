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
        let displayName = "Unknown User";

        try {
          if (userId !== "unknown") {
            const profile = await this.client.getProfile(userId);
            displayName = profile.displayName;
          }
        } catch (error) {
          console.error("Failed to get user profile:", error);
        }

        await messageService.addMessage("line", text, userId, displayName);
      }
    }
  }

  public async sendMessageToUser(text: string, toUserId?: string) {
    const finalUserId = toUserId || targetUserId;

    if (!finalUserId) {
      throw new Error(
        "No target user ID provided and LINE_USER_ID is not configured",
      );
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

    return await messageService.addMessage("user", text, finalUserId);
  }
}

export const lineService = new LineService();
