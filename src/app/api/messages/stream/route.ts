import { NextRequest } from "next/server";
import { messageService } from "@/services/messageService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        try {
          const payload = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (e) {
          console.error("SSE Enqueue Error:", e);
        }
      };

      sendEvent({ connected: true });

      // Keep track of the last message timestamp we've sent
      let lastTimestamp = Date.now();

      // Check for new messages from the database every 2 seconds
      // This is necessary for Serverless environments (like Vercel)
      // where instances don't share memory for traditional event emitters.
      const pollInterval = setInterval(async () => {
        try {
          const messages = await messageService.getMessages();
          const newMessages = messages.filter(
            (m) => new Date(m.timestamp).getTime() > lastTimestamp
          );

          if (newMessages.length > 0) {
            newMessages.forEach((m) => {
              sendEvent(m);
              const ts = new Date(m.timestamp).getTime();
              if (ts > lastTimestamp) lastTimestamp = ts;
            });
          }
        } catch (error) {
          console.error("SSE Polling Error:", error);
        }
      }, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(pollInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
