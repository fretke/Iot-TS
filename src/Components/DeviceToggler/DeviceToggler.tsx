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

import { StoreState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";
import {SocketService} from "../../Utils/SocketService";
import {StateManager} from "../../Utils/StateManager";

import "./DeviceToggler.scss"

interface LightBulbProps {
  controls: controlsState;
  user: userReducerState;
  socketService: SocketService
  updateLED(state: boolean, userEmail: string, id: string): Promise<void>;
  controllerStart(): ControllerBussyStart;
  setControllerError(m: string): ControllerError;
}

class DeviceToggler extends React.Component<LightBulbProps> {

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
      <div className={"switch"}>
          <h3>LED</h3>
          <Switch
            disabled={loading}
            checked={ledIsOn}
            onChange={this.buttonClickHandler}
          />
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
})(DeviceToggler);
