export const pusherConfig = {
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
};

if (!pusherConfig.appId || !pusherConfig.key || !pusherConfig.secret || !pusherConfig.cluster) {
  console.warn(
    "Pusher environment variables are missing. Real-time updates will not work.",
  );
}
