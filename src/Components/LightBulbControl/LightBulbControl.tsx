import React from "react";

import { connect } from "react-redux";
import {
  updateLED,
  controllerStart,
  ControllerBussyStart,
  ControllerError,
  setControllerError,
} from "../../store/Actions";
import Switch from "@material-ui/core/Switch";

import styles from "./LightBulbControl.module.css";

import { StoreState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";
import {SocketService} from "../../Utils/SocketService";
import {StateManager} from "../../Utils/StateManager";

interface LightBulbProps {
  controls: controlsState;
  user: userReducerState;
  socketService: SocketService
  updateLED(state: boolean, userEmail: string, id: string): Promise<void>;
  controllerStart(): ControllerBussyStart;
  setControllerError(m: string): ControllerError;
}

class LightBulbControl extends React.Component<LightBulbProps> {

  private buttonClickHandler = (): void => {
    const { userEmail, id } = this.props.user;
    StateManager.instance.dispatch("trigger");
    this.props.socketService.toggleLED(!this.props.controls.ledIsOn);
    // this.props.socketService.getFrame();
    this.props.updateLED(!this.props.controls.ledIsOn, userEmail, id);
  };
  render() {
    const {loading, ledIsOn} = this.props.controls;
    return (
      <div className={styles.LightBulbSection}>
        <div>
          <h3>LED control</h3>
        </div>
        <div>
          <Switch
            disabled={loading}
            checked={ledIsOn}
            onChange={this.buttonClickHandler}
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

export default connect(mapStateToProps, {
  updateLED,
  controllerStart,
  setControllerError,
})(LightBulbControl);
