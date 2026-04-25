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
      </Head>

      {/* Pi SDK 로드 최적화 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="beforeInteractive" 
      />

      {/* 모든 페이지 공통 레이아웃 */}
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
