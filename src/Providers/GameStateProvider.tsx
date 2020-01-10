import React, { Context, Dispatch, useReducer } from 'react';
import { SocketService } from './SocketService';
import { useLocalStorage } from '../hooks/useLocalstorage';
import { createContext } from 'react';
import { GameActions } from './actions';
import { GameStatuses, AppState, Gamestate } from '../domain/types';

export const Actions = {
    SET_GAME_STATE: 'SET_GAME_STATE',
};

export const statuses: GameStatuses = {
    IN_PROGRESS: 'IN_PROGRESS',
    UNINITIALIZED: 'UNINITIALIZED',
    WAITING: 'WAITING',
};

const GameStateContext: Context<Dispatch<GameActions>> = createContext({} as any);

export const initialState: AppState = {
    status: statuses.UNINITIALIZED,
    gamestate: {
        name: "",
        uuid: "",
        content: "",
        gamepin: "",
    }
}

const gamestateReducer = (state: AppState, action: GameActions): AppState => {
    switch (action.type) {
        case "SET_GAME_STATE":
            return {
                ...state,
                gamestate: action.payload
            }
        default:
            return state;
    }
}

interface Props {
    children: Array<JSX.Element> | JSX.Element;
}

const GameStateProvider = ({ children }: Props) => {
    const socketService = new SocketService();
    const [participantState, setParticipantState] = useLocalStorage('participantState', {
        uuid: '',
        name: '',
    });
    const [state, dispatch] = useReducer(gamestateReducer, initialState);

    React.useEffect(() => {
        socketService.init(state.gamestate.gamepin, participantState.uuid);
        const receiveGameState = socketService.onGameState();

        receiveGameState.subscribe((data) => {
            if (data) {
                dispatch({
                    type: "SET_GAME_STATE",
                    payload: data,
                });
            }
        });

        return () => socketService.disconnect();
    }, []);

    return <GameStateContext.Provider value={null as any}>{children}</GameStateContext.Provider>;
};

export const useGamestateContext = () => {
    const context = React.useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGamestateContext må brukes inne i en GameStateContext');
    }
    return context;
};

export default GameStateProvider;
