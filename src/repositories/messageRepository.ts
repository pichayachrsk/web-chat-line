import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Message } from "@/types";

export class MessageRepository {
  public static async getAll(): Promise<Message[]> {
    const results = await db.query.messages.findMany({
      orderBy: [asc(messages.timestamp)],
      with: {
        user: true,
      },
      limit: 1000,
    });

    return results.map((m) => ({
      id: m.id,
      sender: m.sender as "user" | "line",
      text: m.text,
      timestamp: m.timestamp.getTime(),
      userId: m.userId,
      displayName: m.user?.displayName || undefined,
    }));
  }

  public static async create(data: {
    sender: "user" | "line";
    text: string;
    userId: string;
  }): Promise<Message> {
    const [inserted] = await db.insert(messages).values(data).returning();

    const user = await db.query.users.findFirst({
      where: eq(users.userId, data.userId),
    });

    return {
      id: inserted.id,
      sender: inserted.sender as "user" | "line",
      text: inserted.text,
      timestamp: inserted.timestamp.getTime(),
      userId: inserted.userId,
      displayName: user?.displayName || undefined,
    };
  }

  public static async deleteByUserId(userId: string) {
    return db.delete(messages).where(eq(messages.userId, userId));
  }
}
