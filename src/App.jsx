import axios from "axios";
import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { postParticipantData } from "./api/api";

import "brace/mode/html";
import "brace/theme/vibrant_ink";
import "brace/ext/searchbox";
import "brace/ext/language_tools";
import Instructions from "./Instructions";
import Result from "./Result";

import {
    EXCLAMATIONS,
    MAX_PARTICLES,
    PARTICLE_ALPHA_FADEOUT,
    PARTICLE_COLORS,
    PARTICLE_GRAVITY,
    PARTICLE_NUM_RANGE,
    PARTICLE_SIZE,
    PARTICLE_VELOCITY_RANGE,
    POWER_MODE_ACTIVATION_THRESHOLD
} from "./constants";

const uuidv1 = require("uuid/v1");
let streakTimeout, saveContentTimeout;

const sample = arr => {
    const len = arr == null ? 0 : arr.length;
    return len ? arr[Math.floor(Math.random() * len)] : undefined;
};

let particles = [];
let particlePointer = 0;

let api = "https://codeinthedark-api.herokuapp.com";
if (process.env.NODE_ENV === "development") {
    api = "http://localhost:9000";
}

const initialParticipantData = {
    animate: false,
    animationKey: 0,
    content: `<html>
    <style>
    
    </style>
    <body>
        
    </body>
</html>`,
    exclamation: "",
    powerMode: false,
    streak: 0
};

const App = props => {
    const [uuid, setUuid] = useState(localStorage.getItem("uuid") || "");
    const [streak, updateStreak] = useState(0);
    const refStreak = React.useRef(streak);
    refStreak.current = streak;
    const [animate, setAnimate] = useState(false);
    const [content, setContent] = useState(
        localStorage.getItem("content") || initialParticipantData.content
    );
    const [animationKey, setAnimationKey] = useState(0);
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [exclamation, setExclamation] = useState(undefined);
    const [viewInstructions, setViewInstructions] = useState(false);
    const [powerMode, setPowerMode] = useState(false);
    const [editor, setEditor] = useState(undefined);
    const [lastDraw, setLastDraw] = useState(0);
    const [ctx, setCtx] = useState(undefined);
    const [inputType, setInputType] = useState(undefined);

    const onChange = (value, data) => {
        const insertTextAction = data.action === "insert";

        const pos = insertTextAction ? data.end : data.start;
        const token = editor.session.getTokenAt(pos.row, pos.column);
        if (token) {
            setInputType(token.type);
        }

        setContent(value);
        if (insertTextAction) {
            clearTimeout(streakTimeout);
            clearTimeout(saveContentTimeout);

            updateStreak(streak + 1);
            setAnimate(true);
            setAnimationKey(animationKey + 1);

            streakTimeout = setTimeout(() => {
                updateStreak(0);
                setAnimate(false);
                setPowerMode(false);
            }, 9800);
        } else {
            postParticipantData({
                animate,
                animationKey,
                content: value,
                exclamation,
                name,
                powerMode,
                streak,
                uuid
            });
        }

        saveContentTimeout = setTimeout(() => {
            localStorage.setItem("content", value);
        }, 300);
    };

    const getName = () => {
        if (name !== "") {
            return;
        }

        let newName = null;
        while (newName === null) {
            newName = window.prompt("Hva er navnet ditt?");
        }
        const newUuid = localStorage.getItem("uuid") || uuidv1();

        setName(newName);
        setUuid(newUuid);

        localStorage.setItem("name", newName);
        localStorage.setItem("uuid", newUuid);

        if (newName !== "") {
            postParticipantData({
                ...initialParticipantData,
                name: newName,
                uuid: newUuid
            });
        }
    };

    const shake = () => {
        if (!powerMode) {
            return;
        }

        const intensity =
            1 +
            2 *
                Math.random() *
                Math.floor((streak - POWER_MODE_ACTIVATION_THRESHOLD) / 100);

        const x = intensity * (Math.random() > 0.5 ? -1 : 1);
        const y = intensity * (Math.random() > 0.5 ? -1 : 1);

        document.getElementById("editor").style.margin = `${y}px ${x}px`;

        setTimeout(() => {
            document.getElementById("editor").style.margin;
        }, 75);
    };

    useEffect(() => {
        let name = localStorage.getItem("name");
        if (!name) {
            getName();
        } else {
            setName(localStorage.getItem("name"));
        }

        window.requestAnimationFrame(onFrame);
    }, []);

    useEffect(() => {
        let tmpExplamation = exclamation;
        let tmpPowerMode = refStreak.current === 0 ? false : powerMode;
        if (streak > 0 && (streak + 1) % 10 === 0) {
            const newExclamation = sample(EXCLAMATIONS);
            setExclamation(newExclamation);
            tmpExplamation = newExclamation;
        }

        if (streak > POWER_MODE_ACTIVATION_THRESHOLD && !powerMode) {
            setPowerMode(true);
            tmpPowerMode = true;
        }
        shake();
        if (editor) {
            getCursorPosition();
        }
        spawnParticles();

        postParticipantData({
            animate,
            animationKey,
            content,
            exclamation: tmpExplamation,
            name,
            powerMode: tmpPowerMode,
            streak,
            uuid
        });
    }, [streak]);

    const onLoad = editor => {
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

    const getParticleColor = type => PARTICLE_COLORS[type] || [255, 255, 255];

    const createParticle = (x, y, color) => ({
        x,
        y,
        color,
        alpha: 1,
        velocity: {
            x:
                PARTICLE_VELOCITY_RANGE.x[0] +
                Math.random() *
                    (PARTICLE_VELOCITY_RANGE.x[1] -
                        PARTICLE_VELOCITY_RANGE.x[0]),

            y:
                PARTICLE_VELOCITY_RANGE.y[0] +
                Math.random() *
                    (PARTICLE_VELOCITY_RANGE.y[1] -
                        PARTICLE_VELOCITY_RANGE.y[0])
        }
    });

    const drawParticles = timeDelta => {
        let canvasContext = ctx;
        if (!ctx) {
            const canvas = document.getElementById("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvasContext = canvas.getContext("2d");
            setCtx(canvasContext);
        }

        canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach(particle => {
            if (particle.alpha >= 0.1) {
                particle.velocity.y += PARTICLE_GRAVITY;
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.alpha *= PARTICLE_ALPHA_FADEOUT;

                canvasContext.fillStyle = `rgba(${particle.color.join(",")}, ${
                    particle.alpha
                })`;

                canvasContext.fillRect(
                    Math.round(particle.x - PARTICLE_SIZE / 2),
                    Math.round(particle.y - PARTICLE_SIZE / 2),
                    PARTICLE_SIZE,
                    PARTICLE_SIZE
                );
            }
        });
    };

    const onFrame = timestamp => {
        drawParticles(timestamp - lastDraw);
        setLastDraw(timestamp);
        window.requestAnimationFrame(onFrame);
    };

    return (
        <div className={powerMode ? "power-mode" : ""}>
            <>
                <div className="background" />
                <canvas id="canvas" />
                {viewInstructions && (
                    <Instructions
                        closeInstructions={() => setViewInstructions(false)}
                    />
                )}
                <AceEditor
                    onLoad={onLoad}
                    mode="html"
                    theme="vibrant_ink"
                    fontSize={20}
                    name="editor"
                    height="100vh"
                    width="100vw"
                    value={content}
                    highlightActiveLine={false}
                    showPrintMargin={false}
                    setOptions={{
                        useWorker: false,
                        showFoldWidgets: false
                    }}
                    session="manual"
                    editorProps={{ $blockScrolling: Infinity }}
                    onChange={onChange}
                />

                <div className="streak-container">
                    <div className="current">Combo</div>
                    <div key={animationKey} className="counter bump">
                        {streak}
                    </div>
                    <div
                        key={animationKey + 1}
                        className={`bar ${
                            animate && streak !== 0 ? "animate" : ""
                        }`}
                    />
                    <div className="exclamations">
                        {exclamation && (
                            <span key={exclamation} className="exclamation">
                                {exclamation}
                            </span>
                        )}
                    </div>
                </div>

                <div className="name-tag" onClick={getName}>
                    {name}
                </div>

                <div className="power-mode-indicator">
                    <h1>POWER MODE!</h1>
                </div>

                <div className="button-bar">
                    <button
                        className="instructions-button"
                        onClick={() => {
                            axios
                                .delete(`${api}/participant-data/${uuid}`)
                                .then(response => {
                                    localStorage.clear();
                                    location.reload();
                                });
                        }}
                    >
                        Reset
                    </button>
                    <button
                        className="instructions-button"
                        onClick={() => {
                            setViewInstructions(true);
                        }}
                    >
                        Instructions
                    </button>
                </div>
                <Result match={props.match} />
            </>
        </div>
    );
};

export default App;

export { api };
