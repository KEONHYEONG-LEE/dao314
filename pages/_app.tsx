import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import '../globals.css';
import { Header } from '../components/Header';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        {/* 브라우저가 강제로 띄우는 구글 번역 바를 CSS로 한 번 더 차단 */}
        <style>{`
          .goog-te-banner-frame { display: none !important; }
          #goog-gt-tt, .goog-te-balloon-frame { display: none !important; visibility: hidden !important; }
          body { top: 0 !important; }
          font { background-color: transparent !important; box-shadow: none !important; }
        `}</style>
      </Head>

      {/* Pi Network SDK 스크립트 */}
      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).Pi) {
            (window as any).Pi.init({ version: "2.0" });
            console.log("Pi SDK Initialized");
          }
        }}
      />

      {/* 구글 번역 설정 스크립트 */}
      <Script id="google-translate-config" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'ko,en',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
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

        {/* 1. UI에 걸쳐있던 FloatingLanguageSwitcher를 제거했습니다. 
          2. 구글 번역 엘리먼트가 공간을 차지하지 않도록 absolute로 숨겼습니다.
        */}
        <div 
          id="google_translate_element" 
          className="fixed -top-[9999px] -left-[9999px] invisible opacity-0 pointer-events-none"
        ></div>
      </div>
    </ThemeProvider>
  );
}
