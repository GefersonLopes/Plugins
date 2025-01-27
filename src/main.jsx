import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";

import { AppKitProvider } from "./components/provide.jsx";
import ButtonBuy from "./components/buttonBuy.jsx";
import WalletConnectButton from "./components/walletConnectButton.jsx";

import "./index.css";

Modal.setAppElement("body");

createRoot(document.getElementById("wallet-connect-root")).render(
  <StrictMode>
    <AppKitProvider>
      <WalletConnectButton />
    </AppKitProvider>
  </StrictMode>
);

createRoot(document.getElementById("wallet-buy-root")).render(
  <StrictMode>
    <AppKitProvider>
      <ButtonBuy />
    </AppKitProvider>
  </StrictMode>
);
