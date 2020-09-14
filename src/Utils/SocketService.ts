import io from "socket.io-client";
import { SERVER } from "../Settings/settings";
import { fromEvent, Observable } from "rxjs";
import { Property } from "../store/Actions";

export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(id: string): SocketService {
    this.socket = io(SERVER);
    this.socket.on("connect", () => {
      this.socket.emit("room", id);
    });
    return this;
  }
  public onLED(): Observable<any> {
    return fromEvent(this.socket, "led");
  }

  public onServoMove(): Observable<any> {
    return fromEvent(this.socket, "Servo");
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
}
