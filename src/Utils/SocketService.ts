import io from "socket.io-client";
import {IncomingEvents} from "../services/ControlsService";

export interface wsActions {
    [key: string]: ({...arg}: any) => any
}

export class SocketService<T extends wsActions> {
    private readonly _url: string;
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    constructor(url:string) {
        this._url = url;
        return this;
    }

    public init(customActions: T, onConnect: {name: string, data: any}): void {
        const {name, data} = onConnect
        this.socket = io(this._url);
        this.socket.on(IncomingEvents.connect, () => {
            this.socket.emit(name, data);

        });
        this.manageEvents(customActions);
    }

    private manageEvents(actions: T) {

        for (const name in actions){
            if (actions.hasOwnProperty(name)){
                this.socket.on(name, actions[name]);
            }
        }
    }

    public sendRequest(req: string, data: any): void {
        this.socket.emit(req, data);
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}
