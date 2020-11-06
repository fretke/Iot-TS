
export class StateManager {
    private _components: Map<string, Array<any>> = new Map();
    private static _instance = new StateManager();

    private constructor() {
    }

    public addObserver (event: string, component: any, callback: () => void): void {
        const listeners = this._components.get(event) || [];
        listeners.push(callback.bind(component));
        this._components.set(event, listeners);
    }

    public static get instance(){
        return this._instance;
    }

    public dispatch (event: string): void {
        const allListeners = this._components.get(event) || [];
        allListeners.forEach((cb) => {
            cb();
        });
    }
}
