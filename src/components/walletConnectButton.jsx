import { useEffect, useState } from "react";
import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { SiWalletconnect } from "react-icons/si";
import { IoIosArrowForward } from "react-icons/io";

function WalletConnectButton() {
  const [haveMetaMask, setHaveMetaMask] = useState(false);

  useEffect(() => {
    const projectId = "31311badff05f0661d793986d1cdc1a1";

    const metadata = {
      name: "My Website",
      description: "My Website description",
      url: "https://mywebsite.com",
      icons: ["https://avatars.mywebsite.com/"],
    };

    createAppKit({
      adapters: [new Ethers5Adapter()],
      metadata: metadata,
      networks: [mainnet, arbitrum],
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
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Colocando MetaMask
        "20c15bd9ea127d47f5f3ae317df35e6a0f63af9c2607f897285f15b63b7b8a25", // Removendo WalletConnect
      ],
      enableWalletConnect: false,
      enableCoinbase: false,
      allWallets: "HIDE",
      excludeWalletIds: [
        "b59c98909bda10180d680f600d49556ff3fc69ba21f56c1480dc50b0aa19b819", // Removendo Trust Wallet
        "e254b137adab566709826dc799fa296e37e4b8a6e51127382d17b39168353b1b", // Removendo Coinbase
      ],
      onConnect: (acount) => {
        console.log("GEFERSON AAAAAA Conta conectada:", acount);
        localStorage.setItem("userAccount", acount);
        window.location.href = "/telegram";
      },
    });

    if (typeof window.ethereum !== "undefined") {
      setHaveMetaMask(true);
    }
  }, []);

  const handleOpenMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Contas conectadas:", accounts);

        localStorage.setItem("userAccount", accounts[0]);

        window.location.href = "/telegram";
      } catch (error) {
        console.error("Erro ao conectar a MetaMask:", error);
      }
    }
  };

  return (
    <button
      style={{
        width: "238px",
        height: "66px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        garp: "10px",
        backgroundColor: "#0E131D",
        borderRadius: "5px",
        border: "none",
        cursor: "auto",
      }}
      onClick={() => handleOpenMetamask()}
    >
      <SiWalletconnect
        color="#fff"
        style={{
          backgroundColor: "#3389FB",
          borderRadius: "50%",
          padding: "5px",
        }}
      />
      {haveMetaMask ? (
        <p
          style={{
            color: "#fff",
            fontWidth: "bolder",
            cursor: "pointer",
            border: "0.5px #505050 solid",
            borderRadius: "20px",
            padding: "10px 18px",
            margin: "0",
          }}
        >
          Wallet Connect
        </p>
      ) : (
        <appkit-button />
      )}
      <IoIosArrowForward color="#3389FB" size={24} />
    </button>
  );
}

export default WalletConnectButton;
