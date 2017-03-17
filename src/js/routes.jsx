import React from 'react';
import { Route, Router } from 'react-router';
//component
import { Card } from './component/render/Card';
import { Deck } from './component/render/Deck';
import { App } from './component/App';

export default function route() {
  return (
    <Router path={'/'} component={ App } >
      <Route path={'card'} component={ Card } />
      <Route path={'deck'} component={ Deck } />
    </Router>
    );
  }
