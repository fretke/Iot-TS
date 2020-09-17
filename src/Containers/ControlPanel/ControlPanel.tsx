import React from "react";
import { connect } from "react-redux";
import styles from "./ControlPanel.module.css";

import LightBulbControl from "../../Components/LightBulbControl/LightBulbControl";
import ServoControl from "../../Components/ServoControl/ServoControl";
import Spinner from "../../Components/Spinner/Spinner";
import Modal from "../../Components/Modal/Modal";

import { StoreState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";

import { SocketContext } from "../../Context/SocketContext";
import {
  toggleLED,
  updateServoWS,
  controllerFinish,
  controllerStart,
  setControllerError,
  ControllerError,
  ControllerBussyEnd,
  ControllerBussyStart,
  UpdateBulbAction,
  Property,
  updateServoAction,
  CloseControllerErrorModal,
  closeControllerErrorModal,
} from "../../store/Actions";
import {
  ControllerResponse,
  ServoMoveMessage,
} from "../../Utils/SocketService";

interface ControlPanelProps {
  user: userReducerState;
  controls: controlsState;
  toggleLED(): UpdateBulbAction;
  updateServoWS(
    servoName: string,
    property: Property,
    value: number
  ): updateServoAction;
  controllerFinish(): ControllerBussyEnd;
  controllerStart(): ControllerBussyStart;
  setControllerError(m: string): ControllerError;
  closeControllerErrorModal(): CloseControllerErrorModal;
}

interface ControlPanelState {
  timer: NodeJS.Timeout | null;
}

class ControlPanel extends React.Component<ControlPanelProps> {
  state: ControlPanelState = {
    timer: null,
  };

  static contextType = SocketContext;

  componentDidMount() {
    this.context.init(this.props.user.id);
    const ledMessage = this.context.onLED();
    ledMessage.subscribe((message: string) => {
      this.props.toggleLED();
    });
    const servoMessage = this.context.onServoMove();
    servoMessage.subscribe((m: ServoMoveMessage) => {
      this.props.updateServoWS(m.servoName, m.property, m.value);
    });

    const controllerFinish = this.context.onControllerResponse();
    controllerFinish.subscribe((m: ControllerResponse) => {
      this.props.controllerFinish();
      if (this.state.timer) clearTimeout(this.state.timer);
      console.log("controller finished task");
    });

    const controllerStart = this.context.onControllerStart();
    controllerStart.subscribe((m: ControllerResponse) => {
      this.props.controllerStart();
      const timer = setTimeout(() => {
        if (this.props.controls.controller.busy) {
          this.props.setControllerError("Controller not connected");
        }
      }, 15000);
      this.setState({ timer: timer });
      console.log("controller started task");
    });
  }

  componentWillUnmount() {
    this.context.disconnect();
  }

  render() {
    if (
      this.props.controls.controller.busy ||
      this.props.controls.controller.error
    ) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
    console.log("control panel rendering");

    const allServoMotors = this.props.controls.servos.map(
      (servo, index): JSX.Element => {
        return (
          <ServoControl
            key={index}
            servoName={servo.name}
            currentPos={servo.pos}
            currentSpeed={servo.speed}
          />
        );
      }
    );
    return (
      <div className={styles.AllControls}>
        <h1>All controls</h1>
        <hr></hr>
        <LightBulbControl />
        <hr></hr>
        <h2>Servo Motors</h2>
        <hr></hr>
        <div className={styles.ServoMotorSection}>{allServoMotors}</div>
        {this.props.controls.controller.busy && <Spinner />}
        {this.props.controls.controller.error && (
          <Modal
            click={this.props.closeControllerErrorModal}
            title={this.props.controls.controller.message}
          />
        )}
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
  toggleLED,
  updateServoWS,
  controllerFinish,
  controllerStart,
  setControllerError,
  closeControllerErrorModal,
})(ControlPanel);
