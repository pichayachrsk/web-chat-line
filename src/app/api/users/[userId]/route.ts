import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api-response';
import { messageService } from '@/services/messageService';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await messageService.deleteUserChat(userId);
    return ApiResponse.success({ status: 'success' });
  } catch (error: any) {
    console.error('Error deleting user chat:', error);
    return ApiResponse.error(error.message || 'Internal Server Error');
  }
}
