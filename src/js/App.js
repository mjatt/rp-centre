import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Nav';
import { HashRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

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