import { useEffect } from "react";
import Pusher from "pusher-js";
import { Message } from "@/types";
import { pusherConfig } from "@/config/pusher";

export function useChatRealtime(onNewMessage: (message: Message) => void) {
  useEffect(() => {
    if (!pusherConfig.key || !pusherConfig.cluster) {
      console.warn("Pusher config missing, real-time updates disabled.");
      return;
    }

    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
    });

    const channel = pusher.subscribe("chat-channel");

    channel.bind("new-message", (data: Message) => {
      onNewMessage(data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("chat-channel");
      pusher.disconnect();
    };
  }, [onNewMessage]);
}
