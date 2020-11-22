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
import {IncomingEvents, ServoMoveMessage, SocketService} from "../../Utils/SocketService";
import {StateManager} from "../../Utils/StateManager";

import "./DeviceToggler.scss"
import ControlsService from "../../services/ControlsService";

interface Props {
  controlsManager: ControlsService
  controls: controlsState;
  user: userReducerState;
  updateLED(state: boolean, userEmail: string, id: string): Promise<void>;
  controllerStart(): ControllerBussyStart;
  setControllerError(m: string): ControllerError;
}

interface State {
  isOn: boolean
}

class DeviceToggler extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isOn: false
    }
  }

  // private buttonClickHandler = (): void => {
  //   const { userEmail, id } = this.props.user;
  //   StateManager.instance.dispatch("trigger");
  //   this.props.socketService.toggleLED(!this.props.controls.ledIsOn);
  //   // this.props.socketService.getFrame();
  //   this.props.updateLED(!this.props.controls.ledIsOn, userEmail, id);
  // };

  public componentDidMount(): void {
    this.props.controlsManager.addObserver(IncomingEvents.ToggleDevice, this, () => {
      this.setState({isOn: !this.state.isOn})
    })
  }

  public onToggle(): void {
    this.props.controlsManager.toggleDevice(!this.state.isOn);
    this.setState({isOn: !this.state.isOn});
  }

  render() {
    const {isOn} = this.state;
    return (
      <div className={"switch"}>
          <h3>LED</h3>
          <Switch
            checked={isOn}
            onChange={() => this.onToggle()}
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
