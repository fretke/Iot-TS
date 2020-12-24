import React, {ChangeEvent} from "react";
import "./Form.style.scss";
import ControlsService from "../../services/ControlsService";

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
}

export class Form extends React.Component<Props, State> {

    private readonly availablePins: string[] = this.props.controlManager.getFreePins();

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

    private addDevice(): Promise<void> {
        const {name, pin} = this.state;
        const {type} = this.props;
        if (type === FORM_TYPE.Device) {
            return this.props.controlManager.addDevice({name, pin, state: false});
        } else {
            return this.props.controlManager.addServo({name, pin, pos: 90, speed: 50});
        }
    }

    public render(): React.ReactNode {
        const {type, onClose} = this.props;
        const {name, pin} = this.state;
        return (
            <div className={"form-wrapper"}>
                <div>
                    {type === FORM_TYPE.Device ? "Add Device" : "Add Servo Motor"}
                    <div className={"grid"}>
                        <div>name</div>
                        <input name={"name"} value={name} onChange={(e) => this.updateState(e)}/>
                        <div>Pin</div>
                        <select name={"pin"} value={pin} onChange={(e) => this.updateState(e)}>
                            {this.renderOptions()}
                        </select>
                        <button onClick={() => this.addDevice().then(() => onClose())}>add</button>
                        <button onClick={() => onClose()}>cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}
