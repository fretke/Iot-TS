import io from "socket.io-client";
import {SERVER} from "../Settings/settings";
import {Property} from "../store/Actions";
import {servoData} from "../store/Reducers/controlsReducer";
import ControlPanel, {ControlPanelProps} from "../Containers/ControlPanel/ControlPanel";

export interface ControllerResponse {
    status: boolean;
    data: servoData[];
}

export interface ServoMoveMessage {
    servoName: string;
    property: Property;
    value: number;
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

export enum MediaWSActions {
    Authenticate = "Authenticate",
    GetPicture = "GetPicture"
}

export class SocketService {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;
    private readonly _userId: string;
    private _timer: number | undefined
    private _mediaSocket: WebSocket = {} as WebSocket;

    constructor(userId: string) {
        this._userId = userId;
    }

    public init(component: any): void {
        this.socket = io(SERVER);
        this.socket.on(ConnectionTypes.Connect, () => {
            this.socket.emit(ConnectionTypes.Room, this._userId);
        });
        this.manageConnections(component);

        this._mediaSocket = new WebSocket("ws://192.168.1.136:4000");
        this._mediaSocket.onopen = () => {
            const message = {
                event: MediaWSActions.Authenticate,
                payload: {
                    id: this._userId
                }
            }
            this._mediaSocket.send(JSON.stringify(message))
            console.log("connected to mediaServer")
        }

        this.manageMediaEvents(component);
    }

    public getFrame() :void{
        console.log("trying to send data");
        const dataToSend = {
            event: MediaWSActions.GetPicture,
            payload: {
                id: this._userId
            }
        }
        this._mediaSocket.send(JSON.stringify(dataToSend));

    }

    private manageMediaEvents(component: any): void {
        let urlObject: string;
        this._mediaSocket.onmessage = message => {
            // @ts-ignore
        console.log(message, "message received from server");
        if(typeof message.data !== "string"){
            const arrayBuffer = message.data;
                if (urlObject) {
                    URL.revokeObjectURL(urlObject)
                }
                urlObject = URL.createObjectURL(new Blob([arrayBuffer]));
                component.renderImg(urlObject);
        }

    }
    }

    private manageConnections(component: any) {
        const {
            controllerFinish,
            toggleLED,
            updateServoWS,
            updateServoAfterSeq,
            controllerStart,
            setControllerError
        } = component.props as ControlPanelProps
        this.socket.on(ConnectionTypes.Led, () => {
            toggleLED();
        });
        this.socket.on(ConnectionTypes.Servo, (data: ServoMoveMessage) => {
            console.log(data, "data from servo move")
            updateServoWS(data.servoName, data.property, data.value);
        });
        this.socket.on(ConnectionTypes.ControllerDone, (data: ControllerResponse) => {
            console.log(data, "data after controller done");
            controllerFinish();
            if (data.data) updateServoAfterSeq(data.data);
            if (this._timer) window.clearTimeout(this._timer);
            this.getFrame();
        })
        this.socket.on(ConnectionTypes.UpdateStarted, () => {
            controllerStart();
            this._timer = window.setTimeout(() => {
                if (component.props.controls.controller.busy) {
                    setControllerError("Controller not connected")
                }
            }, 20000)
        })
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public toggleLED(ledState: boolean): void {
        this.socket.emit(ConnectionTypes.UpdateBulb, ledState);
    }

    public moveServo(servoName: string, property: Property, value: number) {
        this.socket.emit(ConnectionTypes.UpdateServo, {
            servoName,
            property,
            value,
        });
    }

    public executeSequence(data: servoData[]) {
        this.socket.emit(ConnectionTypes.ExecuteSequence, data);
    }

}
