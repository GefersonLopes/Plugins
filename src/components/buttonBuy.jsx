import { useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { styles } from "../utils/styleModal";
import ModalAlert from "./modalAlert";
import ModalBuy from "./modalBuy";
import { handleSaveTransaction } from "../assets/api";
import { USDT_ABI, USDT_CONTRACT_ADDRESS } from "../utils/paramsMetamask";
import { switchToBSC, switchToBSCWithWalletProvider } from "../utils/networks";

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

  useEffect(() => {
    const fetchAccount = async () => {
      const account =
        userAccount ||
        (await walletProvider?.request({ method: "eth_requestAccounts" }))?.[0];

      if (account) {
        setRecipient(
          `Allocation will be transferred to: ${account.slice(
            0,
            6
          )}...${account.slice(-4)}`
        );
      }
    };

    fetchAccount();
  }, [walletProvider, userAccount]);

  const handleTransfer = async () => {
    if (url.hostname !== "localhost" && (!amount || amount % 50 !== 0)) {
      setError("Value must be in increments of 50.0");
      return;
    }

    setIsLoading(true);
    setTransactionHash("");

    try {
      const provider = window.ethereum
        ? new ethers.providers.Web3Provider(window.ethereum)
        : new ethers.providers.Web3Provider(walletProvider);

      const signer = provider.getSigner();
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        USDT_ABI,
        signer
      );
      const recipientAddress = "0x5A7F4cca63594b78dE42fa59867B1BE8209D88A4";
      const totalPrice = (Math.round(amount * 1.2 * 100) / 100).toString();
      const amountToSend = ethers.utils.parseUnits(totalPrice, 18);

      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await switchToBSC();
      } else {
        await switchToBSCWithWalletProvider(walletProvider);
        await provider.send("eth_requestAccounts", []);
      }

      const tx = await usdtContract.transfer(recipientAddress, amountToSend);
      await tx.wait();

      if (!tx.hash) {
        setError("Send transaction failed");
        return;
      }

      const response = await handleSaveTransaction({
        tx,
        projectId,
        amount,
        userAccount,
      });

      setTransactionHash(tx.hash);
      // window.location.href = "/portfolio";
    } catch (err) {
      console.error("Erro ao enviar transação:", err);
      setError("Send transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsMobileDesktop = () => {
    return window.ethereum ? setIsModalOpen(true) : setIsModalOpenMobile(true);
  };

  return (
    <div style={styles.buttonBuy}>
      <button onClick={() => handleIsMobileDesktop()} style={styles.button}>
        Buy Now
      </button>

      <ModalBuy
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        amount={amount}
        setAmount={setAmount}
        recipient={recipient}
        handleTransfer={handleTransfer}
        isLoading={isLoading}
        transactionHash={transactionHash}
        error={error}
      />

      <ModalAlert
        isModalOpenMobile={isModalOpenMobile}
        setIsModalOpenMobile={setIsModalOpenMobile}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}

export default ButtonBuy;
