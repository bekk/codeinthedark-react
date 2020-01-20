export interface AppState {
    status: keyof GameStatuses;
    gamestate: Gamestate;
}

export interface Gamestate {
    name: string;
    uuid: string;
    content: string;
    gamepin: string;
    endTime: string;
    startTime: string;
}

export interface ParticleColors {
    [key: string]: Array<number>;
}

export interface SanityGame {
    name: string;
    id: string;
    level: 'lett' | 'medium' | 'vanskelig';
    result_html: string;
    asset_texts: Array<string>;
}

export interface GameStatuses {
    IN_PROGRESS: 'IN_PROGRESS';
    UNINITIALIZED: 'UNINITIALIZED';
    WAITING: 'WAITING';
    FINISHED: 'FINISHED';
}
