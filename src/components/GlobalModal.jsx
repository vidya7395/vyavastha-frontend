import ReactDOM from "react-dom";
import { Modal } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../store/modalSlice";
import AddIncome from "./AddIncome"; // Import the AddIncome component

const GlobalModals = () => {
  const dispatch = useDispatch();
  const { modalType, modalProps } = useSelector((state) => state.modal);

  // Define modals dynamically based on `modalType`
  const renderModalContent = () => {
    switch (modalType) {
      case "ADD_INCOME":
        return <AddIncome {...modalProps} />; // ✅ Inject AddIncome UI
      // Add more modals here if needed
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <Modal
      opened={!!modalType} // Open modal only if modalType exists
      onClose={() => dispatch(closeModal())}
      title={modalProps.title || "Modal"} // Set dynamic title if passed
      size={modalProps.size || "lg"} // Dynamic size
    >
      {renderModalContent()} {/* ✅ Render the correct modal UI */}
    </Modal>,
    document.body // Inject at body level
  );
};

export default GlobalModals;
