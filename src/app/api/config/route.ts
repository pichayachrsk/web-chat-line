import { ApiResponse } from '@/lib/api-response';
import { targetUserId } from '@/config/line';

export async function GET() {
  return ApiResponse.success({ defaultUserId: targetUserId });
}
