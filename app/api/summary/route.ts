import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { content, lang } = await request.json();
    
    // 항목 13: 직접 제공해주신 API KEY를 우선 사용하도록 설정
    const apiKey = "AIzaSyDTjfvDq3RADo1JWydG5r0HdmLOeeUmSeU"; 

    if (!apiKey) {
      return NextResponse.json({ summary: "API 키가 유효하지 않습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 성능과 속도 면에서 유리한 gemini-1.5-flash 모델 유지
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 항목 4 & 7: 5개 언어 대응 및 스마트 요약 프롬프트 수정
    const prompt = `
      You are a smart news assistant for GPNR. 
      Summarize the following news article within 3 concise bullet points.
      The summary MUST be written in the following language: ${lang}.
      
      Article Content:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // 에러 메시지 세분화 (한도 초과 시 안내)
    let errorMsg = "AI 요약 중 오류가 발생했습니다.";
    if (error.message?.includes("429")) {
      errorMsg = "현재 AI 요청이 너무 많습니다. 1분 후 다시 시도해주세요. (무료 한도 초과)";
    }
    
    return NextResponse.json({ summary: errorMsg });
  }
}
