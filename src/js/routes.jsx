import React from 'react';
import { IndexRoute, Route } from 'react-router';
//component
import Card from './component/Card';
import { Deck } from './component/render/Deck';
import Home from './component/Home';
import Root from './component/Root';

export default (
  <Route path="/" component={Root}>
    <IndexRoute component={Home} />
    <Route path="/card" component={Card} />
    <Route path="/deck" component={Deck} />
  </Route>
);
