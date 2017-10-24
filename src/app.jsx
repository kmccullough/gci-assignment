import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import dispatcher from './dispatcher';

import Menu from './components/menu';
import Index from './components/index';
import Users from './components/users';
import Help from './components/help';

ReactDOM.render(
    <HashRouter>
        <div>

            <h1 className="l-header">GCI Assignment</h1>

            <Menu />

            <Switch>
                <Route exact path="/" component={Index}/>
                <Route path="/users" component={Users}/>
                <Route path="/help" component={Help}/>
                <Route component={Index}/>
            </Switch>

        </div>
    </HashRouter>,
    document.getElementById('app-root')
);
