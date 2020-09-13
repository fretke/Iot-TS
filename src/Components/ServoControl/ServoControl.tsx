import React, { Fragment } from "react";
import { connect } from "react-redux";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import styles from "./ServoControl.module.css";

import { storeState } from "../../store/Reducers";
import { userReducerState } from "../../store/Reducers/userReducer";
import { controlsState } from "../../store/Reducers/controlsReducer";
import { updateServo, Property } from "../../store/Actions/controlsActions";
import { SocketContext } from "../../Context/SocketContext";

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 180,
    label: "180",
  },
];

const speedMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 100,
    label: "100",
  },
];

interface ServoControlProps {
  servoName: string;
  currentPos: number;
  currentSpeed: number;
  user: userReducerState;
  controls: controlsState;
  updateServo(
    servoName: string,
    property: Property,
    value: number,
    userEmail: string,
    id: string
  ): Promise<void>;
}

class ServoControl extends React.Component<ServoControlProps> {
  static contextType = SocketContext;
  handleSliderChange = (newPos: number | number[]): void => {
    this.props.updateServo(
      this.props.servoName,
      Property.pos,
      // @ts-ignore
      newPos,
      this.props.user.userEmail,
      this.props.user.id
    );
    // @ts-ignore
    this.context.moveServo(this.props.servoName, Property.pos, newPos);
  };

  handleSpeedSliderChange = (newValue: number | number[]): void => {
    this.props.updateServo(
      this.props.servoName,
      Property.speed,
      // @ts-ignore
      newValue,
      this.props.user.userEmail,
      this.props.user.id
    );
    // @ts-ignore
    this.context.moveServo(this.props.servoName, Property.speed, newValue);
  };

  render() {
    return (
      <Fragment>
        <h3 className={styles.SectionHeading}>{this.props.servoName}</h3>
        <div
          // style={props.controls.loading && { pointerEvents: "none" }}
          className={styles.ServoContainer}
        >
          <div>
            <h4>Motor position</h4>
          </div>

          <div>
            <Slider
              ValueLabelComponent={ValueLabelComponent}
              aria-label="custom thumb label"
              value={this.props.currentPos}
              max={180}
              step={5}
              marks={marks}
              onChangeCommitted={(e, val) => this.handleSliderChange(val)}
              disabled={this.props.controls.loading}
            />
          </div>

          <div>
            <h4>Motor speed</h4>
          </div>

          <div>
            <Slider
              ValueLabelComponent={ValueLabelComponent}
              aria-label="custom thumb label"
              value={this.props.currentSpeed}
              max={100}
              step={1}
              marks={speedMarks}
              onChangeCommitted={(e, val) => this.handleSpeedSliderChange(val)}
              disabled={this.props.controls.loading}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: storeState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps, { updateServo })(ServoControl);
