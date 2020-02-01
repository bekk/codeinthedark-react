import axios from 'axios';
import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import beautify from 'js-beautify';
import { postParticipantData } from './api/api';
import { useSanity } from './hooks/useSanity';

import Instructions from './Instructions';
import Result from './Result';
import Countdown from './components/Countdown';

import {
    EXCLAMATIONS,
    MAX_PARTICLES,
    PARTICLE_ALPHA_FADEOUT,
    PARTICLE_COLORS,
    PARTICLE_GRAVITY,
    PARTICLE_NUM_RANGE,
    PARTICLE_SIZE,
    PARTICLE_VELOCITY_RANGE,
    POWER_MODE_ACTIVATION_THRESHOLD,
} from './constants';

import { useGamestateContext } from './Providers/GameStateProvider';
import Nametag from './components/Nametag/Nametag';
import Button from './components/buttons/Button';
import StreakContainer from './components/Streak-container/Streak-container';
import Editor from './components/Editor';
import TimeLeft from './components/TimeLeft/TimeLeft';
import { SanityGame, AppState, GameStatuses } from './domain/types';

let streakTimeout: number;
let saveContentTimeout: number;

const sample = (arr: Array<string> | Array<number>): string | number | undefined => {
    const len = arr == null ? 0 : arr.length;
    return len ? arr[Math.floor(Math.random() * len)] : undefined;
};

let particles: any = [];
let particlePointer = 0;

setTimeout(() => { }, 300);

let api = 'https://codeinthedark-api.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:9000';
}

interface PositionProps {
    row: number;
    column: number;
}
export interface DataProps {
    action: string;
    end: PositionProps;
    start: PositionProps;
    lines: Array<string>;
}

const App = ({ gamepin }: { gamepin: string }) => {
    const context: AppState = useGamestateContext();
    const gamestate = context.gamestate;
    const [game, setFetch] = useSanity(`*[_type == "game" && id == "${gamestate.gameId}"]`);
    const { name, uuid } = gamestate;

    const [streak, updateStreak] = useState(0);
    const refStreak = React.useRef(streak);
    refStreak.current = streak;
    const [animate, setAnimate] = useState(false);

    // Content kommer fra gamestate
    const [content, setContent] = useState(gamestate.content);
    const [animationKey, setAnimationKey] = useState(0);
    const [exclamation, setExclamation] = useState<string | number | undefined>(undefined);
    const [viewInstructions, setViewInstructions] = useState(false);
    const [powerMode, setPowerMode] = useState(false);
    const [editor, setEditor] = useState<any>();
    const [ctx, setCtx] = useState(undefined);
    const [inputType, setInputType] = useState('');

    const setAndBeautifyContent = (content: string) => {
        setContent(
            beautify.html(content, {
                indent_size: 4,
                indent_char: ' ',
                max_preserve_newlines: 10,
                preserve_newlines: true,
                indent_scripts: 'keep',
                end_with_newline: true,
                wrap_line_length: 120,
                indent_inner_html: true,
            })
        );
    };

    React.useEffect(() => {
        setAndBeautifyContent(gamestate.content);
        setFetch(true);
    }, [gamestate.content]);

    document.onkeydown = event => {
        if ((event.key == 's' || event.key == 'S') && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();

            setAndBeautifyContent(content);
            return false;
        }

        return true;
    };

    const onChange = (value: string, data: DataProps) => {
        const insertTextAction = data.action === 'insert';

        const pos = insertTextAction ? data.end : data.start;
        const token = editor.session.getTokenAt(pos.row, pos.column);
        if (token) {
            setInputType(token.type);
        }

        setContent(value);
        if (insertTextAction) {
            if (data.lines.length === 1) {
                clearTimeout(streakTimeout);
                clearTimeout(saveContentTimeout);

                updateStreak(streak + 1);
                setAnimate(true);
                setAnimationKey(animationKey + 1);

                streakTimeout = (setTimeout(() => {
                    updateStreak(0);
                    setAnimate(false);
                    setPowerMode(false);
                }, 9800) as unknown) as number;
            }
        } else {
            postParticipantData({
                gamepin,
                content: value,
                uuid,
            });
        }

        saveContentTimeout = (setTimeout(() => {
            const newState = {
                ...gamestate,
                content: value,
            };
            sessionStorage.setItem('participantState', JSON.stringify(newState));
        }, 300) as unknown) as number;
    };

    const shake = () => {
        if (!powerMode) {
            return;
        }

        const intensity =
            1 + 2 * Math.random() * Math.floor((streak - POWER_MODE_ACTIVATION_THRESHOLD) / 100);

        const x = intensity * (Math.random() > 0.5 ? -1 : 1);
        const y = intensity * (Math.random() > 0.5 ? -1 : 1);

        const editor: HTMLElement | null = document.getElementById('editor');
        if (editor) {
            editor.style.margin = `${y}px ${x}px`;
        }

        // setTimeout(() => {
        //     editor.style.margin;
        // }, 75);
    };

    useEffect(() => {
        // let participantState = JSON.parse(sessionStorage.getItem('participantState'));
        // let name = participantState.name;
        // if (!name) {
        //     console.info('Finner ikke navn i sessionstorage, redirecter til forside');
        //     history.push('/');
        // }
        window.requestAnimationFrame(onFrame);
    }, []);

    useEffect(() => {
        if (streak > 0 && (streak + 1) % 10 === 0) {
            const newExclamation = sample(EXCLAMATIONS);
            setExclamation(newExclamation);
        }

        if (streak > POWER_MODE_ACTIVATION_THRESHOLD && !powerMode) {
            setPowerMode(true);
        }

        shake();
        if (editor) {
            getCursorPosition();
        }
        spawnParticles();

        postParticipantData({
            gamepin,
            content,
            uuid,
        });
    }, [streak]);

    const onLoad = (editor: any) => {
        setEditor(editor);
    };

    const getCursorPosition = () => {
        let { left, top } = editor.renderer.$cursorLayer.getPixelPosition();
        left += editor.renderer.gutterWidth + 4;
        top -= editor.renderer.scrollTop;
        return { x: left, y: top };
    };

    const spawnParticles = () => {
        if (!powerMode) {
            return;
        }

        const { x, y } = getCursorPosition();
        const numParticles = sample(PARTICLE_NUM_RANGE);
        const color = getParticleColor(inputType);
        [...Array(numParticles).keys()].forEach(() => {
            particles[particlePointer] = createParticle(x, y, color);
            particlePointer = (particlePointer + 1) % MAX_PARTICLES;
        });
    };

    const getParticleColor = (type: string): Array<number> =>
        PARTICLE_COLORS[type] || [255, 255, 255];

    const createParticle = (x: any, y: any, color: any) => ({
        x,
        y,
        color,
        alpha: 1,
        velocity: {
            x:
                PARTICLE_VELOCITY_RANGE.x[0] +
                Math.random() * (PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]),

            y:
                PARTICLE_VELOCITY_RANGE.y[0] +
                Math.random() * (PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0]),
        },
    });

    const drawParticles = () => {
        let canvasContext = ctx as any;
        if (!ctx) {
            const canvas = document.getElementById('canvas') as any;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvasContext = canvas.getContext('2d');
            setCtx(canvasContext);
        }

        canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach((particle: any) => {
            if (particle.alpha >= 0.1) {
                particle.velocity.y += PARTICLE_GRAVITY;
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.alpha *= PARTICLE_ALPHA_FADEOUT;

                canvasContext.fillStyle = `rgba(${particle.color.join(',')}, ${particle.alpha})`;

                canvasContext.fillRect(
                    Math.round(particle.x - PARTICLE_SIZE / 2),
                    Math.round(particle.y - PARTICLE_SIZE / 2),
                    PARTICLE_SIZE,
                    PARTICLE_SIZE
                );
            }
        });
    };

    const onFrame = (timestamp: number) => {
        // drawParticles(timestamp - lastDraw);
        drawParticles();
        window.requestAnimationFrame(onFrame);
    };

    return (
        <div className={powerMode ? 'power-mode' : ''}>
            <>
                <div
                    className={classnames('background', {
                        waiting: context.gamestate.status !== GameStatuses.IN_PROGRESS,
                    })}
                />
                <canvas id="canvas" />
                {viewInstructions && (
                    <Instructions
                        closeInstructions={() => setViewInstructions(false)}
                        game={game[0]}
                    />
                )}
                <div className="main-content">
                    <Countdown
                        waiting={context.gamestate.status !== GameStatuses.IN_PROGRESS}
                        tekst={`Er du klar ${name}?`}
                    />
                    <div
                        className={classnames('editor-content', {
                            waiting: context.gamestate.status !== GameStatuses.IN_PROGRESS,
                        })}
                    >
                        <Editor onChange={onChange} onLoad={onLoad} content={content} />

                        <TimeLeft endTime={gamestate.endTime} />

                        <StreakContainer
                            animationKey={animationKey}
                            streak={streak}
                            animate={animate}
                            exclamation={exclamation}
                        />

                        <div className="power-mode-indicator">
                            <h1>POWER MODE!</h1>
                        </div>
                    </div>
                    <Nametag name={name} />
                    <div className="button-bar">
                        <Button onClick={() => setViewInstructions(true)}>Instruksjoner</Button>
                    </div>
                </div>

                <Result game={game[0]} />
            </>
        </div>
    );
};

export default App;

export { api };
