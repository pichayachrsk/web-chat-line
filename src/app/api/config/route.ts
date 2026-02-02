import { ApiResponse } from '@/lib/api-response';

export async function GET() {
  return ApiResponse.success({ status: 'ok' });
}
