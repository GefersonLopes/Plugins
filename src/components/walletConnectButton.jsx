import { useEffect, useState } from "react";
import { SiWalletconnect } from "react-icons/si";
import { IoIosArrowForward } from "react-icons/io";
import { useAppKitAccount } from "@reown/appkit/react";

function WalletConnectButton() {
  const [haveMetaMask, setHaveMetaMask] = useState(false);
  const { isConnected, address } = useAppKitAccount();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHaveMetaMask(true);
    }
  }, []);

  useEffect(() => {
    if (isConnected && window.location.pathname !== "/telegram") {
      localStorage.setItem("userAccount", address);
      window.location.href = "/telegram";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleOpenMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Contas conectadas:", accounts);

        localStorage.setItem("userAccount", accounts[0]);

        window.location.href = "/telegram";
      } catch (error) {
        console.error("Erro ao conectar a MetaMask:", error);
      }
    } else {
      console.error("MetaMask não está instalado.");
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
