import io from "socket.io-client";
import { SERVER } from "../Settings/settings";
import { Property } from "../store/Actions";
import { servoData } from "../store/Reducers/controlsReducer";

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
  UpdateBulb = "UpdateBulb",
  UpdateServo = "UpdateServo",
  ExcecuteSequence = "ExecuteSequence",
  Room = "room",
  Connect = "connect"
}

export class SocketService {
  private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

  public init(id: string, component: any): SocketService {
    this.socket = io(SERVER);
    this.socket.on(ConnectionTypes.Connect, () => {
      this.socket.emit(ConnectionTypes.Room, id);
    });
    this.manageConnections(component);
    return this;
  }

  private manageConnections(component: any){
    this.socket.on(ConnectionTypes.Led, () => {
      component.manageWsEvents(ConnectionTypes.Led);
    });
    this.socket.on(ConnectionTypes.Servo, (data: any) => {
      console.log(data, "data from servo move")
      component.manageWsEvents(ConnectionTypes.Servo, data);
    });
    this.socket.on(ConnectionTypes.ControllerDone, (data: any) => {
      component.manageWsEvents(ConnectionTypes.ControllerDone, data);
    })
    this.socket.on(ConnectionTypes.UpdateStarted, () => {
      component.manageWsEvents(ConnectionTypes.UpdateStarted);
    })
  }

  public disconnect(): void {
    this.socket.disconnect();
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
