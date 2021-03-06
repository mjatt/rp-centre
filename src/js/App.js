import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Nav';
import { HashRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase';

firebase.initializeApp({
  databaseURL: 'https://norrland-rp-centre.firebaseio.com/'
});

import GovernmentDisplay from './components/Government';
import Register from './components/Register';
import Events from './components/EventDisplay';
import MilitaryCalculator from './components/Military/MilitaryTabs';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nation: '',
      isAdmin: false
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    let _this = this;
    let cookies = document.cookie.split(';');
    cookies.forEach(function (cookie) {
      if (cookie.includes('nation')) {
        let value = cookie.split('=')[1];
        _this.setState({
          nation: value
        });
      }
      if (cookie.includes('isAdmin')) {
        var value = (cookie.split('=')[1] === 'true');
        _this.setState({
          isAdmin: value
        });
      }
    }, this);
  }

  handleLogout() {
    document.cookie = 'nation=;';
    this.setState({
      nation: ''
    });
    console.log(document.cookie);
  }

  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Navbar nation={this.state.nation} handleLogout={this.handleLogout} />
            <Route exact path="/" component={GovernmentDisplay} />
            <Route path="/register" component={Register} />
            <Route path="/events" render={()=><Events nation={this.state.nation} isAdmin={this.state.isAdmin}/>}/>
            <Route path="/calc" render={()=><MilitaryCalculator nation={this.state.nation}/>}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('mount'));
