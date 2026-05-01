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
        {/* 우측 상단 거슬리는 번역 바만 정밀 타격해서 삭제 */}
        <style dangerouslySetInnerHTML={{ __html: `
          .goog-te-banner-frame, 
          .goog-te-banner,
          .skiptranslate[style*="top: 0"],
          .VIpgJd-Zvi9m-OR9h3-zh99gd { 
            display: none !important; 
            visibility: hidden !important;
          }
          body { top: 0 !important; position: static !important; }
          #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        `}} />
      </Head>

      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).Pi) {
            (window as any).Pi.init({ version: "2.0" });
          }
        }}
      />

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
        {/* 번역 기능은 작동하되 UI는 숨김 */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        {/* 우측 하단 필수 버튼 살림 */}
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
