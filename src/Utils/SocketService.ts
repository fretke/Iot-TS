import io from "socket.io-client";
import { SERVER } from "../Settings/settings";
import { fromEvent, Observable } from "rxjs";
import { Property } from "../store/Actions";
import { servoData } from "../store/Reducers/controlsReducer";

export interface ControllerResponse {
  status: boolean;
}

export interface ServoMoveMessage {
  servoName: string;
  property: Property;
  value: number;
}

export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(id: string): SocketService {
    this.socket = io(SERVER);
    this.socket.on("connect", () => {
      this.socket.emit("room", id);
    });
    return this;
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
  public onLED(): Observable<any> {
    return fromEvent(this.socket, "led");
  }

  public onServoMove(): Observable<ServoMoveMessage> {
    return fromEvent(this.socket, "Servo");
  }

  public onControllerResponse(): Observable<ControllerResponse> {
    return fromEvent(this.socket, "controllerDone");
  }

  public onControllerStart(): Observable<void> {
    return fromEvent(this.socket, "updateStarted");
  }

  public toggleLED(ledState: boolean): void {
    this.socket.emit("updateBulb", ledState);
  }

  public moveServo(servoName: string, property: Property, value: number) {
    this.socket.emit("updateServo", {
      servoName,
      property,
      value,
    });
  }

  public excecuteSequence(data: servoData[]) {
    this.socket.emit("excecuteSequence", data);
  }
}
