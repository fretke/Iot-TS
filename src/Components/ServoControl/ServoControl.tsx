import React, { Fragment } from "react";
import styles from "./ServoControl.module.css";
import ServoSlider from "./ServoSlider/ServoSlider";

import { Property } from "../../store/Actions";
import { SocketContext } from "../../Context/SocketContext";

interface ServoControlProps {
  servoName: string;
  currentPos: number;
  currentSpeed: number;
}

class ServoControl extends React.Component<ServoControlProps> {
  state = {
    showSliders: false,
  };
  static contextType = SocketContext;

  shouldComponentUpdate(nextProps: ServoControlProps, nextState: any) {
    if (
      nextProps.currentPos !== this.props.currentPos ||
      nextProps.currentSpeed !== this.props.currentSpeed ||
      nextState.showSliders !== this.state.showSliders
    ) {
      return true;
    }
    return false;
  }

  render() {
    console.log("<<<< servo controls render >>>>>");
    return (
      <Fragment>
        <div className={styles.ServoContainer}>
          <h3
            onClick={() =>
              this.setState({ showSliders: !this.state.showSliders })
            }
            className={styles.SectionHeading}
          >
            {this.props.servoName}
          </h3>

          {this.state.showSliders && (
            <React.Fragment>
              <ServoSlider
                currentValue={this.props.currentPos}
                servoName={this.props.servoName}
                sliderMarks={[0, 180]}
                sliderType={Property.pos}
              />

              <ServoSlider
                currentValue={this.props.currentSpeed}
                servoName={this.props.servoName}
                sliderMarks={[0, 100]}
                sliderType={Property.speed}
              />
            </React.Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

export default ServoControl;
