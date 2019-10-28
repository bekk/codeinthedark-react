import * as React from "react";
import SocketContext, { useSocket } from "./SocketContext";
import { SocketService } from "./SocketService";

const statuses = {
    IN_PROGRESS: "IN_PROGRESS",
    UNINITIALIZED: "UNINITIALIZED",
    WAITING: "WAITING"
};

const service = new SocketService();

const SocketProvider = props => {
    const socket = useSocket();
    const [gameState, setGameState] = React.useState(statuses.UNINITIALIZED);

    React.useEffect(() => {
        socket.init();
        const receiveGameState = socket.onGameState();

        receiveGameState.subscribe(data => {
            console.log("data: ", data);
            setGameState(data);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={service}>
            {props.children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
