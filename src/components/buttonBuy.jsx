import { useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Lottie from "lottie-react";
import phone from "../assets/animation-phone.json";

const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const USDT_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
];

const BSC_PARAMS = {
  chainId: "0x38",
  chainName: "Binance Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

function ButtonBuy() {
  const query = new URLSearchParams(window.location.search);
  const url = new URL(window.location.href);
  const projectId = query.get("id");
  const userAccount = localStorage.getItem("userAccount");

  const { walletProvider } = useAppKitProvider("eip155");

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenMobile, setIsModalOpenMobile] = useState(false);

  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const styles = {
    modal: {
      overlay: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      },
      content: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        height: "fit-content",
        maxWidth: "400px",
        padding: "20px",
        margin: "auto",
        backgroundColor: "rgb(29, 31, 33)",
        color: "#fff",
        borderRadius: "15px",
        border: "none",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        animation: "fadeIn 0.5s ease-in-out",
        overflow: "hidden",
      },
    },
  };

  async function switchToBSC() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_PARAMS.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BSC_PARAMS],
        });
      } else {
        console.error("Erro ao trocar/adicionar a rede BSC:", error);
      }
    }
  }

  async function switchToBSCWithWalletProvider(walletProvider) {
    try {
      await walletProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_PARAMS.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await walletProvider.request({
          method: "wallet_addEthereumChain",
          params: [BSC_PARAMS],
        });
      } else {
        console.error("Erro ao trocar/adicionar a rede BSC:", error);
        throw error;
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (userAccount) {
        const text = `Allocation will be transferred to: ${userAccount.slice(
          0,
          6
        )}...${userAccount.slice(-4)}`;
        setRecipient(text);
      } else {
        const accounts = await walletProvider?.request({
          method: "eth_requestAccounts",
        });

        if (!accounts || accounts.length === 0) return;

        const text = `Allocation will be transferred to: ${accounts[0].slice(
          0,
          6
        )}...${accounts[0].slice(-4)}`;
        setRecipient(text);
      }
    })();
  }, [walletProvider, userAccount]);

  const handleSaveTransaction = ({ tx, projectId, amount, userAccount }) => {
    fetch(`http://localhost:3001/web3/save-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...tx,
        projectId,
        valueUSD: amount,
        userAccount,
      }),
    });
  };

  const handleTransfer = async () => {
    if (url.hostname !== "localhost") {
      if (amount % 50 !== 0 || !amount) {
        setError("Value must be in increments of 50.0");
        return;
      }
    }
    setIsLoading(true);
    setTransactionHash("");

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        await switchToBSC();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          USDT_ABI,
          signer
        );

        const recipientAddress = "0x5A7F4cca63594b78dE42fa59867B1BE8209D88A4";
        const totalPriceInCents = Math.round(amount * 1.2 * 100);
        const totalPrice = totalPriceInCents / 100;
        const amountToSend = ethers.utils.parseUnits(totalPrice.toString(), 18);

        const tx = await usdtContract.transfer(recipientAddress, amountToSend);

        await tx.wait();

        handleSaveTransaction({ tx, projectId, amount, userAccount });

        setTransactionHash(tx.hash);
        window.location.href = "/portfolio";
      } else {
        await switchToBSCWithWalletProvider(walletProvider);

        const provider = new ethers.providers.Web3Provider(walletProvider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          USDT_ABI,
          signer
        );

        const recipientAddress = "0x5A7F4cca63594b78dE42fa59867B1BE8209D88A4";

        const totalPriceInCents = Math.round(amount * 1.2 * 100);
        const totalPrice = totalPriceInCents / 100;

        const amountToSend = ethers.utils.parseUnits(totalPrice.toString(), 18);

        const tx = await usdtContract.transfer(recipientAddress, amountToSend);

        await tx.wait();

        handleSaveTransaction({ tx, projectId, amount, userAccount });

        setTransactionHash(tx.hash);
        window.location.href = "/portfolio";
      }
    } catch (err) {
      console.error("Erro ao enviar transação:", err);
      setError("Send transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsMobileDesktop = () => {
    if (window.ethereum) {
      setIsModalOpen(true);
    } else {
      setIsModalOpenMobile(true);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => handleIsMobileDesktop()}
        style={{
          backgroundColor: "#3389FB",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Buy Now
      </button>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={styles.modal}
      >
        <h2 style={{ marginBottom: "20px" }}>I want to buy</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="50"
          step="50"
          style={{
            padding: "8px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#252526",
            color: "#fff",
            width: "90%",
          }}
          placeholder="Allocation to Buy (in $)"
          required
        />
        <span
          style={{
            fontSize: "14px",
            fontAlign: "start",
            color: "#339CFB",
            margin: "-15px 0 15px 0",
          }}
        >
          (!) Value must be in increments of 50.0
        </span>

        <div style={{ marginBottom: "20px", width: "100%" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#aaa",
              width: "90%",
              marginLeft: "10px",
            }}
          >
            Total Price: ${Number(amount * 1.2).toFixed(2)}
          </span>
          <div
            style={{
              border: "1px solid #ffc107",
              color: "#ffc107",
              padding: "8px",
              margin: "0 auto",
              marginTop: "5px",
              borderRadius: "5px",
              backgroundColor: "#252526",
              width: "90%",
            }}
          >
            {recipient}
          </div>
        </div>

        <button
          onClick={handleTransfer}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "#3389FB",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Processing..." : "Complete Listing"}
        </button>

        {transactionHash && (
          <p style={{ marginTop: "10px", color: "#00FF00" }}>
            Transaction successful!
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Modal>

      <Modal
        isOpen={isModalOpenMobile}
        onRequestClose={() => setIsModalOpenMobile(false)}
        style={styles.modal}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "25px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Open Metamask on your mobile device
          </h2>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "20px",
              color: "#aaa",
            }}
          >
            After confirming your transaction here, please complete the
            confirmation in your Metamask mobile app.
          </p>
          <div
            style={{
              width: "150px",
              height: "150px",
              margin: "0 auto",
              marginBottom: "25px",
            }}
          >
            <Lottie
              animationData={phone}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <button
            onClick={() => {
              setIsModalOpenMobile(false);
              setIsModalOpen(true);
            }}
            style={{
              backgroundColor: "#3389FB",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2673d7")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3389FB")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            Continue
          </button>
          <p style={{ marginTop: "10px", color: "#a9a9a9" }}>
            Waiting for your action...
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ButtonBuy;
