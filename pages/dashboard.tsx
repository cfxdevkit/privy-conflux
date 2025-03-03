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
import { Address, createWalletClient, custom, EIP1193Provider, createPublicClient, http, formatEther } from "viem";

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

async function viemSendTransaction(embeddedWallet: ConnectedWallet) {
  const provider = await embeddedWallet?.getEthereumProvider();
  const walletClient = createWalletClient({
    transport: custom(provider as EIP1193Provider),
    account: embeddedWallet?.address as Address,
    chain: confluxESpaceTestnet,
  });
  walletClient.sendTransaction({
    to: embeddedWallet?.address as `0x${string}`,
    value: 1000000000000000000n,
  });
}

export default function DashboardPage() {
  const [verifyResult, setVerifyResult] = useState();
  const [balance, setBalance] = useState<string>("0");
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

  const { wallets } = useWallets();
  const embeddedWallet = getEmbeddedConnectedWallet(wallets);
  const { fundWallet } = useFundWallet();
  const { setWalletPassword } = useSetWalletPassword();
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  const publicClient = createPublicClient({
    chain: confluxESpaceTestnet,
    transport: http(),
  });

  const fetchBalance = async (address: Address) => {
    try {
      const balance = await publicClient.getBalance({ address });
      const formattedBalance = formatEther(balance);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0");
    }
  };

  const refreshBalance = () => {
    if (embeddedWallet?.address) {
      fetchBalance(embeddedWallet.address as Address);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    // Update wallet loading state when embeddedWallet changes
    setIsWalletLoading(false);
  }, [embeddedWallet]);

  useEffect(() => {
    // Fetch balance when wallet address changes
    if (embeddedWallet?.address) {
      fetchBalance(embeddedWallet.address as Address);
    }
  }, [embeddedWallet?.address]);

  useEffect(() => {
    // Check if wallet needs password setup and user is authenticated
    if (!isWalletLoading && ready && authenticated && embeddedWallet?.address && !user?.wallet?.address) {
      setWalletPassword();
    }
  }, [isWalletLoading, ready, authenticated, embeddedWallet, user?.wallet?.address, setWalletPassword]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  const formatAddress = (address: string) => {
    if (!address) return '';
    // return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return address;
  };

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
                {isWalletLoading ? (
                  <div className="text-sm text-violet-700 bg-violet-100 px-3 py-2 rounded-md animate-pulse">
                    Loading wallet...
                  </div>
                ) : embeddedWallet?.address ? (
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-violet-700 bg-violet-100 px-3 py-2 rounded-md flex items-center gap-2">
                      <span className="font-mono">{formatAddress(embeddedWallet.address)}</span>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="text-sm text-violet-700 bg-violet-100 px-3 py-2 rounded-md">
                      {parseFloat(balance).toFixed(4)} CFX
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-violet-700 bg-violet-100 px-3 py-2 rounded-md flex items-center gap-2">
                    <span>No wallet connected</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
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
                  if (embeddedWallet?.address) {
                    await fundWallet(embeddedWallet.address, {
                      chain: confluxESpaceTestnet,
                      amount: "10",
                      asset: "native-currency",
                    });
                    refreshBalance();
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
                onClick={async () => {
                  if (embeddedWallet?.address) {
                    await sendTransaction({
                      to: embeddedWallet.address,
                      value: "1000000000000000000",
                    });
                    refreshBalance();
                  }
                }}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
              >
                Send transaction
              </button>
              <button
                onClick={async () => {
                  if (embeddedWallet) {
                    await viemSendTransaction(embeddedWallet);
                    refreshBalance();
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
