import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import dimensions from 'react-dimensions';

class MyNavbar extends Component {
  constructor(props) {
    super(props);
  }

  getNavText() {
    if (this.props.containerWidth > 918) {
      let nation = this.props.nation.replace(new RegExp('_', 'g'), ' ');
      nation = nation.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      let welcomeText = 'Welcome ' + nation;
      return (
        <Toolbar style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <ToolbarGroup firstChild>
            <Link to="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.4)' }}><ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" /></Link>
            <ToolbarSeparator />
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/calc"><RaisedButton label="Budget" labelStyle={{ fontWeight: 700 }} /></Link>
          </ToolbarGroup>
          <ToolbarGroup>
            {
              (this.props.nation) ? (
                <div>
                  <ToolbarTitle text={welcomeText} />
                  <RaisedButton label="Log Out" primary onTouchTap={this.props.handleLogout} />
                </div>
              ) : (
                  <Link to="/register">
                    <RaisedButton label="Sign In" primary />
                  </Link>
                )
            }
            <ToolbarSeparator />
            <IconButton href="https://github.com/alexbance/rp-centre/issues" iconClassName="material-icons" tooltip="Bug reports">bug_report</IconButton>
          </ToolbarGroup>
        </Toolbar>
      );
    } else if (this.props.containerWidth <= 918 && this.props.containerWidth > 760) {
      return (
        <Toolbar style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <ToolbarGroup firstChild>
            <Link to="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.4)' }}><ToolbarTitle style={{ fontSize: '25px', fontWeight: 700 }} text="Norrland RP" /></Link>
            <ToolbarSeparator />
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/calc"><RaisedButton label="Budget" labelStyle={{ fontWeight: 700 }} /></Link>
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            {
              (this.props.nation) ? (
                <RaisedButton label="Log Out" primary onTouchTap={this.props.handleLogout} />
              ) : (
                  <Link to="/register">
                    <RaisedButton label="Sign In" primary />
                  </Link>
                )
            }
            <ToolbarSeparator />
            <IconButton href="https://github.com/alexbance/rp-centre/issues" iconClassName="material-icons" tooltip="Bug reports">bug_report</IconButton>
          </ToolbarGroup>
        </Toolbar>
      );
    } else if (this.props.containerWidth <= 760) {
      return (
        <Toolbar style={{ paddingLeft: '50px', paddingRight: '50px' }}>
          <ToolbarGroup firstChild>
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/events"><RaisedButton label="Events" labelStyle={{ fontWeight: 700 }} /></Link>
            <Link style={{ paddingLeft: '15px', paddingRight: '15px' }} to="/calc"><RaisedButton label="Budget" labelStyle={{ fontWeight: 700 }} /></Link>
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            {
              (this.props.nation) ? (
                <RaisedButton label="Log Out" primary onTouchTap={this.props.handleLogout} />
              ) : (
                  <Link to="/register">
                    <RaisedButton label="Sign In" primary />
                  </Link>
                )
            }
          </ToolbarGroup>
        </Toolbar>
      );
    }
  }

  render() {
    return this.getNavText();
  }
}

MyNavbar.propTypes = {
  nation: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  containerWidth: PropTypes.number
};

export default dimensions()(MyNavbar);
