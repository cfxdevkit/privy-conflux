import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { confluxESpaceTestnet } from "viem/chains";

function MyApp({ Component, pageProps }: AppProps) {
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
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          defaultChain: confluxESpaceTestnet,
          supportedChains: [confluxESpaceTestnet],
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <div className="font-sans">
          <Component {...pageProps} />
        </div>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
