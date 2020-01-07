import * as React from 'react';
import { SocketService } from './SocketService';
import { useLocalStorage } from '../hooks/useLocalstorage';

export const actions = {
    SET_GAME_STATE: 'SET_GAME_STATE',
};

export const statuses = {
    IN_PROGRESS: 'IN_PROGRESS',
    UNINITIALIZED: 'UNINITIALIZED',
    WAITING: 'WAITING',
};

const GameStateContext = React.createContext(undefined);

const gamestateReducer = (state, action) => {
    switch (action.type) {
        case actions.SET_GAME_STATE: {
            return {
                ...state,
                gamestate: action.payload,
            };
        }
        default: {
            throw new Error(`Uhåndtert action type: ${action.type}`);
        }
    }
};

const GameStateProvider = props => {
    const socketService = new SocketService();
    const [participantState, setParticipantState] = useLocalStorage('participantState', {
        uuid: '',
        name: '',
    });
    const [state, dispatch] = React.useReducer(gamestateReducer, {
        gamestate: {
            status: statuses.UNINITIALIZED,
            name: '',
            uuid: '',
        },
    });

    React.useEffect(() => {
        socketService.init(props.gamepin, participantState.uuid);
        const receiveGameState = socketService.onGameState();

        receiveGameState.subscribe(data => {
            if (data) {
                dispatch({
                    type: actions.SET_GAME_STATE,
                    payload: data,
                });
            }
        });

        return () => socketService.disconnect();
    }, []);

    return <GameStateContext.Provider value={state}>{props.children}</GameStateContext.Provider>;
};

export const useGamestateContext = () => {
    const context = React.useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGamestateContext må brukes inne i en GameStateContext');
    }
    return context;
};

export default GameStateProvider;
