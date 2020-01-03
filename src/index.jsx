import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Switch } from 'react-router';

import SocketProvider from './SocketProvider/SocketProvider';
import './index.less';
import App from './App';

const AppMedRouter = () => {
    return (
        <SocketProvider>
            <Router history={createBrowserHistory()}>
                <Switch>
                    <Route
                        path={'/game/:gamepin'}
                        render={props => {
                            return <App gamepin={props.match.params.gamepin} />;
                        }}
                    />
                </Switch>
            </Router>
        </SocketProvider>
    );
};

render(<AppMedRouter />, document.getElementById('app'));
