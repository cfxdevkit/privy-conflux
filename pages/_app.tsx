import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";

const ClientPrivyProvider = dynamic(
  () => import("../components/client-privy-provider"),
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const content = (
    <div className="font-sans">
      <Component {...pageProps} />
    </div>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Privy Auth Starter</title>
        <meta name="description" content="Privy Auth Starter" />
      </Head>
      {appId ? (
        <ClientPrivyProvider appId={appId}>{content}</ClientPrivyProvider>
      ) : (
        content
      )}
    </>
  );
}

export default MyApp;
