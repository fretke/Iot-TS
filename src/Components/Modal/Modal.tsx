import React from "react";
import styles from "./Modal.module.css";
import { connect } from "react-redux";
import { closeModal, closeModalAction } from "../../store/Actions";

interface ModalProps {
  closeModal(): closeModalAction;
  title: string;
}

const Modal = (props: ModalProps) => {
  const handleModalClick = () => {
    props.closeModal();
  };

  return (
    <div onClick={handleModalClick} className={styles.ModalContainer}>
      <div>{props.title}</div>
    </div>
  );
};

export default connect(null, { closeModal })(Modal);
