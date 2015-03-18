import React from 'react';
import Router from 'react-router';
import { Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App from './components/app.jsx';
import Home from './components/home.jsx';
import Info from './components/info.jsx';
import NotFound from './components/notFound.jsx';

var routes = (
  <Route name="app" path="/" handler={ App }>
    <Route name="info" handler={ Info } />
    <Route name="home" handler={ Home } />
    <DefaultRoute handler={ Home } />
    <NotFoundRoute handler={ NotFound } />
  </Route>
);

Router.run(routes, Handler => {
    React.render(<Handler />, document.body)
});