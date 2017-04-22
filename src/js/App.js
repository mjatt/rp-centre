import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Nav';
import { HashRouter as Router, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Navbar} />
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('mount'));