import axios from "axios";
import {SocketService} from "../Utils/SocketService";
import {Property} from "../store/Actions";
import {EventManager} from "./EventManager";

interface ServoData {
    name?: string,
    pos: number,
    speed: number
}

export default class ControlsService extends EventManager {

    private readonly restServer: string;
    private readonly userEmail: string;
    private readonly iD: string;
    private readonly wsServer: SocketService;
    private servoList: Array<Servo> = [];

    constructor(restServer: string, email: string, id: string, socket: SocketService) {
        super();
        this.restServer = restServer;
        this.userEmail = email;
        this.wsServer = socket;
        this.iD = id;
    }

    private async sendRequest<T extends Object>(url: string, data: T): Promise<void> {
        try {
            const res = await axios.post(url, data);
        } catch (e) {

        }
    }

    public async updateServo (servoName: string, servoData: ServoData): Promise<void> {
        this.wsServer.moveServo(servoName, Property.speed, servoData.speed);
        this.wsServer.moveServo(servoName, Property.pos, servoData.pos);
        const data = {
            userEmail: this.userEmail,
            id: this.iD,
            servoName,
            ...servoData
        }
        const url = `${this.restServer}/updateServo`;

        await this.sendRequest(url, data);
    }

    public initializeServos(data: ServoData[]): void {
        for (const servo of data) {
            const name = servo.name || "";
            this.servoList.push(new Servo(name, servo.pos, servo.speed));
        }
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
