import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import {Button} from "../Button/Button"

export const NavMenu = (props) => {
  const {theme, onThemeSwitched} = props;
  return (
    <header>
      <Navbar className={`navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 ${theme}`}>
        <Container>
          <NavbarBrand className={theme} tag={Link} to="/">IntegrationTestingTool</NavbarBrand>
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className={theme} to="/">Endpoints</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className={theme} to="/endpoint">Add endpoint</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className={theme} to="/logs">Logs</NavLink>
            </NavItem>
            <Button onClick={() => onThemeSwitched()} mode="custom" theme={theme} 
              additionalClasses="theme-switch"></Button>
          </ul>
        </Container>
      </Navbar>
    </header>
  );
}