import React from 'react';
import {render} from 'react-dom';
import { Router, browserHistory } from 'react-router';
// Component
import routes from './routes';

class App extends React.Component {
  render() {
    return (
      <Router history={ browserHistory }>
        { routes() }
      </Router>
    );
  }
}

render(<App />, window.document.getElementById('app'));
