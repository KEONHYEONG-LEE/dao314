import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* 파이 SDK 스크립트 유지 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
        {/* [중복 해결] 여기서 <Header />를 지웠습니다! 
          헤더는 메인 카테고리 상태값(activeCategory)과 유기적으로 동기화되어야 하므로, 
          틀 역할인 _app.tsx가 아닌 pages/index.tsx 내부에만 렌더링하는 것이 구조적으로 정확합니다.
        */}
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}
