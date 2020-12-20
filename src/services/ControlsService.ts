import {SocketService, wsActions} from "./SocketService";
import {EventManager} from "./EventManager";
import {RestApi} from "./RestApi";
import {MediaService, MediaWSActions} from "./MediaService";
import {SERVER} from "../Settings/settings";

export interface SequenceType {
    seqName: string;
    moves: ServoData[];
}

export interface ServoData {
    pin?: string;
    name: string;
    pos: number;
    speed: number;
}

export interface _Switch {
    pin?: string,
    name: string,
    state: boolean
}

export enum OutgoingEvents {
    updateDevice = "updateDevice",
    updateServo = "updateServo",
    liveControl = "liveControl",
    executeSequence = "executeSequence"
}

export enum IncomingEvents {
    connect = "connect",
    // onDeviceToggle = "onDeviceToggle",
    onServoUpdate = "onServoUpdate",
    // onUpdateStarted = "onUpdateStarted",
    // onUpdateFinished = "onUpdateFinished",
    onBusyChange = "onBusyChange",
    notConnected = "notConnected",
    onSequenceOver = "onSequenceOver"
}

export interface ControlServiceWsEvents extends wsActions{

    onDeviceToggle: () => void;
    onServoUpdate: (data: ServoData) => void;
    onUpdateFinished: () => void;
    onUpdateStarted: () => void;
    onSequenceOver: (data: ServoData[]) => void;
}

export interface ControlServiceEvents extends ControlServiceWsEvents {
    onSequenceDelete: (title: string) => void,
    onSequenceAdded: (entry: SequenceType) => void,
    onNewMoveAdded: (data: ServoData) => void
}


export default class ControlsService extends EventManager<ControlServiceEvents> {

    private readonly userEmail: string;
    private readonly iD: string;
    private readonly wsServer: SocketService<ControlServiceWsEvents>;
    private readonly restApi: RestApi;
    private servoList: Map<string, Servo> = new Map();

    private _timer: number | undefined;

    constructor(restServer: string, email: string, id: string) {
        super();
        this.restApi = new RestApi(restServer);
        this.userEmail = email;
        this.wsServer = new SocketService(SERVER);
        this.iD = id;
    }

    public start(): void {
        const actionHandlers : ControlServiceWsEvents = {
            onDeviceToggle: () => this.dispatchEvent("onDeviceToggle"),
            onServoUpdate: (data: ServoData) => this.updateServo(data).dispatchEvent(`onServoUpdate`, data),
            onUpdateFinished: () => this.finishedUpdate(),
            onUpdateStarted: () => this.startUpdate(),
            onSequenceOver: (data) => {
                this.dispatchEvent("onSequenceOver", data);
                this.finishedUpdate();
            }

        }

        this.wsServer.init(actionHandlers, {name: "room", data: this.iD});
    }

    private finishedUpdate(): void {
        this.dispatchEvent("onBusyChange", false);
        if (this._timer) window.clearTimeout(this._timer);
        MediaService.instance.broadcast(MediaWSActions.GetPicture);
    }

    private startUpdate(): void {
        this.dispatchEvent("onBusyChange", true);
        this._timer = window.setTimeout(() => {
            if (this._timer) {
                this.dispatchEvent("notConnected", "Controller not connected");
            }
        }, 20000)
    }

    public async moveServo (servoData: ServoData): Promise<void> {
        const data = {
            userEmail: this.userEmail,
            id: this.iD,
            ...servoData
        }
        await this.restApi.sendRequest("/updateServo", data);
        this.wsServer.sendRequest(OutgoingEvents.updateServo, data);
        this.updateServo(servoData);

    }

    public speedMove(servoData: ServoData): void {
        this.wsServer.sendRequest(OutgoingEvents.liveControl, servoData);
    }

    public playSequence (data : ServoData[]): void {
        this.wsServer.sendRequest(OutgoingEvents.executeSequence, data);
    }

    public async deleteSequence(title: string): Promise<void> {
        await this.restApi.sendRequest("/deleteSequence", {title, userEmail: this.userEmail});
        this.dispatchEvent("onSequenceDelete", title);
    }

    public async saveSequence(newEntry: SequenceType): Promise<void> {
        await this.restApi.sendRequest("/saveNewSequence", {userEmail: this.userEmail, newEntry});
        this.dispatchEvent("onSequenceAdded", newEntry);
    }

    public async toggleDevice(name: string, status: boolean): Promise<void> {
        this.wsServer.sendRequest(OutgoingEvents.updateDevice, {name, status});
    }

    public initializeServos(data: ServoData[]): void {
        for (const servo of data) {
            this.servoList.set(servo.name, new Servo(servo.name, servo.pos, servo.speed))
        }
    }

    public updateServo (data: ServoData): ControlsService {
        const {name, pos, speed} = data;
        const servo = this.servoList.get(name);
        if (servo) {
                servo.position = pos;
                servo.speed = speed;
        }
        return this;
    }

    public disconnect(): void {
        this.wsServer.disconnect();
    }

}

export class Servo {
    private readonly name: string;
    private _position: number;
    private _speed: number;


    constructor(name: string, position: number, speed: number) {
        this.name = name;
        this._position = position;
        this._speed = speed;
    }


    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get speed(): number {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
    }
}
