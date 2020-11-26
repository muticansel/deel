
import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Home from './components/Home/Home'
import Contracts from "./components/Contracts/Contracts";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/contracts" component={Contracts} />
                </Switch>
            </Router>
        )
    }
}