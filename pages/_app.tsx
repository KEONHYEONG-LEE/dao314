import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';

// 경로 에러를 방지하기 위해 상대 경로(../)로 설정했습니다.
import { Header } from '../components/Header';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* 구글 번역 시 발생하는 레이아웃 틀어짐 및 팝업 방지를 위한 스타일 인라인 삽입 */}
        <style>{`
          /* 구글 번역 상단 바 강제 숨김 */
          .goog-te-banner-frame.skiptranslate,
          .goog-te-banner-frame,
          .skiptranslate {
            display: none !important;
          }
          
          /* 번역 시 body가 아래로 밀리는 현상 방지 */
          body {
            top: 0 !important;
            position: static !important;
          }

          /* 마우스 오버 시 나타나는 원본 텍스트 팝업 차단 */
          #goog-gt-tt, 
          .goog-te-balloon-frame, 
          .goog-tooltip, 
          .goog-tooltip:hover {
            display: none !important;
            visibility: hidden !important;
          }

          /* 번역 강조 하이라이트 효과 제거 */
          .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `}</style>
      </Head>

      {/* Pi SDK 로드 최적화 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" 
      />

      {/* 전체 컨테이너에 'notranslate'를 넣지 않는 이유는 실제 번역은 되어야 하기 때문입니다. 
         대신 UI 요소가 밀리지 않도록 relative 설정을 유지합니다.
      */}
      <div className="relative min-h-screen flex flex-col">
        {/* 상단 헤더 */}
        <Header />

        {/* 페이지 본문 */}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        {/* 하단 플로팅 번역 버튼 (고정 위치) */}
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
