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
                        <GameStateProvider>
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
        switch (context.status) {
            case 'UNINITIALIZED':
                return <App gamepin={gamepin} />;
            case 'IN_PROGRESS':
                return <App gamepin={gamepin} />;
            case 'FINISHED':
                return <div style={{ color: 'white' }}>FINISHED!</div>;
            case 'WAITING':
                return <div style={{ color: 'white' }}>Waiting...</div>;
            default:
                return null;
        }
    } else {
        return null;
    }
};

render(<AppMedRouter />, document.getElementById('app'));
