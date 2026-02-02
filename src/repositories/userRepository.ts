import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserRepository {
  public static async ensureExists(userId: string, displayName?: string) {
    const isGenericName = !displayName || displayName === "User" || displayName === "Unknown User";
    
    const dataToInsert = {
      userId,
      displayName: displayName || "User",
    };

    return db
      .insert(users)
      .values(dataToInsert)
      .onConflictDoUpdate({
        target: users.userId,
        set: !isGenericName ? { displayName } : {},
      });
  }

  public static async deleteById(userId: string) {
    return db.delete(users).where(eq(users.userId, userId));
  }

  public static async getById(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.userId, userId),
    });
  }
}
