import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AnswerProvider } from '@/components/providers/AnswerContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnswerProvider>
      <Component {...pageProps} />
    </AnswerProvider>)
}