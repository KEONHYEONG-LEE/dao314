import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';
import { Header } from '@/components/Header'; // Header 임포트
import { FloatingLanguageSwitcher } from '@/components/FloatingLanguageSwitcher'; // 새로 만든 컴포넌트 임포트

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /> 
      </Head>

      {/* Pi SDK 로드 최적화 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" 
      />

      {/* 1. 공통 헤더 (이제 모든 페이지에 나옵니다) */}
      <Header />

      {/* 2. 각 페이지 내용 */}
      <Component {...pageProps} />

      {/* 3. 하단 고정 번역 버튼 (상단바와 충돌 없이 바닥에 표시) */}
      <FloatingLanguageSwitcher />
      
    </ThemeProvider>
  );
}
