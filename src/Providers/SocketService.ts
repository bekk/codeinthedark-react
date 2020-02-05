import { fromEvent } from 'rxjs';
import * as io from 'socket.io-client';
import { api } from '../App';

export class SocketService {
    /* tslint:disable */
    socket: any;
    /* tslint:enable */

    init(gamepin: string, uuid: string) {
        this.socket = io.connect(`${api}/participant`, { query: { gamepin, uuid } });
        console.log(this.socket);
        return this;
    }

    // link message event to rxjs data source
    onGameState() {
        return fromEvent(this.socket, 'gamestate');
    }

    onDisconnect() {
        return fromEvent(this.socket, 'disconnect');
    }

    // disconnect - used when unmounting
    disconnect() {
        this.socket.disconnect();
    }
}
