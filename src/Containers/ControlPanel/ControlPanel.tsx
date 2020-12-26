import React from "react";
import {DeviceToggler} from "../../Components/DeviceToggler/DeviceToggler";
import ServoControl from "../../Components/ServoControl/ServoControl";

import "./ControlPanel.style.scss";
import {MediaService} from "../../services/MediaService";
import {Media} from "../../Components/Media/Media";
import ControlsService, {CompleteServoData, Device, SequenceType, ServoData} from "../../services/ControlsService";
import {SERVER} from "../../Settings/settings";
import {UserService} from "../../services/UserService";
import {IoT} from "../../App";
import Spinner from "../../Components/Spinner/Spinner";
import {Modal} from "../../Components/Modal/Modal";
import SeqPanel from "../../Components/SeqPanel/SeqPanel";
import {InteractivePanel} from "../../Components/InteractivePanel/InteractivePanel";
import {Form, FORM_TYPE} from "../../Components/Common/Form";

export interface ControlPanelProps {
    controls: IoT;
    client: UserService;
}

interface State {
    servos: CompleteServoData[];
    seq: SequenceType[];
    switches: Device[];
    busy: boolean;
    error?: string | null;
    showControlPad: boolean;
    showSequence: boolean;
    showAddSwitch: boolean;
    showAddMotor: boolean;
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
            switches: this.props.controls.switches,
            busy: false,
            showControlPad: false,
            showSequence: false,
            showAddSwitch: false,
            showAddMotor: false
        }
    }

    public componentDidMount(): void {
        MediaService.instance.init();
        this.controlsManager.initializeControls(this.props.controls);
        this.controlsManager
            .addObserver("onBusyChange", this, (busy: boolean) => this.setState({busy}))
            .addObserver("notConnected", this, this.onError)
            .addObserver("onSequenceOver", this, this.onSequenceOver)
            .addObserver("onSequenceDelete", this, this.deleteSequence)
            .addObserver("onServoUpdate", this, this.onServoUpdate)
            .addObserver("onDeviceUpdate", this, this.addDevice)
            .addObserver("onServoListUpdate", this, this.onServoListChange)
            .addObserver("onSequenceAdded", this, this.addSequence);

        this.controlsManager.start();
    }

    public componentWillUnmount() {
        this.controlsManager.disconnect();
        MediaService.instance.disconnect();
    }

    private addDevice(data: Device[]): void {
        this.setState({switches: [...data]})
    }

    private onServoListChange(data: CompleteServoData[]): void {
        this.setState({servos: [...data]})
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

    private onFormClose(): void {
        this.setState({showAddSwitch: false, showAddMotor: false})
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
        return this.state.switches.map((item, i) => <DeviceToggler
            key={item.name + i}
            device={item}
            controlsManager={this.controlsManager} />)
    }

    render() {

        const {busy, servos, error, showControlPad, showSequence, showAddSwitch, showAddMotor} = this.state;

        const allServoMotors = servos.map(
            (servo, index): JSX.Element => {
                // console.log(servo.pos, "position of " + servo.name);
                // console.log(servo, "servo");
                return (
                    <ServoControl
                        controlsManager={this.controlsManager}
                        key={servo.name + index}
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
                    <button onClick={() => this.setState({showAddSwitch: true})}>Add</button>
                </section>
                <div className={"main-grid"}>
                    {mainWindow}
                    <div className={"motor-controls"}>
                        {allServoMotors}
                        <button onClick={() => this.setState({showAddMotor: true})}>Add motor</button>
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
                {/*<button onClick={() => MediaService.instance.broadcast(MediaWSActions.GetPicture)}>Get Pic</button>*/}
                {showAddSwitch && <Form
                    type={FORM_TYPE.Device}
                    onClose={() => this.onFormClose()}
                    controlManager={this.controlsManager}/>}
                {showAddMotor && <Form
                    type={FORM_TYPE.ServoMotor}
                    controlManager={this.controlsManager}
                    onClose={() => this.onFormClose()} />}
            </div>
        );
    }
}
