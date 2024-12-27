import { useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Modal from "react-modal";

const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDT_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
];

function ButtonBuy() {
  const query = new URLSearchParams(window.location.search);
  const projectId = query.get("id");
  const userAccount = localStorage.getItem("userAccount");

  const { walletProvider } = useAppKitProvider("eip155");

  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(
    "0x0Bab4D46746146A6aC998245aA30A6110EfB91ec"
  );

  useEffect(() => {
    const userAccount = localStorage.getItem("userAccount");
    if (userAccount) {
      const text = `Allocation will be transferred to: ${userAccount.slice(
        0,
        6
      )}...${userAccount.slice(-4)}`;
      setRecipient(text);
    }
  }, []);

  const handleTransfer = async () => {
    if (amount % 50 !== 0 || !amount) {
      setError("Value must be in increments of 50.0");
      return;
    }
    setIsLoading(true);
    setTransactionHash("");

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          USDT_ABI,
          signer
        );

        const recipientAddress = "0x0Bab4D46746146A6aC998245aA30A6110EfB91ec";

        const totalPriceInCents = Math.round(amount * 1.2 * 100);
        const totalPrice = totalPriceInCents / 100;

        const amountToSend = ethers.utils.parseUnits(totalPrice.toString(), 6);

        const tx = await usdtContract.transfer(recipientAddress, amountToSend);
        console.log("Transação enviada:", tx);

        await tx.wait();

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

        setTransactionHash(tx.hash);
        window.location.href = "/portfolio";
      } else {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          USDT_ABI,
          signer
        );

        const recipientAddress = "0x0Bab4D46746146A6aC998245aA30A6110EfB91ec";
        
        const totalPriceInCents = Math.round(amount * 1.2 * 100);
        const totalPrice = totalPriceInCents / 100;

        const amountToSend = ethers.utils.parseUnits(totalPrice.toString(), 6);

        const tx = await usdtContract.transfer(recipientAddress, amountToSend);
        console.log("Transação enviada:", tx.hash);

        await tx.wait();

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

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => setIsModalOpen(true)}
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
        style={{
          content: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "600px",
            height: "350px",
            margin: "0 auto",
            backgroundColor: "#1D1F21",
            color: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
          },
        }}
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
          }}
          placeholder="Allocation to Buy (in $)"
          required
        />
        <span
          style={{
            fontSize: "14px",
            color: "#339CFB",
            margin: "-15px 0 15px 0",
          }}
        >
          (!) Value must be in increments of 50.0
        </span>

        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#aaa" }}>
            Total Price: ${Number(amount * 1.2).toFixed(2)}
          </span>
          <div
            style={{
              border: "1px solid #ffc107",
              color: "#ffc107",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              backgroundColor: "#252526",
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
            Transaction successful!{" "}
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00FF00" }}
            >
              View on Etherscan
            </a>
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Modal>
    </div>
  );

  // return (
  //   <div style={{ textAlign: "center", marginTop: "20px" }}>
  //     <button
  //       onClick={handleTransfer}
  //       style={{
  //         backgroundColor: "#3389FB",
  //         color: "#fff",
  //         padding: "10px 20px",
  //         borderRadius: "5px",
  //         border: "none",
  //         cursor: "pointer",
  //         fontSize: "16px",
  //       }}
  //       disabled={isLoading}
  //     >
  //       {isLoading ? "Enviando..." : "Transferir 1 USDT"}
  //     </button>

  //     {transactionHash && (
  //       <p>
  //         Transação confirmada! Hash:{" "}
  //         <a
  //           href={`https://etherscan.io/tx/${transactionHash}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           {transactionHash}
  //         </a>
  //       </p>
  //     )}

  //     {error && <p style={{ color: "red" }}>Erro ao enviar transação</p>}
  //   </div>
  // );
}

export default ButtonBuy;
