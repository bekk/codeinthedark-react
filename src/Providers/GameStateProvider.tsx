import React, { Context, useReducer, useContext, useEffect, ReactNode } from 'react';
import { SocketService } from './SocketService';
import { useLocalStorage } from '../hooks/useLocalstorage';
import { createContext } from 'react';
import { GameActions } from './actions';
import { GameStatuses, AppState, Gamestate } from '../domain/types';
import { useParams, useHistory } from 'react-router';

export const Actions = {
    SET_GAME_STATE: 'SET_GAME_STATE',
};

export const initialState: AppState = {
    gamestate: {
        name: '',
        uuid: '',
        content: '',
        gamepin: '',
        endTime: '',
        startTime: '',
        gameId: '',
        status: GameStatuses.CREATED,
    },
};

const GameStateContext: Context<AppState> = createContext({} as any);

const gamestateReducer = (state: AppState, action: GameActions): AppState => {
    switch (action.type) {
        case 'SET_GAME_STATE':
            return {
                ...state,
                gamestate: action.payload,
            };
        default:
            return state;
    }
};

interface Props {
    children: ReactNode;
}

const GameStateProvider = ({ children }: Props) => {
    const history = useHistory();
    const socketService = new SocketService();
    const [participantState, _] = useLocalStorage('participantState', {
        uuid: '',
        name: '',
    });

    const [state, dispatch] = useReducer(gamestateReducer, initialState);
    const { gamepin = '' } = useParams();

    useEffect(() => {
        if (participantState.uuid === '') {
            history.push('/');
        }

        socketService.init(gamepin, participantState.uuid);
        const receiveGameState = socketService.onGameState();

        receiveGameState.subscribe(data => {
            console.log(data);
            if (data) {
                dispatch({
                    type: 'SET_GAME_STATE',
                    payload: (data as unknown) as Gamestate, // Må fikse riktig datatype,
                });
            }
        });

        const onDisconnect = socketService.onDisconnect();
        onDisconnect.subscribe(() => {
            history.push('/');
        });

        return () => socketService.disconnect();
    }, []);

    return <GameStateContext.Provider value={state}>{children}</GameStateContext.Provider>;
};

export const useGamestateContext = (): AppState => {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGamestateContext må brukes inne i en GameStateContext');
    }
    return context;
};

export default GameStateProvider;
