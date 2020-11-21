import React from "react";
import {connect} from "react-redux";
import DeviceToggler from "../../Components/DeviceToggler/DeviceToggler";
import ServoControl from "../../Components/ServoControl/ServoControl";
import Spinner from "../../Components/Spinner/Spinner";
import SeqPanel from "../../Components/SeqPanel/SeqPanel";
import Modal from "../../Components/Modal/Modal";

import {StoreState} from "../../store/Reducers";
import {userReducerState} from "../../store/Reducers/userReducer";
import {controlsState, servoData} from "../../store/Reducers/controlsReducer";
import "./ControlPanel.style.scss";

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
import {SocketService} from "../../Utils/SocketService";
import {StateManager} from "../../Utils/StateManager";
import {MediaService, MediaWSActions} from "../../Utils/MediaService";
import {Media} from "../../Components/Media/Media";
import ControlsService from "../../services/ControlsService";
import {SERVER} from "../../Settings/settings";

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
    private readonly controlsManager: ControlsService;

    public constructor(props: ControlPanelProps) {
        super(props);
        const {id, userEmail} = props.user;
        this.socketService = new SocketService(id).init(this);
        this.controlsManager = new ControlsService(SERVER, userEmail, id,  this.socketService);

        MediaService.instance.userId = id;
        this.state = {
            trigger: 0
        }
    }

    public componentDidMount(): void {
        // this.socketService.init(this);
        MediaService.instance.init();
        StateManager.instance.addObserver("trigger", this, () => {
            const value = this.state.trigger + 1;
            this.setState({trigger: value})
        });

        this.controlsManager.initializeServos(this.props.controls.servos)
    }

    public componentWillUnmount() {
        this.socketService.disconnect();
        MediaService.instance.disconnect();
    }

    render() {
        const {busy, error, message} = this.props.controls.controller;
        const {servos} = this.props.controls;
        if (busy || error) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "auto";
        }

        const allServoMotors = servos.map(
            (servo, index): JSX.Element => {
                return (
                    <ServoControl
                        controlsManager={this.controlsManager}
                        key={index}
                        servoName={servo.name}
                        currentPos={servo.pos}
                        currentSpeed={servo.speed}
                    />
                );
            }
        );
        return (
            <div className={"control-panel"}>

                <section className={"top-grid"}>
                    <DeviceToggler socketService={this.socketService}/>
                </section>
                <div className={"main-grid"}>
                    <Media />
                    <div className={"motor-controls"}>{allServoMotors}</div>
                </div>

                <SeqPanel
                    controlsManager={this.controlsManager}
                    socketService={this.socketService}/>
                {busy && <Spinner/>}
                {error && (
                    <Modal
                        click={this.props.closeControllerErrorModal}
                        title={message}
                    />
                )}
                <button onClick={() => MediaService.instance.broadcast(MediaWSActions.GetPicture)}>Get Pic</button>
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
