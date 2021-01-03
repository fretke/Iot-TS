import React, {ChangeEvent} from "react";
import "./Form.style.scss";
import ControlsService from "../../services/ControlsService";
import {NotificationService} from "../../services/NotificationService";

export enum FORM_TYPE {
    Device,
    ServoMotor
}

interface Props {
    controlManager: ControlsService;
    onClose: () => void;
    type: FORM_TYPE
}

interface State {
    name: string,
    pin: string,
    state?: boolean
    error?: string
}

export class Form extends React.Component<Props, State> {

    private readonly availablePins: string[] = ["", ...this.props.controlManager.getFreePins()];

    public constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            pin: "",
        }
    }

    private renderOptions(): React.ReactNode {
        return this.availablePins.map((pin) => <option key={pin}>{pin}</option>)
    }

    private updateState(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        const {value, name} = e.target;
        switch (name) {
            case "name": this.setState({name: value});
            break;
            case "pin": this.setState({pin: value});
        }
    }

    private async addDevice(): Promise<void> {
        const {name, pin} = this.state;
        const {type} = this.props;
        try {
            if (!pin) {
                NotificationService.warn("You must select pin number!");
                return;

            } else if (!name || Array.from(this.props.controlManager.switchMap.keys()).find((item) => item === name)){
                NotificationService.warn("Names have to be unique!");
                return;
            }
            if (type === FORM_TYPE.Device) {
                await this.props.controlManager.addDevice({name, pin, state: false});
            } else {
                await this.props.controlManager.addServo({name, pin, pos: 90, speed: 50});
            }
            this.props.onClose();
        } catch (e) {

        }
    }

    private cancel(): void {
        this.props.onClose();
    }

    public render(): React.ReactNode {
        const {type, onClose} = this.props;
        const {name, pin} = this.state;
        return (
            <div onClick={() => onClose()} className={"form-wrapper"}>
                <div onClick={(e) => e.stopPropagation()}>
                    <h1 className={"title"}>{type === FORM_TYPE.Device ? "Add Device" : "Add Servo Motor"}</h1>
                    <div className={"grid"}>
                        <div>name</div>
                        <input name={"name"} value={name} onChange={(e) => this.updateState(e)}/>
                        <div>Pin</div>
                        <select name={"pin"} value={pin} onChange={(e) => this.updateState(e)}>
                            {this.renderOptions()}
                        </select>
                        <button className={"success"} onClick={() => this.addDevice()}>add</button>
                        <button className={"danger"} onClick={() => this.cancel()}>cancel</button>
                    </div>
                    <button onClick={() => onClose()} className={"cross"}>X</button>
                </div>
            </div>
        )
    }
}
