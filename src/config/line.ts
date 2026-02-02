export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

export const targetUserId = process.env.LINE_USER_ID || "";

if (!lineConfig.channelAccessToken || !lineConfig.channelSecret) {
  console.warn(
    "LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_SECRET is missing in environment variables",
  );
}
