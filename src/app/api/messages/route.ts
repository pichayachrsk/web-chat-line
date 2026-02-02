import { ApiResponse } from '@/lib/api-response';
import { messageService } from '@/services/messageService';

export async function GET() {
  const messages = await messageService.getMessages();
  return ApiResponse.success(messages);
}
