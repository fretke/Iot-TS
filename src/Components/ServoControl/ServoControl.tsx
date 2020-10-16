import React, {Fragment} from "react";
import styles from "./ServoControl.module.css";
import ServoSlider from "./ServoSlider/ServoSlider";
import {connect} from "react-redux";
import {StoreState} from "../../store/Reducers";

import {
    Property,
    addNewSequenceElement,
    AddNewSequenceElementAction,
} from "../../store/Actions";
import {seqState} from "../../store/Reducers/sequenceReducer";
import {controlsState, servoData} from "../../store/Reducers/controlsReducer";

import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import {SocketService} from "../../Utils/SocketService";

interface ServoControlProps {
    servoName: string;
    currentPos: number;
    currentSpeed: number;
    socketService: SocketService
    seq: seqState;
    controls: controlsState;

    addNewSequenceElement(data: servoData[]): AddNewSequenceElementAction;
}

class ServoControl extends React.Component<ServoControlProps> {
    state = {
        showSliders: false,
    };

    shouldComponentUpdate(nextProps: ServoControlProps, nextState: any) {
        return nextProps.currentPos !== this.props.currentPos ||
            nextProps.currentSpeed !== this.props.currentSpeed ||
            nextState.showSliders !== this.state.showSliders ||
            nextProps.seq.seqCreationModeOn !== this.props.seq.seqCreationModeOn;
    }

    saveServoDataToSeq = () => {
        let {name, pos, speed} = this.props.controls.servos.filter((servo) => {
            return servo.name === this.props.servoName;
        })[0];
        const savableData = [{name, pos, speed}];
        this.props.addNewSequenceElement(savableData);
    };

    render() {
        return (
            <Fragment>
                <div className={styles.ServoContainer}>
                    <h3
                        onClick={() =>
                            this.setState({showSliders: !this.state.showSliders})
                        }
                        className={styles.SectionHeading}
                    >
                        {this.props.servoName}
                    </h3>
                    {this.props.seq.seqCreationModeOn && (
                        <IconButton
                            onClick={() => this.saveServoDataToSeq()}
                            aria-label="save"
                            color="primary"
                        >
                            <SaveIcon/>
                        </IconButton>
                    )}
                    {this.state.showSliders && (
                        <React.Fragment>
                            <ServoSlider
                                currentValue={this.props.currentPos}
                                servoName={this.props.servoName}
                                sliderMarks={[0, 180]}
                                sliderType={Property.pos}
                                socketService={this.props.socketService}
                            />

                            <ServoSlider
                                currentValue={this.props.currentSpeed}
                                servoName={this.props.servoName}
                                sliderMarks={[0, 100]}
                                sliderType={Property.speed}
                                socketService={this.props.socketService}
                            />
                        </React.Fragment>
                    )}
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state: StoreState) => {
    return {
        seq: state.allSeq,
        controls: state.controls,
    };
};

export default connect(mapStateToProps, {addNewSequenceElement})(
    ServoControl
);
