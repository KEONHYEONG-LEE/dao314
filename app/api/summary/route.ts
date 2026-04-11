import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { content, lang } = await request.json();

    // 토큰이 정상적으로 로드되었는지 확인
    const apiKey = process.env.ANTHROPIC_AUTH_TOKEN;
    
    if (!apiKey) {
      return NextResponse.json({ summary: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `다음 기사 내용을 ${lang === 'ko' ? '한국어' : '영어'}로 3문장 요약해줘: ${content}`
        }]
      })
    });

    const data = await response.json();
    
    if (data.content && data.content[0]) {
      return NextResponse.json({ summary: data.content[0].text });
    } else {
      throw new Error("Invalid AI Response");
    }
  } catch (error) {
    return NextResponse.json({ summary: "요약 생성 중 오류가 발생했습니다. 다시 시도해 주세요." });
  }
}
