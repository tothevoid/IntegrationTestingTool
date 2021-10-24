import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.scss';

import {ReactComponent as DarkTheme} from "./images/dark_mode.svg";
import {ReactComponent as LightTheme} from "./images/light_mode.svg";

export const NavMenu = (props) => {
  const {theme, onThemeSwitched} = props;
  return (
    <header>
      <Navbar className={`navbar navbar-expand-sm navbar-toggleable-sm border-bottom mb-3 ${theme}`}>
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
              <NavLink tag={Link} className={theme} to="/auth">Auth</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className={theme} to="/logs">Logs</NavLink>
            </NavItem>
            <span onClick={() => onThemeSwitched()} className={`image-container ${theme}`}>
              {getThemeSwitchButton(theme)}
            </span>
          </ul>
        </Container>
      </Navbar>
    </header>
  );
}

const getThemeSwitchButton = (theme) => 
  (theme === "dark") ?
    <LightTheme fill={"white"} className="theme-switch"/>:
    <DarkTheme fill={"white"} className="theme-switch"/>