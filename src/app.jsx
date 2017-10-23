import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import Menu from './components/menu';
import Index from './components/index';
import Main from './components/main';
import Help from './components/help';

ReactDOM.render(
    <HashRouter>
        <div>

            <h1 className="l-header">GCI Assignment</h1>

            <Menu />

            <Route exact path="/" component={Index}/>
            <Route path="/main" component={Main}/>
            <Route path="/help" component={Help}/>

        </div>
    </HashRouter>,
    document.getElementById('app-root')
);
