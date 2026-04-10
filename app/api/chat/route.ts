import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, contextNews } = await request.json();

    const aiResponse = `안녕하세요! GPNR AI 어시스턴트입니다. 문의하신 "${message}"에 대해 분석 중입니다. 파이 네트워크의 ${contextNews?.category || '생태계'} 관련 최신 동향을 바탕으로 말씀드리면, 현재 오픈 메인넷 전환 속도가 가속화되고 있습니다.`;

    return NextResponse.json({ reply: aiResponse, status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'AI 연결 중 오류 발생' }, { status: 500 });
  }
}
