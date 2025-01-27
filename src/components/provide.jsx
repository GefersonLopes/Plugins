import { createContext, useContext, useEffect, useState } from "react";
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, bsc } from "@reown/appkit/networks";

// eslint-disable-next-line react-refresh/only-export-components
export const AppKitContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AppKitProvider = ({ children }) => {
  const [appKit, setAppKit] = useState(null);

  useEffect(() => {
    const projectId = "31311badff05f0661d793986d1cdc1a1";

    const metadata = {
      name: "My Website",
      description: "My Website description",
      url: "https://webservice-2498.chargedcloud.com.br",
      icons: ["https://avatars.mywebsite.com/"],
    };

    const kit = createAppKit({
      adapters: [new Ethers5Adapter()],
      enableInjected: true,
      metadata: metadata,
      networks: [mainnet, bsc],
      projectId,
      features: {
        email: false,
        socials: false,
        emailShowWallets: false,
      },
      themeMode: "dark",
      themeVariables: {
        "--w3m-accent": "#0E131D",
      },
      featuredWalletIds: [
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
        "20c15bd9ea127d47f5f3ae317df35e6a0f63af9c2607f897285f15b63b7b8a25", // WalletConnect
      ],
      enableWalletConnect: false,
      enableCoinbase: false,
      allWallets: "HIDE",
      excludeWalletIds: [
        "b59c98909bda10180d680f600d49556ff3fc69ba21f56c1480dc50b0aa19b819", // Trust Wallet
        "e254b137adab566709826dc799fa296e37e4b8a6e51127382d17b39168353b1b", // Coinbase
      ],
      onConnect: (account) => {
        console.log("Conta conectada:", account);
        localStorage.setItem("userAccount", account);
        window.location.href = "/telegram";
      },
    });
    setAppKit(kit);
  }, []);

  return (
    <AppKitContext.Provider value={appKit}>{children}</AppKitContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppKitContext = () => useContext(AppKitContext);
