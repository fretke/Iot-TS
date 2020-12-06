interface Admisable {
    target: Object,
    cb: Function,
}

export interface Events {
    [key: string]: ({...arg}: any) => any
}

export class EventManager<T extends Events> {

    private readonly _listenerMap: Map<keyof T, Array<Admisable>> = new Map();

    public addObserver<K extends keyof T>(event: K, target: Object, cb: T[K]): EventManager<T> {
        const temp = this._listenerMap.get(event) || [];

        for (const listeners of temp) {
            if (listeners.target === target) return this;
        }

        temp.push({target, cb: cb.bind(target)});
        this._listenerMap.set(event, temp)
        return this;
    }

    public dispatchEvent<K extends keyof T>(event: K, arg?: any): void {
        const listeners = this._listenerMap.get(event) || [];

        for (const listener of listeners) {
            listener.cb(arg);
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
