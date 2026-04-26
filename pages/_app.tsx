import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';

import { Header } from '../components/Header';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* 구글 번역 UI 최적화 스타일 */}
        <style>{`
          .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame { display: none !important; }
          body { top: 0 !important; position: static !important; }
          #goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip { display: none !important; visibility: hidden !important; }
          .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        `}</style>
      </Head>

      {/* 1. Pi SDK 로드 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" 
      />

      {/* 2. 구글 번역 API 로드 및 초기화 스크립트 추가 */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en', // 기본 언어가 영어일 경우 (기사 원문 위주라면 en)
              includedLanguages: 'ko,en,zh-CN,ja', // 사용할 언어들
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true
            }, 'google_translate_element');
          }
        `}
      </Script>

      <div className="relative min-h-screen flex flex-col">
        {/* 공통 헤더: index.tsx 파일 안에 있는 <Header />는 삭제해야 중복이 안 생깁니다. */}
        <Header />

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        {/* 구글 번역기가 렌더링될 실제 요소 (숨김 처리 후 FloatingLanguageSwitcher에서 제어) */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
