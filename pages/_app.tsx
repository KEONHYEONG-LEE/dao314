import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import '../globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>GPNR - Global Pi Newsroom</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Pi SDK 로드 */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
