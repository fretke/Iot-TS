import React from "react";
import { connect } from "react-redux";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";

import { StoreState } from "../../../store/Reducers";

import { updateServo, Property } from "../../../store/Actions";
import { userReducerState } from "../../../store/Reducers/userReducer";
import { controlsState } from "../../../store/Reducers/controlsReducer";
import {SocketService} from "../../../Utils/SocketService";

function ValueLabelComponent(props: any) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

interface ServoSliderProps {
  sliderType: Property;
  sliderMarks: number[];
  currentValue: number;
  user: userReducerState;
  controls: controlsState;
  servoName: string;
  socketService: SocketService
  updateServo(
    servoName: string,
    property: Property,
    value: number,
    userEmail: string,
    id: string
  ): Promise<void>;
}

class ServoSlider extends React.Component<ServoSliderProps> {

  shouldComponentUpdate(nextProps: ServoSliderProps, nextState: any) {
    return nextProps.currentValue !== this.props.currentValue;
  }

  handleSliderChange = (
    newPos: number | number[],
    parameter: Property
  ): void => {
    this.props.updateServo(
      this.props.servoName,
      parameter,
      // @ts-ignore
      newPos,
      this.props.user.userEmail,
      this.props.user.id
    );
    // @ts-ignore
    this.props.socketService.moveServo(this.props.servoName, parameter, newPos);
  };

  render() {
    console.log("slider render !!!");
    const marks = this.props.sliderMarks.map((mark) => {
      return {
        value: mark,
        label: mark.toString(),
      };
    });
    return (
      <React.Fragment>
        <section>
          <h4>
            {this.props.sliderType === Property.pos ? "Position" : "Speed"}
          </h4>
        </section>

        <div>
          <Slider
            ValueLabelComponent={ValueLabelComponent}
            aria-label="custom thumb label"
            value={this.props.currentValue}
            max={this.props.sliderMarks[1]}
            step={5}
            marks={marks}
            onChangeCommitted={(e, val) =>
              this.handleSliderChange(val, this.props.sliderType)
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    user: state.user,
    controls: state.controls,
  };
};

export default connect(mapStateToProps, { updateServo })(ServoSlider);
