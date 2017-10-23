import React from 'react';

import { NavLink } from 'react-router-dom';

const Menu = () => (
    <nav className="l-nav c-menu">
        <NavLink className="c-menu__item c-menu__item--main"
              activeClassName="c-menu__item--active c-menu__item--active--main"
              to="/main">Main</NavLink>
        <NavLink className="c-menu__item c-menu__item--help"
              activeClassName="c-menu__item--active c-menu__item--active--help"
              to="/help">Help</NavLink>
    </nav>
);

export { Menu as default }
