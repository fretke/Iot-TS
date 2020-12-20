import {RestApi} from "./RestApi";
import {EventManager, Events} from "./EventManager";
import {LogInState} from "../Components/LogIn/LogIn";
import Cookies from "universal-cookie";
import {IoT} from "../App";

export interface UserServiceEvents extends Events {
    onLoggedIn: (data: IoT) => void,
    onError: (message: string) => void
}

export class UserService extends EventManager<UserServiceEvents> {
    private _isAuth: boolean = false;
    private _userName: string = "";
    private _userEmail: string = "";
    private _id: string = "";
    private _restApi: RestApi;
    private _cookie = new Cookies();

    constructor(restServer: RestApi) {
        super();
        this._restApi = restServer;
    }

    get isAuth(): boolean {
        return this._isAuth;
    }

    set isAuth(value: boolean) {
        this._isAuth = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get userEmail(): string {
        return this._userEmail;
    }

    set userEmail(value: string) {
        this._userEmail = value;
    }

    public async logIn(id: string): Promise<any> {
        try {
            const res = await this._restApi.sendRequest("/logInCookie", {userId: id});

            if (res.auth) {

                this._isAuth = res.auth;
                this._userEmail = res.userEmail;
                this._userName = res.userName;
                this._id = res.id;
                this.dispatchEvent("onLoggedIn", res.IoT);
                return res.IoT;
            }
            console.log(res, "data received when logging");
            return null;

        } catch (e) {}
    }

    public async initialize(credentials: LogInState): Promise<void> {
        try {
            const res = await this._restApi.sendRequest("/logIn", credentials);
            console.log(res, "data from server");
            if (res.auth) {
                this._isAuth = res.auth;
                this._userEmail = res.userEmail;
                this._userName = res.userName;
                this._id = res.id;
                this._cookie.set("user", this._id);
                this.dispatchEvent("onLoggedIn", res.IoT);
            } else if (res.message){
                this.dispatchEvent("onError", res.message);
            }
        } catch (e) {

        }
    }

    public getCredentials(): { id: string, userEmail: string } {
        return {
            id: this._id,
            userEmail: this._userEmail
        }
    }
}
