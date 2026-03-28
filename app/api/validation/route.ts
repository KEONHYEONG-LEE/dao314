import { NextResponse } from 'next/server';

export async function GET() {
  // Pi Network 도메인 검증을 위한 응답입니다.
  // 실제 검증 값은 Pi 개발자 포털에서 제공하는 가이드를 따를 수 있습니다.
  return NextResponse.json({ 
    status: "success",
    message: "Pi Network Domain Validation Active" 
  });
}
