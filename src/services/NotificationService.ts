import {EventManager, Events} from "./EventManager";

interface NotificationEvents extends Events {
    notificationUpdate: (notifications: Message[]) => void
}

export interface Message {
    content: string,
    type?: UIType
}

export enum UIType {
    Danger = "danger",
    Success = "success",
    Warning = "warning"
}

export class NotificationService extends EventManager<NotificationEvents> {

    private _notifications: Map<number, Message> = new Map();
    private _currentNumber: number;

    private static instance = new NotificationService();

    private constructor() {
        super();
        this._currentNumber = 0;
    }

    private get notifications(): Message[] {
        const arr = Array.from(this._notifications.values())
        arr.push({content: ""});
        return arr;
    }

    public static getInstance(): NotificationService {
        return this.instance;
    }

    private addNotification(msg: string, type: UIType): void {
        const previousMsg = this._notifications.get(this._currentNumber - 1);
        if (previousMsg && previousMsg.content === msg) return;
        this._notifications.set(this._currentNumber, {content: msg, type});
        const pos = this._currentNumber;
        window.setTimeout(() => {
            this.removeNotification(pos);
        }, 2000);
        this.dispatchEvent("notificationUpdate", this.notifications);
        this._currentNumber++;
    }

    public static warn(msg: string): void {
        this.getInstance().addNotification(msg, UIType.Warning);
    }

    public static post(msg: string): void {
        this.getInstance().addNotification(msg, UIType.Success);
    }

    public static error(msg: string): void {
        this.getInstance().addNotification(msg, UIType.Danger);
    }

    private removeNotification(pos: number): void {
        this._notifications.delete(pos);
        this.dispatchEvent("notificationUpdate", this.notifications);
        this._currentNumber--;
    }
}
