import React from "react";
import styles from "./Modal.module.css";

import Alert from "@material-ui/lab/Alert";

interface ModalProps {
  title: string;
  click(): any;
}

export const Modal = (props: ModalProps) => {
  let scroll = window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  scroll = Math.floor(scroll);

  const topPos = { top: scroll.toString() + "px" };
  return (
    <div
      style={topPos}
      onClick={() => props.click()}
      className={styles.ModalContainer}
    >
      <Alert severity="error">{props.title}</Alert>
    </div>
  );
};
