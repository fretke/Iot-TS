import React from "react";
import styles from "./Modal.module.css";
import { connect } from "react-redux";
import {
  closeModal,
} from "../../store/Actions";

import Alert from "@material-ui/lab/Alert";

interface ModalProps {
  title: string;
  click(): any;
}

const Modal = (props: ModalProps) => {
  let scroll =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  scroll = Math.floor(scroll);
  const topOffset: string = scroll.toString() + "px";
  let topPos = { top: topOffset };
  return (
    <div
      style={topPos}
      onClick={() => props.click()}
      className={styles.ModalContainer}
    >
      <Alert severity="error">{props.title}</Alert>
      {/* <div>{props.title}</div> */}
    </div>
  );
};

export default connect(null, { closeModal })(Modal);
