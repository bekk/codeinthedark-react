import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createParticipant } from '../../api/api';
import './Welcome.less';
import { useLocalStorage } from '../../hooks/useLocalstorage';
const uuid = require('uuid/v1');

const initialState = {
    name: '',
    gamepin: '',
};

const Welcome = () => {
    const [localStorageData, setLocalStorageData] = useLocalStorage('participantState', {
        uuid: '',
        name: '',
    });
    const [state, setState] = useState(initialState);
    const [error, setError] = useState('');
    const history = useHistory();

    const updateState = (key: string, value: string) => {
        setState({
            ...state,
            [key]: value,
        });
    };

    const onSubmit = (state: any) => {
        state.uuid = localStorageData.uuid ? localStorageData.uuid : uuid();

        setError('');
        createParticipant(state)
            .then(data => {
                // Lagre til local storage
                setLocalStorageData(data.data);
                // redirecte bruker til venteskjerm...
                history.push(`/game/${state.gamepin}`);
            })
            .catch(error => {
                console.log(error);
                if (error.response.data.message) {
                    setError(error.response.data.message);
                }
            });

        /**
         * * Sjekk i api om gamepin finnes
         * * Sjekk om navn finnes i db fra før?
         * * Hvis gamepin ikke finnes, gi beskjed til bruker
         * * Hvis gamepin finnes, skriv respons til local storage
         */
        // 3. Skrive respons til local storage og naviger til riktig url
    };

    return (
        <div className="container">
            <h1>Code in the Dark</h1>
            <form
                className="sign-up-form"
                action="#"
                onSubmit={e => {
                    e.preventDefault();
                    onSubmit(state);
                }}
                name="sign-up-form"
            >
                <div className="form-group">
                    <label htmlFor="name">Navn</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="Kallenavn"
                        onChange={e => updateState('name', e.currentTarget.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gamepin">Game-PIN</label>
                    <input
                        type="text"
                        name="gamepin"
                        id="gamepin"
                        required
                        maxLength={4}
                        value={state.gamepin}
                        onChange={e => updateState('gamepin', e.currentTarget.value)}
                        placeholder="Firesifret game-PIN"
                    />
                </div>
                {error && <p className="feilmelding">{error}</p>}
                <div className="form-group knappe-gruppe">
                    <button type="submit">Ta meg til spillet!</button>
                </div>
            </form>
        </div>
    );
};

export default Welcome;
