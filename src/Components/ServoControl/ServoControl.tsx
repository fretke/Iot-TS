import React, {ChangeEvent} from "react";

import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

import "./ServoControls.style.scss";
import ControlsService from "../../services/ControlsService";
import {IncomingEvents} from "../../Utils/SocketService";
import {ServoData} from "../../App";

interface Props {
    controlsManager: ControlsService
    name: string;
    currentPos: number;
    currentSpeed: number;
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

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (this.props.currentSpeed !== prevProps.currentSpeed ||
        this.props.currentPos !== prevProps.currentPos) {
            this.setState({pos: this.props.currentPos, speed: this.props.currentSpeed});
        }
    }

    public componentDidMount(): void {
        this.props.controlsManager.addObserver("onSequenceCreation", this, () => {
            this.setState({seqCreation: !this.state.seqCreation});
        })

        this.props.controlsManager.addObserver(
            `${IncomingEvents.OnServoUpdate}${this.props.name}`,
            this,
            this.onDeviceUpdate.bind(this));
    }

    public onDeviceUpdate(data: ServoData): void {
        this.setState({
            pos: data.pos,
            speed: data.speed
        })
    }

    public componentWillUnmount(): void {
        this.props.controlsManager.removeObserver(this);
    }

    // saveServoDataToSeq = () => {
    //     let {name, pos, speed} = this.props.controls.servos.filter((servo) => {
    //         return servo.name === this.props.servoName;
    //     })[0];
    //     const savableData = [{name, pos, speed}];
    //     this.props.addNewSequenceElement(savableData);
    // };

    private onInputChange (e: ChangeEvent<HTMLInputElement>): void {
        const {name, value} = e.target;
        name === "position"
            ? this.setState({pos: +value})
            : this.setState({speed: +value});
    }

    private onMoveHandler (): void {
        const {speed, pos} = this.state;
        const {controlsManager, name} = this.props;

        controlsManager.moveServo({name, speed, pos});
    }

    render() {
        const {pos, speed, seqCreation} = this.state;
        const {name} = this.props;
        return (
            <>
                <div className={"single-servo-grid"}>
                    <div>
                        <fieldset>
                            <legend>{name}</legend>
                            <div className={"wrapper"}>
                                <div>
                                    <label>POSITION</label>
                                    <label>SPEED</label>
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
                                <button className={"small"} onClick={() => this.onMoveHandler()}>move</button>
                                {seqCreation && (
                                    <IconButton
                                        // onClick={() => this.saveServoDataToSeq()}
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
            </>
        );
    }
}


export default ServoControl;
