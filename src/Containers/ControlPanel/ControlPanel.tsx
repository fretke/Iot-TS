import React from "react";
import DeviceToggler from "../../Components/DeviceToggler/DeviceToggler";
import ServoControl from "../../Components/ServoControl/ServoControl";

import "./ControlPanel.style.scss";
import {MediaService, MediaWSActions} from "../../Utils/MediaService";
import {Media} from "../../Components/Media/Media";
import ControlsService, {SequenceType, ServoData} from "../../services/ControlsService";
import {SERVER} from "../../Settings/settings";
import {UserService} from "../../services/UserService";
import {IoT} from "../../App";
import Spinner from "../../Components/Spinner/Spinner";
import Modal from "../../Components/Modal/Modal";
import SeqPanel from "../../Components/SeqPanel/SeqPanel";
import {InteractivePanel} from "../../Components/InteractivePanel/InteractivePanel";

export interface ControlPanelProps {
    controls: IoT;
    client: UserService;
}

interface State {
    servos: ServoData[];
    seq: SequenceType[];
    busy: boolean;
    error?: string | null;
    showControlPad: boolean;
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
            showControlPad: false
        }
    }

    public componentDidMount(): void {
        this.controlsManager.start();
        MediaService.instance.init();
        this.controlsManager.initializeServos(this.state.servos);
        this.controlsManager
            .addObserver("onBusyChange", this, (busy: boolean) => {
                this.setState({busy})
            })
            .addObserver("notConnected", this, (message: string) => {
                this.setState({
                    busy: false,
                    error: message
                })
            })
            .addObserver("onSequenceOver", this, this.onSequenceOver.bind(this));
    }

    public componentWillUnmount() {
        this.controlsManager.disconnect();
        MediaService.instance.disconnect();
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

        this.setState({servos: updated})
    }

    private onModalClose(): void {
        this.setState({
            error: null
        })
    }

    private showPad(): void {
        const show = !this.state.showControlPad;
        this.setState({showControlPad: show})
    }

    render() {

        const {busy, servos, error, showControlPad} = this.state;

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
                    {!showControlPad ? <Media/> : <InteractivePanel controlsManager={this.controlsManager} />}
                    <div className={"motor-controls"}>
                        {allServoMotors}
                        <button className={"large"} onClick={() => this.showPad()}>{showControlPad ? "SHOW MEDIA" : "SHOW CONTROL PAD"}</button>
                    </div>
                </div>

                <div className={"bottom-grid"}>
                    <SeqPanel
                        seq={this.state.seq}
                        controlsManager={this.controlsManager}/>
                </div>
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
