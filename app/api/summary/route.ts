import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { content, lang } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "내용이 없습니다." }, { status: 400 });
    }

    // .env.local에 설정된 ANTHROPIC_AUTH_TOKEN 사용
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // 빠르고 효율적인 모델 사용
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `다음 뉴스 기사 내용을 3문장 이내의 핵심 포인트로 요약해줘. 
                     언어는 ${lang === 'ko' ? '한국어' : '영어'}로 작성해줘.
                     
                     기사 내용: ${content}`
          }
        ]
      })
    });

    const data = await response.json();
    const aiSummary = data.content[0].text;

    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error("AI 요약 오류:", error);
    return NextResponse.json({ error: "요약을 생성하는 중 오류가 발생했습니다." }, { status: 500 });
  }
}

