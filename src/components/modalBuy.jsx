/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { styles } from "../utils/styleModal";

const ModalBuy = ({
  isModalOpen,
  setIsModalOpen,
  amount,
  setAmount,
  recipient,
  handleTransfer,
  isLoading,
  transactionHash,
  error,
}) => {
  return (
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
  );
};

export default ModalBuy;
