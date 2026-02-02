import { NextRequest } from 'next/server';
import { messageService } from '@/services/messageService';
import { lineService } from '@/services/lineService';
import { ApiResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();

    if (!text?.trim()) {
      return ApiResponse.error('Text is required', 400);
    }

    if (!userId) {
      return ApiResponse.error('User ID is required', 400);
    }

    let displayName: string | undefined;
    const profile = await lineService.getUserProfile(userId);
    if (profile) {
      displayName = profile.displayName;
    }

    const newMessage = await messageService.addMessage('line', text, userId, displayName);

    return ApiResponse.success({ status: 'received', message: newMessage });
  } catch (error: any) {
    console.error('Error receiving message:', error);
    return ApiResponse.error(error.message || 'Internal Server Error');
  }
}
