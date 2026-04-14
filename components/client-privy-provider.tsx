import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { confluxESpaceTestnet } from "viem/chains";

type Props = {
  appId: string;
  children: ReactNode;
};

export default function ClientPrivyProvider({ appId, children }: Props) {
  return (
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
      {children}
    </PrivyProvider>
  );
}
