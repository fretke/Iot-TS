import React from "react";
import {connect} from "react-redux";
import styles from "./ControlPanel.module.css";

import LightBulbControl from "../../Components/LightBulbControl/LightBulbControl";
import ServoControl from "../../Components/ServoControl/ServoControl";
import Spinner from "../../Components/Spinner/Spinner";
import SeqPanel from "../../Components/SeqPanel/SeqPanel";
import Modal from "../../Components/Modal/Modal";

import {StoreState} from "../../store/Reducers";
import {userReducerState} from "../../store/Reducers/userReducer";
import {controlsState, servoData} from "../../store/Reducers/controlsReducer";

import {
    CloseControllerErrorModal,
    closeControllerErrorModal,
    ControllerBussyEnd,
    ControllerBussyStart,
    ControllerError,
    controllerFinish,
    controllerStart,
    Property,
    setControllerError,
    toggleLED,
    UpdateBulbAction,
    updateServoAction,
    updateServoAfterSeq,
    UpdateServoAfterSeqAction,
    updateServoWS,
} from "../../store/Actions";
import {ConnectionTypes, SocketService,} from "../../Utils/SocketService";
import {StateManager} from "../../Utils/StateManager";

export interface ControlPanelProps {
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

    updateServoAfterSeq(data: servoData[]): UpdateServoAfterSeqAction;
}

interface State {
    trigger: number
}

class ControlPanel extends React.Component<ControlPanelProps, State> {

    private readonly socketService: SocketService;

    public constructor(props: ControlPanelProps) {
        super(props);
        this.socketService = new SocketService(this.props.user.id);
        this.state = {
            trigger: 0
        }
    }

    public componentDidMount(): void {
        this.socketService.init(this);
        StateManager.instance.addObserver("trigger", this, () => {
            const value = this.state.trigger + 1;
            this.setState({trigger: value})
        });
    }

    componentWillUnmount() {
        this.socketService.disconnect();
    }

    public renderImg(url: string) {

        console.log("rendering image");
        // @ts-ignore
        document.querySelector("img").src = url;
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

        const allServoMotors = this.props.controls.servos.map(
            (servo, index): JSX.Element => {
                return (
                    <ServoControl
                        key={index}
                        servoName={servo.name}
                        currentPos={servo.pos}
                        currentSpeed={servo.speed}
                        socketService={this.socketService}
                    />
                );
            }
        );
        return (
            <div className={styles.AllControls}>
                <h1>{this.state.trigger}</h1>
                <h1>All controls</h1>
                <hr/>
                <LightBulbControl socketService={this.socketService}/>
                <hr/>
                <h2>Servo Motors</h2>
                <hr/>
                <div className={styles.ServoMotorSection}>{allServoMotors}</div>
                <hr/>
                <h2>Sequences</h2>
                <hr/>
                <SeqPanel socketService={this.socketService}/>
                {this.props.controls.controller.busy && <Spinner/>}
                {this.props.controls.controller.error && (
                    <Modal
                        click={this.props.closeControllerErrorModal}
                        title={this.props.controls.controller.message}
                    />
                )}
                <button onClick={() => this.socketService.getFrame()}>Get Pic</button>
                <img src={""}/>
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
    updateServoAfterSeq,
    controllerFinish,
    controllerStart,
    setControllerError,
    closeControllerErrorModal,
})(ControlPanel);
