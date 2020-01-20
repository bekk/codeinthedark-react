import React, { Context, Dispatch, useReducer, useContext, useEffect } from 'react';
import { SocketService } from './SocketService';
import { useLocalStorage } from '../hooks/useLocalstorage';
import { createContext } from 'react';
import { GameActions } from './actions';
import { GameStatuses, AppState, Gamestate } from '../domain/types';
import { useHistory, useParams } from 'react-router';

export const Actions = {
    SET_GAME_STATE: 'SET_GAME_STATE',
};

export const statuses: GameStatuses = {
    IN_PROGRESS: 'IN_PROGRESS',
    UNINITIALIZED: 'UNINITIALIZED',
    WAITING: 'WAITING',
    FINISHED: 'FINISHED',
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
        status: '',
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
    children: Array<JSX.Element> | JSX.Element;
}

const GameStateProvider = ({ children }: Props) => {
    const socketService = new SocketService();
    const [participantState, setParticipantState] = useLocalStorage('participantState', {
        uuid: '',
        name: '',
    });
    const [state, dispatch] = useReducer(gamestateReducer, initialState);

    const { gamepin = '' } = useParams();

    useEffect(() => {
        socketService.init(gamepin, participantState.uuid);
        const receiveGameState = socketService.onGameState();
        receiveGameState.subscribe(data => {
            console.log('Data', data);
            '';
            if (data) {
                dispatch({
                    type: 'SET_GAME_STATE',
                    payload: (data as unknown) as Gamestate, // Må fikse riktig datatype,
                });
            }
        });

        return () => socketService.disconnect();
    }, []);

    return <GameStateContext.Provider value={state}>{children}</GameStateContext.Provider>;
};

export const useGamestateContext = (): any => {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGamestateContext må brukes inne i en GameStateContext');
    }
    return context;
};

export default GameStateProvider;
