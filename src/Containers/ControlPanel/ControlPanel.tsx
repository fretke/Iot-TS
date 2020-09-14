import React from "react";
import { connect, useDispatch } from "react-redux";
import styles from "./ControlPanel.module.css";

import LightBulbControl from "../../Components/LightBulbControl/LightBulbControl";
import ServoControl from "../../Components/ServoControl/ServoControl";
import Spinner from "../../Components/Spinner/Spinner";

import { StoreState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";

import { SocketContext } from "../../Context/SocketContext";
import {
  toggleLED,
  updateServoWS,
  controllerFinish,
  controllerStart,
  ControllerBussyEnd,
  ControllerBussyStart,
  UpdateBulbAction,
  Property,
  updateServoAction,
} from "../../store/Actions";
import {
  ControllerResponse,
  ServoMoveMessage,
} from "../../Utils/SocketService";
import { dispatch } from "rxjs/internal/observable/pairs";

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
}

class ControlPanel extends React.Component<ControlPanelProps> {
  static contextType = SocketContext;
  componentDidMount() {
    this.context.init(this.props.user.id);
    const ledMessage = this.context.onLED();
    ledMessage.subscribe((message: any) => {
      this.props.toggleLED();
    });
    const servoMessage = this.context.onServoMove();
    servoMessage.subscribe((m: ServoMoveMessage) => {
      this.props.updateServoWS(m.servoName, m.property, m.value);
    });

    const controllerFinish = this.context.onControllerResponse();
    controllerFinish.subscribe((m: ControllerResponse) => {
      this.props.controllerFinish();
      console.log("controller finished task");
    });

    const controllerStart = this.context.onControllerStart();
    controllerStart.subscribe((m: ControllerResponse) => {
      this.props.controllerStart();
      console.log("controller started task");
    });
  }

  componentWillUnmount() {
    this.context.disconnect();
  }

  render() {
    const allServoMotors = this.props.controls.servos.map((servo, index) => {
      return (
        <ServoControl
          key={index}
          servoName={servo.name}
          currentPos={servo.pos}
          currentSpeed={servo.speed}
        />
      );
    });
    return (
      <div className={styles.AllControls}>
        <h1>All controls</h1>
        <hr></hr>
        <LightBulbControl />
        <hr></hr>
        <h2>Servo Motors</h2>
        <hr></hr>
        {allServoMotors}
        {this.props.controls.controllerBussy && <Spinner />}
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
})(ControlPanel);
