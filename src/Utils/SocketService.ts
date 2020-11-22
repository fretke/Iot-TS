import io from "socket.io-client";
import {SERVER} from "../Settings/settings";
import {Property} from "../store/Actions";
import {servoData} from "../store/Reducers/controlsReducer";
import ControlPanel, {ControlPanelProps} from "../Containers/ControlPanel/ControlPanel";
import {MediaService, MediaWSActions} from "./MediaService";
import {EventManager} from "../services/EventManager";
import ControlsService from "../services/ControlsService";
import {ServoData} from "../App";

export interface ControllerResponse {
    status: boolean;
    data: servoData[];
}

export interface ServoMoveMessage {
    servoName: string;
    pos: number;
    speed: number;
}

export enum ConnectionTypes {
    Led = "led",
    Servo = "Servo",
    ControllerDone = "controllerDone",
    UpdateStarted = "updateStarted",
    UpdateBulb = "updateBulb",
    UpdateServo = "updateServo",
    ExecuteSequence = "excecuteSequence",
    Room = "room",
    Connect = "connect"
}

export enum OutgoingEvents {
    UpdateDevice = "UpdateDevice",
    UpdateServo = "UpdateServo"

}

export enum IncomingEvents {
    ToggleDevice = "led",
    OnServoUpdate = "Servo",
    UpdateStarted = "updateStarted",
    UpdateFinished = "updateFinished",
    OnBusyChange = "OnBusyChange",
    NotConnected = "NotConnected",
    SequenceOver = "SequenceOver"
}

export class SocketService extends EventManager {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;
    private readonly _userId: string;
    private _timer: number | undefined

    constructor(userId: string) {
        super();
        this._userId = userId;
        return this;
    }

    public init(service: ControlsService): SocketService {
        this.socket = io(SERVER);
        this.socket.on(ConnectionTypes.Connect, () => {
            this.socket.emit(ConnectionTypes.Room, this._userId);
        });
        this.manageEvents(service);
        return this;
    }

    private manageEvents(service: ControlsService) {

        this.socket.on(IncomingEvents.ToggleDevice, () => {
            service.dispatchEvent(IncomingEvents.ToggleDevice);
        });
        this.socket.on(IncomingEvents.OnServoUpdate, (data: ServoData) => {
            console.log(data, "data from servo move")
            service.updateServo(data).dispatchEvent(IncomingEvents.OnServoUpdate + data.name, data);
        });
        this.socket.on(IncomingEvents.UpdateFinished, (data: ControllerResponse) => {
            service.dispatchEvent(IncomingEvents.OnBusyChange, false);
            if (this._timer) window.clearTimeout(this._timer);
            MediaService.instance.broadcast(MediaWSActions.GetPicture);
        })
        this.socket.on(IncomingEvents.UpdateStarted, () => {
            service.dispatchEvent(IncomingEvents.OnBusyChange, true);

            this._timer = window.setTimeout(() => {
                if (this._timer) {
                    service.dispatchEvent(IncomingEvents.NotConnected, "Controller not connected");
                }
            }, 20000)
        })

        this.socket.on(IncomingEvents.SequenceOver, (data: ServoData[]) => {
            service.dispatchEvent(IncomingEvents.OnBusyChange, false);
            if (this._timer) window.clearTimeout(this._timer);
            service.dispatchEvent(IncomingEvents.SequenceOver, data);
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public toggleLED(deviceState: boolean): void {
        this.socket.emit(OutgoingEvents.UpdateDevice, deviceState);
    }

    public moveServo(data: servoData) {
        this.socket.emit(OutgoingEvents.UpdateServo, data);
    }

    public executeSequence(data: servoData[]) {
        this.socket.emit(ConnectionTypes.ExecuteSequence, data);
    }

}
