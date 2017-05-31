import React, { PropTypes } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';

class MyNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let nation = this.props.nation.replace(new RegExp('_', 'g'), ' ');
    nation = nation.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    let welcomeText = 'Welcome ' + nation;
    return (
      <Toolbar style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <ToolbarGroup>
          <Link to="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.4)' }}><ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" /></Link>
          <ToolbarSeparator />
          <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
          <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/calc"><RaisedButton label="Military Calculator" labelStyle={{ fontWeight: 700 }} /></Link>
        </ToolbarGroup>
        {
          (this.props.nation) ? (
            <ToolbarGroup>
              <ToolbarTitle text={welcomeText} />
              <RaisedButton label="Log Out" primary onTouchTap={this.props.handleLogout} />
              <ToolbarSeparator />
              <IconButton href="https://github.com/alexbance/rp-centre/issues" iconClassName="material-icons" tooltip="Bug reports">bug_report</IconButton>
            </ToolbarGroup>
          ) : (
              <ToolbarGroup>
                <Link to="/register">
                  <RaisedButton label="Sign In" primary />
                </Link>
                <ToolbarSeparator />
                <IconButton href="https://github.com/alexbance/rp-centre/issues" iconClassName="material-icons" tooltip="Bug reports">bug_report</IconButton>
              </ToolbarGroup>
            )
        }
      </Toolbar>
    );
  }
}

MyNavbar.propTypes = {
  nation: PropTypes.string,
  handleLogout: PropTypes.func.isRequired
};

export default MyNavbar;
