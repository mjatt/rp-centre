import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

class MyNavbar extends React.Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" />
          <ToolbarSeparator />
          <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/nations"><RaisedButton label="Nations" labelStyle={{ fontWeight: 700 }} /></Link>
          <Link to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
        </ToolbarGroup>
        <ToolbarGroup>
          <RaisedButton label="Sign Up" primary={true} />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default MyNavbar;
