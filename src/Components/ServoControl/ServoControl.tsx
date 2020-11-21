import React, {ChangeEvent, Fragment} from "react";
import ServoSlider from "./ServoSlider/ServoSlider";
import {connect} from "react-redux";
import {StoreState} from "../../store/Reducers";

import {addNewSequenceElement, AddNewSequenceElementAction, Property,} from "../../store/Actions";
import {seqState} from "../../store/Reducers/sequenceReducer";
import {controlsState, servoData} from "../../store/Reducers/controlsReducer";

import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

import "./ServoControls.style.scss";
import ControlsService from "../../services/ControlsService";

interface Props {
    controlsManager: ControlsService
    servoName: string;
    currentPos: number;
    currentSpeed: number;
    seq: seqState;
    controls: controlsState;

    addNewSequenceElement(data: servoData[]): AddNewSequenceElementAction;
}

interface State {
    pos: number;
    speed: number;
    seqCreation: boolean;
}

class ServoControl extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        const {currentPos, currentSpeed} = this.props;
        this.state = {
            pos: currentPos,
            speed: currentSpeed,
            seqCreation: false
        }
    }

    public componentDidMount(): void {
        this.props.controlsManager.addObserver("onSequenceCreation", this, () => {
            this.setState({seqCreation: !this.state.seqCreation});
        })
    }

    public componentWillUnmount(): void {
        this.props.controlsManager.removeObserver(this);
    }

    saveServoDataToSeq = () => {
        let {name, pos, speed} = this.props.controls.servos.filter((servo) => {
            return servo.name === this.props.servoName;
        })[0];
        const savableData = [{name, pos, speed}];
        this.props.addNewSequenceElement(savableData);
    };

    private onInputChange (e: ChangeEvent<HTMLInputElement>): void {
        const {name, value} = e.target;
        name === "position"
            ? this.setState({pos: +value})
            : this.setState({speed: +value});
    }

    private onMoveHandler (): void {
        const {speed, pos} = this.state;
        const {controlsManager} = this.props;

        controlsManager.updateServo(this.props.servoName, {speed, pos});
    }

    render() {
        const {pos, speed, seqCreation} = this.state;
        const {servoName} = this.props;
        return (
            <Fragment>
                <div className={"single-servo-grid"}>
                    <div>
                        <fieldset>
                            <legend>{servoName}</legend>
                            <div className={"wrapper"}>
                                <div>
                                    <label>Position</label>
                                    <label>Speed</label>
                                </div>
                                <div>
                                    <input
                                        onChange={(e) => this.onInputChange(e)}
                                        name={"position"}
                                        value = {pos} />
                                    <input
                                        onChange={(e) => this.onInputChange(e)}
                                        name={"speed"}
                                        value = {speed} />
                                </div>
                                <button onClick={() => this.onMoveHandler()}>move</button>
                                {seqCreation && (
                                    <IconButton
                                        onClick={() => this.saveServoDataToSeq()}
                                        aria-label="save"
                                        color="primary"
                                    >
                                        <SaveIcon/>
                                    </IconButton>
                                )}
                            </div>
                        </fieldset>
                    </div>
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
