import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';
import { Header } from '../components/Header';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher'; // 다시 추가

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        {/* 우측 상단 구글 번역기 바(프레임)만 정밀하게 숨기기 */}
        <style>{`
          .goog-te-banner-frame, 
          .goog-te-banner,
          .skiptranslate[style*="top: 0"] { 
            display: none !important; 
            visibility: hidden !important;
          }
          body { top: 0 !important; }
          /* 마우스 오버 시 나오는 툴팁 방해 금지 */
          #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        `}</style>
      </Head>

      {/* Pi Network SDK */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).Pi) {
            (window as any).Pi.init({ version: "2.0" });
          }
        }}
      />

      {/* 구글 번역 설정 */}
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
        <Header />
        
        <main>
          <Component {...pageProps} />
        </main>

        {/* 1. 번역 기능을 위한 엘리먼트는 숨겨서 유지 */}
        <div id="google_translate_element" className="hidden"></div>
        
        {/* 2. 우측 하단 필수 버튼 다시 살림! */}
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
