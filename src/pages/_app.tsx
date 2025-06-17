import '@/styles/globals.css';
import { useRouter } from 'next/router';

import type { AppProps } from 'next/app';
import { NextPageWithLayout } from '@/types/layout';

import Header from '@/components/user/common/Header';
import Footer from '@/components/user/common/Footer';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  // Admin 페이지에서 getLayout이 있으면 사용
  if (isAdminRoute && Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  // User 페이지 UI
  return (
    <>
      {!isAdminRoute && <Header />}
      <Component {...pageProps} />
      {!isAdminRoute && <Footer />}
    </>
  );
}
