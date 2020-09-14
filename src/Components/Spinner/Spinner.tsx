import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./Spinner.module.css";

const Spinner = () => {
  let scroll =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  scroll = Math.floor(scroll);
  const topOffset: string = scroll.toString() + "px";
  let topPos = { top: topOffset };
  return (
    <div style={topPos} className={styles.SpinnerDiv}>
      <CircularProgress color="secondary" />
    </div>
  );
};

export default Spinner;
