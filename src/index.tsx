import { createBrowserHistory } from 'history';
import React, { useRef, useEffect } from 'react';
import { render } from 'react-dom';
import { Route, Router, Switch, Prompt } from 'react-router';
import * as Sentry from '@sentry/browser';
import GameStateProvider, { useGamestateContext } from './Providers/GameStateProvider';
import './index.less';
import App from './App';
import Welcome from './components/Welcome/Welcome';
import DeltagerResultat from './components/DeltagerResultat/DeltagerResult';

const AppMedRouter: React.FunctionComponent = () => {
    return (
        <Router history={createBrowserHistory()}>
            <Switch>
                <Route exact path={'/'} component={Welcome} />
                <Route
                    path={'/game/:gamepin'}
                    render={props => (
                        <GameStateProvider>
                            <Prompt
                                when={true}
                                message="Ved å forlate spillet mister du progresjonen, er du sikker på at du vil dra?"
                            />
                            <GameStates gamepin={props.match.params.gamepin} />
                        </GameStateProvider>
                    )}
                />
            </Switch>
        </Router>
    );
};

interface Props {
    gamepin: string;
}

const GameStates = ({ gamepin }: Props) => {
    const context = useGamestateContext();

    if (context.gamestate) {
        switch (context.gamestate.status) {
            case 'CREATED':
                return <App gamepin={gamepin} />;
            case 'IN_PROGRESS':
                return <App gamepin={gamepin} />;
            case 'FINISHED':
                return <DeltagerResultat gamepin={gamepin} uuid={context.gamestate.uuid} />;
            default:
                return null;
        }
    } else {
        return null;
    }
};

// Initialize Sentry

if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'https://0ad2231460ae4c63a225447aae847e0e@sentry.io/2148518' });
} else {
    console.info('Initialiserer ikke Sentry lokalt');
}

render(<AppMedRouter />, document.getElementById('app'));
