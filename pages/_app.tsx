import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import '../globals.css';
import { Header } from '../components/Header';
import { FloatingLanguageSwitcher } from '../components/FloatingLanguageSwitcher';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // [최후의 수단] 구글 번역 바를 실시간으로 감시해서 삭제하는 로직
    const removeGoogleBar = () => {
      const selectors = [
        '.goog-te-banner-frame', 
        '.goog-te-banner', 
        '.VIpgJd-Zvi9m-OR9h3-zh99gd', 
        'iframe.skiptranslate'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => (el as HTMLElement).style.setProperty('display', 'none', 'important'));
      });

      // body의 top 여백 강제 제거
      if (document.body.style.top !== '0px') {
        document.body.style.top = '0px !important';
      }
    };

    // DOM이 변할 때마다 체크 (MutationObserver)
    const observer = new MutationObserver(removeGoogleBar);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <Script 
        src="https://sdk.minepi.com/pi-sdk.js" 
        strategy="afterInteractive"
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

      <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        {/* 원본 구글 위젯은 완전히 숨김 */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        {/* 제티가 직접 만든 버튼만 노출 */}
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
