import { withTRPC } from '@trpc/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import { AppRouter } from './api/trpc/[trpc]';

function MyApp({ Component, pageProps }: AppProps) {
  return (<><Head><title>Zurl - Easy URL shortner.</title></Head><Component {...pageProps} /></>)
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = '/api/trpc';

    return {
      url,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

