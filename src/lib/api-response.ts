import { NextResponse } from 'next/server';

export class ApiResponse {
  static success(data: any, status = 200) {
    return NextResponse.json(data, { status });
  }

  static error(message: string, status = 500) {
    return NextResponse.json({ error: message }, { status });
  }
}
