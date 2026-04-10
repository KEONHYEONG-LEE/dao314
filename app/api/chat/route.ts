import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history, contextNews } = await request.json();

    /**
     * [AI 엔진 연동 가이드]
     * 여기에 Google Gemini API나 OpenAI API를 연결합니다.
     * 지금은 구조적 프레임워크를 먼저 짜드릴게요.
     */

    // AI에게 줄 '페르소나' 설정
    const systemInstruction = `
      당신은 Global Pi News Room(GPNR)의 전문 어시스턴트입니다.
      사용자에게 최신 Pi Network 소식을 쉽고 정확하게 설명해야 합니다.
      현재 사용자가 보고 있는 뉴스 제목: "${contextNews?.title || '없음'}"
    `;

    // 실제 API 호출 전 시뮬레이션 답변
    const aiResponse = `안녕하세요! GPNR AI 어시스턴트입니다. 문의하신 "${message}"에 대해 분석 중입니다. 파이 네트워크의 ${contextNews?.category || '생태계'} 관련 최신 동향을 바탕으로 말씀드리면, 현재 오픈 메인넷 전환 속도가 매우 가속화되고 있습니다. 더 자세한 분석이 필요하신가요?`;

    return NextResponse.json({ 
      reply: aiResponse,
      status: 'success' 
    });

  } catch (error) {
    return NextResponse.json({ error: 'AI 연결 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
