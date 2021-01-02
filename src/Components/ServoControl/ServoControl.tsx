import React, {ChangeEvent} from "react";

import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

import "./ServoControls.style.scss";
import ControlsService, {ServoData} from "../../services/ControlsService";
import {NotificationService} from "../../services/NotificationService";

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
    showDeleteButton: boolean;
}

class ServoControl extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        const {currentPos, currentSpeed} = this.props;
        this.state = {
            pos: currentPos,
            speed: currentSpeed,
            seqCreation: false,
            showDeleteButton: false,
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
    }

    public componentWillUnmount(): void {
        this.props.controlsManager.removeObserver(this);
    }

    private saveNewMove(): void {
        const {controlsManager, name} = this.props;
        const {pos, speed} = this.state;
        const move: ServoData = {name, pos, speed};
        controlsManager.dispatchEvent("onNewMoveAdded", move);
    }

    private onInputChange (e: ChangeEvent<HTMLInputElement>): void {
        const {name, value} = e.target;
        if (name === "position") {
            if (+value > 180 || +value < 0) {
                NotificationService.warn("Position values must be from 0 to 180");
                return;
            }
            this.setState({pos: +value})
        } else {
            if (+value > 100|| +value < 0) {
                NotificationService.warn("Speed values must be from 0 to 100");
                return;
            }
            this.setState({speed: +value});
        }
    }

    private onMoveHandler (): Promise<void> {
        const {speed, pos} = this.state;
        const {controlsManager, name} = this.props;

        return controlsManager.moveServo({name, speed, pos});
    }

    private onDelete (): Promise<void> {
        return this.props.controlsManager.deleteServo(this.props.name);
    }

    render() {
        const {pos, speed, seqCreation, showDeleteButton} = this.state;
        const {name} = this.props;

        return (
            <>
                    <div
                        onMouseEnter={() => this.setState({showDeleteButton: true})}
                        onMouseLeave={() => this.setState({showDeleteButton: false})}
                        className={"servo-container"}>
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
                                        onClick={() => this.saveNewMove()}
                                        aria-label="save"
                                        color="primary"
                                    >
                                        <SaveIcon/>
                                    </IconButton>
                                )}
                            </div>
                        </fieldset>
                        {showDeleteButton && <button onClick={() => this.onDelete()} >X</button>}
                    </div>
            </>
        );
    }
}


export default ServoControl;
