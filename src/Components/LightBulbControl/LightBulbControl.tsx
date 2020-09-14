import React from "react";

import { connect } from "react-redux";
import { updateLED } from "../../store/Actions";
import Switch from "@material-ui/core/Switch";

import styles from "./LightBulbControl.module.css";

import { StoreState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";
import { SocketContext } from "../../Context/SocketContext";

interface LightBulbProps {
  controls: controlsState;
  user: userReducerState;
  updateLED(state: boolean, userEmail: string, id: string): Promise<void>;
}

class LightBulbControl extends React.Component<LightBulbProps> {
  static contextType = SocketContext;
  render() {
    const { userEmail, id } = this.props.user;
    return (
      <div className={styles.LightBulbSection}>
        <div>
          <h3>LED control</h3>
        </div>
        <div>
          <Switch
            disabled={this.props.controls.loading}
            checked={this.props.controls.ledIsOn}
            onChange={() => {
              this.context.toggleLED(!this.props.controls.ledIsOn);
              this.props.updateLED(!this.props.controls.ledIsOn, userEmail, id);
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps, { updateLED })(LightBulbControl);
