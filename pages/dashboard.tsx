import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getAccessToken,
  usePrivy,
  useFundWallet,
  getEmbeddedConnectedWallet,
  useWallets,
  useSetWalletPassword,
  ConnectedWallet,
} from "@privy-io/react-auth";
import Head from "next/head";
import { confluxESpaceTestnet } from "viem/chains";
import { Address, createWalletClient, custom, EIP1193Provider } from "viem";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

async function viemSendTransaction(walletEmb: ConnectedWallet) {
  const provider = await walletEmb?.getEthereumProvider();
  const walletClient = createWalletClient({
    transport: custom(provider as EIP1193Provider),
    account: walletEmb?.address as Address,
    chain: confluxESpaceTestnet,
  });
  walletClient.sendTransaction({
    to: walletEmb?.address as `0x${string}`,
    value: 1000000000000000000n,
  });
}

export default function DashboardPage() {
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    exportWallet,
    enrollInMfa,
    signMessage,
    sendTransaction,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const { wallets } = useWallets();
  const walletEmb = getEmbeddedConnectedWallet(wallets);
  const { fundWallet } = useFundWallet();
  const { setWalletPassword } = useSetWalletPassword();

  return (
    <>
      <Head>
        <title>Privy Auth Demo</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth Demo</h1>
              <div className="flex items-center gap-4">
                {walletEmb?.address && (
                  <div className="text-sm text-violet-700 bg-violet-100 px-3 py-2 rounded-md">
                    {walletEmb.address}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="mt-12 flex gap-4 flex-wrap">
              {googleSubject ? (
                <button
                  onClick={() => {
                    unlinkGoogle(googleSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Google
                </button>
              ) : (
                <button
                  onClick={() => {
                    linkGoogle();
                  }}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Link Google
                </button>
              )}

              {twitterSubject ? (
                <button
                  onClick={() => {
                    unlinkTwitter(twitterSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Twitter
                </button>
              ) : (
                <button
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                  onClick={() => {
                    linkTwitter();
                  }}
                >
                  Link Twitter
                </button>
              )}

              {discordSubject ? (
                <button
                  onClick={() => {
                    unlinkDiscord(discordSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Discord
                </button>
              ) : (
                <button
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                  onClick={() => {
                    linkDiscord();
                  }}
                >
                  Link Discord
                </button>
              )}

              {email ? (
                <button
                  onClick={() => {
                    unlinkEmail(email.address);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink email
                </button>
              ) : (
                <button
                  onClick={linkEmail}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Connect email
                </button>
              )}
              {wallet ? (
                <button
                  onClick={() => {
                    unlinkWallet(wallet.address);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink wallet
                </button>
              ) : (
                <button
                  onClick={linkWallet}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                >
                  Connect wallet
                </button>
              )}
              {phone ? (
                <button
                  onClick={() => {
                    unlinkPhone(phone.number);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink phone
                </button>
              ) : (
                <button
                  onClick={linkPhone}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                >
                  Connect phone
                </button>
              )}

              <button
                onClick={() => verifyToken().then(setVerifyResult)}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Verify token on server
              </button>

              <button
                onClick={async () => {
                  if (walletEmb?.address) {
                    fundWallet(walletEmb.address, {
                      chain: confluxESpaceTestnet,
                      amount: "10",
                      // asset: {erc20: '0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b'}
                      asset: "native-currency",
                    });
                  }
                }}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Fund wallet
              </button>
              <button
                onClick={() => exportWallet()}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Export wallet
              </button>
              <button
                onClick={() => setWalletPassword()}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Set wallet password
              </button>
              <button
                onClick={() => enrollInMfa(true)}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Enroll in MFA
              </button>
              <button
                onClick={() => signMessage({ message: "Hello, world!" })}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Sign message
              </button>
              <button
                onClick={() =>
                  sendTransaction({
                    to: walletEmb?.address,
                    value: "1000000000000000000",
                  })
                }
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Send transaction
              </button>
              <button
                onClick={() => {
                  if (walletEmb) {
                    viemSendTransaction(walletEmb).then(console.log);
                  }
                }}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Send transaction with viem
              </button>

              {Boolean(verifyResult) && (
                <details className="w-full">
                  <summary className="mt-6 font-bold uppercase text-sm text-gray-600">
                    Server verify result
                  </summary>
                  <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
                    {JSON.stringify(verifyResult, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <pre className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2">
              {JSON.stringify(user, null, 2)}
            </pre>
          </>
        ) : null}
      </main>
    </>
  );
}
