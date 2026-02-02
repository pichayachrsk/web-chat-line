export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

if (!lineConfig.channelAccessToken || !lineConfig.channelSecret) {
  console.warn(
    "LINE_CHANNEL_ACCESS_TOKEN or LINE_CHANNEL_SECRET is missing in environment variables",
  );
}
