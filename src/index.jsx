import { createBrowserHistory } from "history";
import React from "react";
import { render } from "react-dom";
import { Route, Router, Switch } from "react-router";

import App from "./App";
import "./index.less";

const AppMedRouter = () => {
    return (
        <Router history={createBrowserHistory()}>
            <Switch>
                <Route path={"/:arrangement/:pulje"} component={App} />
            </Switch>
        </Router>
    );
};
render(<AppMedRouter />, document.getElementById("app"));
