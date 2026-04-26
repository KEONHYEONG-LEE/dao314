import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';
import { Header } from '../components/Header';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* 구글 번역 설정 스크립트 */}
      <Script id="google-translate-config" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'ko,en',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-blue-500/30">
        {/* 공통 헤더: 여기서 딱 한 번만 선언합니다. */}
        <Header />
        
        {/* 본문 영역 */}
        <main>
          <Component {...pageProps} />
        </main>

        {/* 번역 위젯 숨김 요소 및 플로팅 버튼 */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
