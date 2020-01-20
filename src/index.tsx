import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Switch } from 'react-router';

import GameStateProvider, { useGamestateContext } from './Providers/GameStateProvider';
import './index.less';
import App from './App';
import Welcome from './components/Welcome/Welcome';

const AppMedRouter = () => {
    return (
        <Router history={createBrowserHistory()}>
            <Switch>
                <Route exact path={'/'} component={Welcome} />
                <Route
                    path={'/game/:gamepin'}
                    render={props => (
                        <GameStateProvider gamepin={props.match.params.gamepin}>
                            <GameStates gamepin={props.match.params.gamepin} />
                        </GameStateProvider>
                    )}
                />
            </Switch>
        </Router>
    );
};

const GameStates = ({ gamepin }: any) => {
    const context = useGamestateContext();

    if (context.gamestate) {
        switch (context.gamestate.status) {
            case 'NOT_STARTED':
                return <App gamepin={gamepin} />;
            case 'IN_PROGRESS':
                return <App gamepin={gamepin} />;
            case 'FINISHED':
                return <div style={{ color: 'white' }}>FINISHED!</div>;
            default:
                return null;
        }
    } else {
        return null;
    }
};

render(<AppMedRouter />, document.getElementById('app'));
