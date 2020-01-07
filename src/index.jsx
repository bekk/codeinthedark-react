import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Switch } from 'react-router';

import SocketProvider from './SocketProvider/SocketProvider';
import './index.less';
import App from './App';
import Welcome from './components/Welcome/Welcome';

const AppMedRouter = () => {
    return (
        <SocketProvider gamepin={'1234'} uuid={'1234'}>
            <Router history={createBrowserHistory()}>
                <Switch>
<<<<<<< HEAD
                    <Route exact path={'/'} component={Welcome} />
                    <Route path={'/game/:gamepin'} component={App} />
=======
                    <Route
                        path={'/game/:gamepin'}
                        render={props => {
                            return <App gamepin={props.match.params.gamepin} />;
                        }}
                    />
>>>>>>> feature/ventende-til-start
                </Switch>
            </Router>
        </SocketProvider>
    );
};

render(<AppMedRouter />, document.getElementById('app'));
