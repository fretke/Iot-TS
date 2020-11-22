import axios from "axios";
import {SocketService} from "../Utils/SocketService";
import {EventManager} from "./EventManager";
import {ServoData} from "../App";


export default class ControlsService extends EventManager {

    private readonly restServer: string;
    private readonly userEmail: string;
    private readonly iD: string;
    private readonly wsServer: SocketService;
    private servoList: Map<string, Servo> = new Map();

    constructor(restServer: string, email: string, id: string) {
        super();
        this.restServer = restServer;
        this.userEmail = email;
        this.wsServer = new SocketService(id).init(this)
        this.iD = id;
    }

    private async sendRequest<T extends Object>(url: string, data: T): Promise<void> {
        // todo implement request fully with error handling
        try {
            const res = await axios.post(url, data);
        } catch (e) {

        }
    }

    public async moveServo (servoData: ServoData): Promise<void> {
        this.wsServer.moveServo(servoData);
        const data = {
            userEmail: this.userEmail,
            id: this.iD,
            ...servoData
        }
        const url = `${this.restServer}/updateServo`;
        await this.sendRequest(url, data);
        this.updateServo(servoData)

    }

    public playSequence (data : ServoData[]): void {
        this.wsServer.executeSequence(data);
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
