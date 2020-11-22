import axios from "axios";

export class RestApi {

    private readonly _server: string;

    constructor(server: string) {
        this._server = server;
    }

    public async sendRequest<T extends Object>(url: string, data: T): Promise<any> {
        try {
            const res = await axios.post(this._server + url, data);
            return res.data;
        } catch (e) {

        }
    }
}
