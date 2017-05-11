import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class MyNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
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
          name: value
        });
      }
    }, this);
  }

  handleLogout() {
    document.cookie = '';
    this.setState({
      name: ''
    });
  }

  render() {
    let welcomeText = 'Welcome ' + this.state.name;
    return (
      <Toolbar style={{ paddingLeft: '300px', paddingRight: '300px' }}>
        <ToolbarGroup>
          <Link to="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.4)' }}><ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" /></Link>
          <ToolbarSeparator />
          <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/nations"><RaisedButton label="Nations" labelStyle={{ fontWeight: 700 }} /></Link>
          <Link to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
        </ToolbarGroup>
        {
          (this.state.name) ? (
            <ToolbarGroup>
              <ToolbarTitle text={welcomeText} />
              <ToolbarSeparator />
              <RaisedButton label="Log Out" primary onTouchTap={this.handleLogout} />
            </ToolbarGroup>
          ) : (
            <ToolbarGroup>
              <Link to="/register">
                <RaisedButton label="Sign Up" primary />
              </Link>
            </ToolbarGroup>
          )
        }
      </Toolbar>
    );
  }
}

export default MyNavbar;
