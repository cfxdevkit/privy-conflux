import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { confluxESpaceTestnet } from "viem/chains";

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
        <PrivyProvider
          appId={appId}
          config={{
            defaultChain: confluxESpaceTestnet,
            supportedChains: [confluxESpaceTestnet],
            embeddedWallets: {
              ethereum: {
                createOnLogin: "all-users",
              },
            },
          }}
        >
          {content}
        </PrivyProvider>
      ) : (
        content
      )}
    </>
  );
}

export default MyApp;
