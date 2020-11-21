interface Admisable {
    target: Object,
    cb: Function,
}

export class EventManager {

    private readonly _listenerMap: Map<string, Array<Admisable>> = new Map();

    public addObserver(event: string, target: Object, cb: Function): void {
        const temp = this._listenerMap.get(event) || [];

        for (const listeners of temp) {
            if (listeners.target === target) return;
        }

        temp.push({target, cb});
        this._listenerMap.set(event, temp)
    }

    public dispatchEvent(event: string): void {
        const listeners = this._listenerMap.get(event) || [];

        for (const listener of listeners) {
            listener.cb();
        }
    }

    public removeObserver(target: Object): void {
        const events = Array.from(this._listenerMap.keys());

        for (const event of events) {
            const tmp = this._listenerMap.get(event) || [];
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].target === target) {
                    tmp.splice(i, 1);
                    this._listenerMap.set(event, tmp);
                    return;
                }
            }
        }
    }
}
