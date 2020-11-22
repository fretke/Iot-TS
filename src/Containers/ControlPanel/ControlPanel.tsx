import React from "react";
import DeviceToggler from "../../Components/DeviceToggler/DeviceToggler";
import ServoControl from "../../Components/ServoControl/ServoControl";

import "./ControlPanel.style.scss";
import {MediaService, MediaWSActions} from "../../Utils/MediaService";
import {Media} from "../../Components/Media/Media";
import ControlsService from "../../services/ControlsService";
import {SERVER} from "../../Settings/settings";
import {UserService} from "../../services/UserService";
import {IoT, SequenceType, ServoData} from "../../App";
import {IncomingEvents} from "../../Utils/SocketService";
import Spinner from "../../Components/Spinner/Spinner";
import Modal from "../../Components/Modal/Modal";
import SeqPanel from "../../Components/SeqPanel/SeqPanel";

export interface ControlPanelProps {
    controls: IoT;
    client: UserService;
}

interface State {
    servos: ServoData[];
    seq: SequenceType[];
    busy: boolean;
    error?: string | null;
}

class ControlPanel extends React.Component<ControlPanelProps, State> {

    private readonly controlsManager: ControlsService;

    public constructor(props: ControlPanelProps) {
        super(props);
        const {id, userEmail} = props.client.getCredentials();
        this.controlsManager = new ControlsService(SERVER, userEmail, id);

        MediaService.instance.userId = id;
        this.state = {
            servos: this.props.controls.servos,
            seq: this.props.controls.seq,
            busy: false,
        }
    }

    public componentDidMount(): void {
        MediaService.instance.init();
        this.controlsManager.initializeServos(this.state.servos);
        this.controlsManager
            .addObserver(IncomingEvents.OnBusyChange, this, (busy: boolean) => {
                this.setState({busy})
            })
            .addObserver(IncomingEvents.NotConnected, this, (message: string) => {
                this.setState({
                    busy: false,
                    error: message
                })
            })
            .addObserver(IncomingEvents.SequenceOver, this, this.onSequenceOver.bind(this))
    }

    private onSequenceOver(data: ServoData[]): void {
        console.log(data, "data");
        const updated = this.state.servos.map((servo) => {
            for (const s of data){
                if (servo.name === s.name) {
                    servo.speed = s.speed;
                    servo.pos = s.pos;
                    return servo;
                }
            }
            return servo;
        })

        // console.log("updating after sequence end");
        this.setState({servos: updated})
    }

    public componentWillUnmount() {
        this.controlsManager.disconnect();
        MediaService.instance.disconnect();
    }

    private onModalClose(): void {
        this.setState({
            error: null
        })
    }

    render() {

        const {busy, servos, error} = this.state;

        const allServoMotors = servos.map(
            (servo, index): JSX.Element => {
                return (
                    <ServoControl
                        controlsManager={this.controlsManager}
                        key={index}
                        name={servo.name}
                        currentPos={servo.pos}
                        currentSpeed={servo.speed}
                    />
                );
            }
        );
        return (
            <div className={"control-panel"}>

                <section className={"top-grid"}>
                    <DeviceToggler controlsManager={this.controlsManager}/>
                </section>
                <div className={"main-grid"}>
                    <Media/>
                    <div className={"motor-controls"}>{allServoMotors}</div>
                </div>

                <SeqPanel
                    seq={this.state.seq}
                    controlsManager={this.controlsManager}/>
                {busy && <Spinner/>}
                {error && (
                    <Modal
                        click={() => this.onModalClose()}
                        title={error}
                    />
                )}
                <button onClick={() => MediaService.instance.broadcast(MediaWSActions.GetPicture)}>Get Pic</button>
            </div>
        );
    }
}

export default ControlPanel;
