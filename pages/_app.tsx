import type { AppProps } from 'next/app'
import '../globals.css' // globals.css 경로에 맞춰 수정하세요

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

