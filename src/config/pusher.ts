export const pusherConfig = {
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
};

const isServer = typeof window === "undefined";

if (isServer) {
  if (!pusherConfig.appId || !pusherConfig.key || !pusherConfig.secret || !pusherConfig.cluster) {
    console.warn("Pusher Server configuration missing. Real-time broadcast will not work.");
  }
} else {
  if (!pusherConfig.key || !pusherConfig.cluster) {
    console.warn("Pusher Client configuration missing. Real-time subscription will not work.");
  }
}
