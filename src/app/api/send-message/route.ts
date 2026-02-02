import { NextRequest } from 'next/server';
import { lineService } from '@/services/lineService';
import { ApiResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();

    if (!text?.trim()) {
      return ApiResponse.error('Text is required', 400);
    }

    const newMessage = await lineService.sendMessageToUser(text, userId);

    return ApiResponse.success({ status: 'sent', message: newMessage });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return ApiResponse.error(error.message || 'Internal Server Error');
  }
}
