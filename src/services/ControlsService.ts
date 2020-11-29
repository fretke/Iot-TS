import {SocketService} from "../Utils/SocketService";
import {EventManager} from "./EventManager";
import {ServoData} from "../App";
import {RestApi} from "./RestApi";


export default class ControlsService extends EventManager {

    private readonly userEmail: string;
    private readonly iD: string;
    private readonly wsServer: SocketService;
    private readonly restApi: RestApi;
    private servoList: Map<string, Servo> = new Map();

    constructor(restServer: string, email: string, id: string) {
        super();
        this.restApi = new RestApi(restServer);
        this.userEmail = email;
        this.wsServer = new SocketService(id).init(this)
        this.iD = id;
    }

    public async moveServo (servoData: ServoData): Promise<void> {
        const data = {
            userEmail: this.userEmail,
            id: this.iD,
            ...servoData
        }
        await this.restApi.sendRequest("/updateServo", data)
        this.wsServer.moveServo(servoData);
        this.updateServo(servoData)

    }

    public speedMove(servoData: ServoData): void {
        this.wsServer.speedMove(servoData);
    }

    public playSequence (data : ServoData[]): void {
        this.wsServer.executeSequence(data);
    }

    public async deleteSequence(title: string, userEmail: string): Promise<void> {
        await this.restApi.sendRequest("/deleteSequence", {title, userEmail});
    }

    public async toggleDevice(status: boolean): Promise<void> {
        this.wsServer.toggleLED(status)
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
