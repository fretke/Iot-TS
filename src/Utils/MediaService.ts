import {MEDIA_SERVER} from "../Settings/settings";

export enum MediaWSActions {
    Authenticate = "Authenticate",
    GetPicture = "GetPicture"
}

export enum MediaEvents {
    IncomingFrame = "IncomingFrame"
}

export class MediaService {
    private _listeners: Map<string, Array<(arg?: any) => void>> = new Map();
    private _userId: string = "";
    private _mediaSocket: WebSocket = {} as WebSocket;
    private static _instance: MediaService = new MediaService();

    private constructor() {
    }

    public static get instance(): MediaService {
        return this._instance;
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

    public addObserver(event: string, component: any, cb: (arg?: any) => void): void{
        const currentListeners = this._listeners.get(event) || [];
        currentListeners.push(cb);
        this._listeners.set(event, currentListeners);
        console.log(this._listeners, "all listeners for media");
    }

    private dispatch(event: string, arg?: any): void {
        const allListeners = this._listeners.get(event) || [];
        allListeners.forEach((cb) => cb(arg));
    }
    private manageMediaEvents(): void {
        let urlObject: string;
        this._mediaSocket.onopen = () => this.broadcast(MediaWSActions.Authenticate);
        this._mediaSocket.onmessage = message => {
            // @ts-ignore
            console.log(message, "message received from server");
            if(typeof message.data !== "string"){
                const arrayBuffer = message.data;
                if (urlObject) {
                    URL.revokeObjectURL(urlObject)
                }
                urlObject = URL.createObjectURL(new Blob([arrayBuffer]));
                this.dispatch(MediaEvents.IncomingFrame, urlObject);
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
