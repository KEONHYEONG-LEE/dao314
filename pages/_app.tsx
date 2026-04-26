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

      {/* 구글 번역 초기화 함수 정의 */}
      <Script id="google-translate-config" strategy="beforeInteractive">
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

      <div className="relative min-h-screen flex flex-col bg-[#0f172a]">
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        {/* 번역 위젯 숨김 요소 */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <FloatingLanguageSwitcher />
      </div>
    </ThemeProvider>
  );
}
