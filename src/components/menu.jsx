import React from 'react';

import { NavLink } from 'react-router-dom';

const Menu = () => (
    <nav className="l-nav c-menu">
        <NavLink className="c-menu__item c-menu__item--users"
              activeClassName="c-menu__item--active c-menu__item--active--users"
              to="/users">Users</NavLink>
        <NavLink className="c-menu__item c-menu__item--help"
              activeClassName="c-menu__item--active c-menu__item--active--help"
              to="/help">Help</NavLink>
    </nav>
);

export { Menu as default };
