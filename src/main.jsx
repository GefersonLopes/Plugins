import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppKitProvider } from "./components/provide.jsx";
// import WalletConnectButton from "./components/walletConnectButton.jsx";
import ButtonBuy from "./components/buttonBuy.jsx";
import Modal from "react-modal";

Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AppKitProvider> */}
    <App />
    {/* </AppKitProvider> */}
  </StrictMode>
);

// createRoot(document.getElementById("wallet-connect-root")).render(
//   <StrictMode>
//     <AppKitProvider>
//       <WalletConnectButton />
//     </AppKitProvider>
//   </StrictMode>
// );

// createRoot(document.getElementById("wallet-buy-root")).render(
//   <StrictMode>
//     <AppKitProvider>
//       <ButtonBuy />
//     </AppKitProvider>
//   </StrictMode>
// );
