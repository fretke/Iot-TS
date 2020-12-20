import React from "react";
import {DeviceToggler} from "../../Components/DeviceToggler/DeviceToggler";
import ServoControl from "../../Components/ServoControl/ServoControl";

import "./ControlPanel.style.scss";
import {MediaService, MediaWSActions} from "../../services/MediaService";
import {Media} from "../../Components/Media/Media";
import ControlsService, {SequenceType, ServoData} from "../../services/ControlsService";
import {SERVER} from "../../Settings/settings";
import {UserService} from "../../services/UserService";
import {IoT} from "../../App";
import Spinner from "../../Components/Spinner/Spinner";
import {Modal} from "../../Components/Modal/Modal";
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
    showSequence: boolean;
}

export class ControlPanel extends React.Component<ControlPanelProps, State> {

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
            showControlPad: false,
            showSequence: false
        }
    }

    public componentDidMount(): void {
        this.controlsManager.start();
        MediaService.instance.init();
        this.controlsManager.initializeServos(this.state.servos);
        this.controlsManager
            .addObserver("onBusyChange", this, (busy: boolean) => this.setState({busy}))
            .addObserver("notConnected", this, this.onError)
            .addObserver("onSequenceOver", this, this.onSequenceOver)
            .addObserver("onSequenceDelete", this, this.deleteSequence)
            .addObserver("onServoUpdate", this, this.onServoUpdate)
            .addObserver("onSequenceAdded", this, this.addSequence);
    }

    public componentWillUnmount() {
        this.controlsManager.disconnect();
        MediaService.instance.disconnect();
    }

    private addSequence(entry: SequenceType): void {
        this.setState({seq: [...this.state.seq, entry]})
    }

    private deleteSequence(title: string): void {
        const updatedSequences = this.state.seq.filter((seq) => seq.seqName !== title);
        this.setState({seq: updatedSequences});
    }

    private onError(message: string): void {
        this.setState({
            busy: false,
            error: message
        });
    }

    private onServoUpdate(data: ServoData): void {
        const updated = this.state.servos.map((servo) => {
            if (servo.name === data.name){
                Object.assign(servo, data);
                return servo;
            }
            return servo;
        });
        this.setState({servos: updated})
    }

    private onSequenceOver(data: ServoData[]): void {
        const updated = this.state.servos.map((servo) => {
            for (const s of data){
                if (servo.name === s.name) {
                    servo.speed = +s.speed;
                    servo.pos = +s.pos;
                    return servo;
                }
            }
            return servo;
        });

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

    private renderSwitches(): React.ReactNode {
        const {switches} = this.props.controls;
        return switches.map((item, i) => <DeviceToggler
            key={item.name + i}
            device={item}
            controlsManager={this.controlsManager} />)
    }

    render() {

        const {busy, servos, error, showControlPad, showSequence} = this.state;

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

        let mainWindow: React.ReactNode = <Media />;

        if (showControlPad) mainWindow = (<InteractivePanel controlsManager={this.controlsManager} />);
        if (showSequence) mainWindow = (<SeqPanel
            seq={this.state.seq}
            controlsManager={this.controlsManager}/>)

        return (
            <div className={"control-panel"}>

                <section className={"top-grid"}>
                    {this.renderSwitches()}
                </section>
                <div className={"main-grid"}>
                    {mainWindow}
                    <div className={"motor-controls"}>
                        {allServoMotors}
                        <button className={"large"} onClick={() => this.showPad()}>{showControlPad ? "SHOW MEDIA" : "SHOW CONTROL PAD"}</button>
                    </div>
                </div>

                <div className={"bottom-grid"}>
                    <button onClick={() => this.setState({showSequence: !this.state.showSequence})}> SHOW SEQUENCE </button>
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
