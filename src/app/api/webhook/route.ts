import { NextRequest } from "next/server";
import { lineService } from "@/services/lineService";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    if (!lineService.validateIncomingSignature(body, signature)) {
      console.error("Webhook Error: Invalid Signature");
      return ApiResponse.error("Invalid signature", 401);
    }

    const payload = JSON.parse(body);
    await lineService.handleWebhook(payload.events);

    return ApiResponse.success({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return ApiResponse.error("Internal Server Error");
  }
}

/*
This is manual check for verifying webhook only
*/
export async function GET() {
  console.log("GET Webhook (Manual Check)");
  return ApiResponse.success({
    message: "Webhook is alive, but please use POST for LINE events.",
  });
}
