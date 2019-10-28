import { fromEvent } from "rxjs";
import * as io from "socket.io-client";
import { api } from "../App";

export class SocketService {
    /* tslint:disable */
    socket;
    /* tslint:enable */

    init() {
        this.socket = io(`${api}/participant`);
        return this;
    }

    // link message event to rxjs data source
    onGameState() {
        return fromEvent(this.socket, "gamestate");
    }

    // disconnect - used when unmounting
    disconnect() {
        this.socket.disconnect();
    }
}
