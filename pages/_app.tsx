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

      {/* 구글 번역 설정 스크립트: 잔상 제거 최적화 */}
      <Script id="google-translate-config" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'ko,en',
              autoDisplay: false
              // layout 옵션을 삭제하여 기본 툴바 생성을 차단합니다.
            }, 'google_translate_element');
          }
        `}
      </Script>
      <Script 
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-blue-500/30">
        {/* 공통 헤더: 여기서 딱 한 번만 선언하여 중복을 방지합니다. */}
        <Header />
        
        {/* 본문 영역: Component가 중복되지 않도록 깔끔하게 배치합니다. */}
        <main>
          <Component {...pageProps} />
        </main>

        {/* 번역 위젯 숨김 요소: 
            id를 부여하되 CSS(globals.css)에서 강제로 숨겨 잔상을 방지합니다. 
        */}
        <div id="google_translate_element" style={{ display: 'none', visibility: 'hidden' }}></div>
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
