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
                    <Route path={'/:arrangement/:pulje'} component={App} />
                </Switch>
            </Router>
        </SocketProvider>
    );
};

render(<AppMedRouter />, document.getElementById('app'));
