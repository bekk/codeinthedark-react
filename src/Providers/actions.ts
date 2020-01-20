import { Gamestate } from "../domain/types";

type SET_GAME_STATE = "SET_GAME_STATE";

type setGameState = { type: SET_GAME_STATE, payload: Gamestate }

export type GameActions = setGameState;