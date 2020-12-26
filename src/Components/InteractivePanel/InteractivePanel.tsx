import React from "react";
import "./InteractivePanel.style.scss";
import ControlsService from "../../services/ControlsService";

interface Props {
    controlsManager: ControlsService
}

interface State {
    xPos: number,
    yPos: number,
    showHint: boolean

}

const SERVO_MAX_STEPS = 180;
const SERVO_PRECISION = 1;

export class InteractivePanel extends React.Component<Props, State> {

    private mouseDown = false;

    private names: {[key: string]: string};

    constructor(props: Props) {
        super(props);
        const arr = Array.from(this.props.controlsManager.servoMap.values());
        this.names = {
            firstMotor: arr[0]._name,
            secondMotor: arr[1]._name
        }
        this.state = {
            xPos: 0,
            yPos: 0,
            showHint: false
        }
    }

    private readonly canvas = React.createRef<HTMLDivElement>();

    private async move(e: React.MouseEvent): Promise<void> {

        const {xPos, yPos} = this.state;
        let change = false;
        if (this.canvas.current) {
            const {offsetTop, offsetLeft, offsetHeight, offsetWidth} = this.canvas.current;
            const xCord = Math.round((e.pageX - offsetLeft) * (SERVO_MAX_STEPS / offsetWidth));
            const yCord = Math.round((e.pageY - offsetTop) * (SERVO_MAX_STEPS / offsetHeight));

            if (Math.abs(xCord - xPos) > SERVO_PRECISION) {
                await this.props.controlsManager.speedMove({name: this.names.firstMotor, pos: xCord, speed: 99})
                change = true;
            }
            if (Math.abs(yCord - yPos) > SERVO_PRECISION) {
                await this.props.controlsManager.speedMove({name: this.names.secondMotor, pos: yCord, speed: 99})
                change = true;
            }
            if (change) this.setState({xPos: xCord, yPos: yCord});
        }
    }

    public render(): React.ReactNode {
        const {xPos, yPos} = this.state;
        const rotationX = {transform: `rotate(${xPos}deg)`}
        const rotationY = {transform: `rotate(${yPos}deg)`}
        return (
            <div
                ref={this.canvas}
                onMouseEnter={() => this.setState({showHint: true})}
                onMouseLeave={() => this.setState({showHint: false})}
                onMouseDown={() => this.mouseDown = true}
                onMouseUp={() => this.mouseDown = false}
                onMouseMove={(e) => this.mouseDown && this.move(e)} className={"interactive-panel"}>
                {/*{showHint && "Click, Hold, Drag!"}*/}
                <div style = {rotationX}>
                    <div></div>
                </div>
                <div style = {rotationY}>
                    <div></div>
                </div>
            </div>
        )
    }
}
