/* eslint-disable react/prop-types */
import Lottie from "lottie-react";
import phone from "../assets/animation-phone.json";
import Modal from "react-modal";
import { styles } from "../utils/styleModal";

const ModalAlert = ({
  isModalOpenMobile,
  setIsModalOpenMobile,
  setIsModalOpen,
}) => {
  return (
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
  );
};

export default ModalAlert;
