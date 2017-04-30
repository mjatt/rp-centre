import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class MyNavbar extends React.Component {
  render() {
    return (
      <Toolbar style={{ paddingLeft: '350px', paddingRight: '350px' }}>
        <ToolbarGroup>
          <ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" />
          <ToolbarSeparator />
          <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/nations"><RaisedButton label="Nations" labelStyle={{ fontWeight: 700 }} /></Link>
          <Link to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
        </ToolbarGroup>
        <ToolbarGroup>
          <Link to="/register">
            <RaisedButton label="Sign Up" primary />
          </Link>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default MyNavbar;
