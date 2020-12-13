import {MEDIA_SERVER} from "../Settings/settings";
import {EventManager, Events} from "./EventManager";

export enum MediaWSActions {
    Authenticate = "Authenticate",
    GetPicture = "GetPicture"
}

export interface MediaEvents extends Events {
    incomingFrame: (url: string) => void
}

export class MediaService extends EventManager<MediaEvents> {
    private _userId: string = "";
    private _lastPicture: string = "";
    private _mediaSocket: WebSocket = {} as WebSocket;
    private static _instance: MediaService = new MediaService();

    private constructor() {
        super();
    }

    public static get instance(): MediaService {
        return this._instance;
    }

    get lastPicture(): string {
        return this._lastPicture;
    }

    set userId(value: string) {
        this._userId = value;
    }

    public init(): void {
        this._mediaSocket = new WebSocket(MEDIA_SERVER);
        this.manageMediaEvents();
    }

    public disconnect(): void {
        this._mediaSocket.close();
    }

    private manageMediaEvents(): void {
        let urlObject: string;
        this._mediaSocket.onopen = () => this.broadcast(MediaWSActions.Authenticate);
        this._mediaSocket.onmessage = message => {
            // @ts-ignore
            if(typeof message.data !== "string"){
                const arrayBuffer = message.data;
                if (urlObject) {
                    URL.revokeObjectURL(urlObject)
                }
                urlObject = URL.createObjectURL(new Blob([arrayBuffer]));
                this.dispatchEvent("incomingFrame", urlObject);
                this._lastPicture = urlObject;
            }

        }
    }

    public broadcast(event: MediaWSActions) :void{
        const dataToSend = {
            event: event,
            payload: {
                id: this._userId
            }
        }
        this._mediaSocket.send(JSON.stringify(dataToSend));
    }
}
