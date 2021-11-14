import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import './NavMenu.scss';

import {ReactComponent as DarkTheme} from "./images/dark_mode.svg";
import {ReactComponent as LightTheme} from "./images/light_mode.svg";
import {localization, theme} from "../../../constants/constants";

export const NavMenu = (props) => {
	const { t, i18n } = useTranslation()
  	const {theme, onThemeSwitched} = props;

	const onLanguageSwitched = () =>
	{
		const newLang = (i18n.language === localization.English) ?
			localization.Russian:
			localization.English;

		i18n.changeLanguage(newLang);
		localStorage.setItem("lang",  newLang);
	}

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
						<NavLink tag={Link} className={theme} to="/auths">Auths</NavLink>
					</NavItem>
					<NavItem>
						<NavLink tag={Link} className={theme} to="/logs">Logs</NavLink>
					</NavItem>
					<span onClick={() => onThemeSwitched()} className={`nav-btn-container ${theme}`}>
						{getThemeSwitchButton(theme)}
					</span>
					<span onClick={() => onLanguageSwitched()} className={`nav-btn-container ${theme}`}>
						<span className="theme-switch">{i18n.language.toUpperCase()}</span>
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