import md5 from "md5";
import * as net from "net";
import {RCONError} from "./RCONError";

export class RCON {
    private readonly address: string;
    private readonly port: number;
    private readonly password: string;
    private socket: null | net.Socket = null;
    protected active = false;

    constructor(address: string, port: number, password: string) {
        this.address = address;
        this.port = port
        this.password = md5(password);
    }

    async connect() {
        this.socket = net.createConnection(this.port, this.address, () => {
            this.socket!.write(this.password);
        });
        this.socket!.on('data', (data) => {
            if (data.toString().includes('Authenticated')) {
                if(data.toString().includes('0')) {
                    this.close();
                    throw new RCONError({
                        name: "INVALID_PASSWORD",
                        message: "Invalid password provided to server",
                    });
                }
                this.active = true;
                return this.socket!.emit('Authenticated', data.toString());
            }
            if(!data.toString().startsWith('{')) {
                return;
            }
            let json;
            try {
                json = JSON.parse(data.toString());
            } catch (e) {
                let openCount = 0;
                let closedCount = 0;
                let buffer = ""
                for (let char of data.toString()) {
                    buffer += char;
                    if (char == "{") {
                        openCount++;
                    } else if (char == "}") {
                        closedCount++;
                    }
                    if (openCount == closedCount) {
                        break;
                    }
                }
                try {
                    const json = JSON.parse(buffer);
                    this.socket!.emit(json.Command, json);
                } catch (e) {
                    throw new RCONError({
                        name: "INVALID_RESPONSE",
                        message: "Invalid response returned from server",
                        cause: data.toString(),
                    })
                }
                this.socket!.on("error", () => {
                    this.close().then(() => {this.connect().then()});
                });
            }
            return this.socket!.emit(json.Command, json);
        });
        this.socket!.on("error", () => {
            this.active = false;
            this.close().then(() => {this.connect().then()});
        });
    }

    async send(command: string, commandName: string, cb: any) {
        this.socket!.write(command);
        return this.socket?.once(commandName, cb);
    }

    async close(): Promise<void> {
        this.active = false;
        this.socket!.end()
    }

}