import React from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';

class MyNavbar extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Norrland RP</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href='#'>Home</NavItem>
          <NavItem eventKey={1} href='#'>Nations</NavItem>
          <NavItem eventKey={1} href='#'>Events</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={4} href='#'>
            <Button bsStyle="info">Sign Up</Button>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MyNavbar;
