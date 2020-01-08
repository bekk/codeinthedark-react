import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Switch } from 'react-router';

import GameStateProvider from './Providers/GameStateProvider';
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
                            <App gamepin={props.match.params.gamepin} />
                        </GameStateProvider>
                    )}
                />
            </Switch>
        </Router>
    );
};

render(<AppMedRouter />, document.getElementById('app'));
