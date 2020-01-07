import { fromEvent } from 'rxjs';
import * as io from 'socket.io-client';
import { api } from '../App';

export class SocketService {
    /* tslint:disable */
    socket;
    /* tslint:enable */

    init(gamepin, uuid) {
        this.socket = io(`${api}/participant`, { query: { gamepin, uuid } });
        return this;
    }

    // link message event to rxjs data source
    onGameState() {
        return fromEvent(this.socket, 'gamestate');
    }

    // disconnect - used when unmounting
    disconnect() {
        this.socket.disconnect();
    }
}
