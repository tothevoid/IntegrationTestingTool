import './App.scss'

import React, { Component } from 'react';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import { Endpoints } from './components/pages/Endpoints/Endpoints';
import { Endpoint } from './components/pages/Endpoint/Endpoint';
import { Logs } from './components/pages/Logs/Logs';
import { Auth } from './components/pages/Auth/Auth';
import { NotFound } from './components/pages/NotFound/NotFound';
import { NavMenu } from "./components/controls/NavMenu/NavMenu"
import { Container } from 'reactstrap';
import { endpoint, theme } from "./constants/constants"
import { Auths } from "./components/pages/Auths/Auths";

export default class App extends Component {
    static displayName = App.name;

    constructor(props){
        super(props);
        let apiURL = process?.env?.REACT_APP_SERVER_URL;
        let wsURL = endpoint.defaultWS
        if (apiURL){
            wsURL = apiURL;
        } else {
            apiURL = endpoint.defaultServer;
        }
        this.state = {
            config: {
                apiURL: apiURL,
                wsURL: wsURL,
            },
            theme: localStorage.getItem("theme") || theme.dark
        }

        document.body.classList.add(this.state.theme);
    }

    componentDidMount = () =>
        this.getConfig();

    applyThemeOnBody = (oldTheme, newTheme) => {
        document.body.classList.replace(oldTheme, newTheme)
    }

    render = () =>
        <Router>
            <NavMenu onThemeSwitched={this.onThemeSwitched} theme={this.state.theme}/>
            <Container>
                <Switch>
                    <Route exact path='/' render={(props) => <Endpoints {...props} {...this.state}/>}/>
                    <Route exact path='/endpoints' render={(props) => <Endpoints {...props} {...this.state}/>}/>
                    <Route exact path='/endpoint' render={(props) => <Endpoint  {...props} {...this.state}/>}/>
                    <Route exact path='/auths' render={(props) => <Auths {...props} {...this.state}/>}/>
                    <Route exact path='/auth' render={(props) => <Auth  {...props} {...this.state}/>}/>
                    <Route exact path='/logs' render={(props) => <Logs {...props} {...this.state}/>}/>
                    <Route component={NotFound} />
                </Switch>
            </Container>
        </Router>

    onThemeSwitched = () => {
        const currentTheme = this.state.theme;
        const newTheme = (currentTheme === theme.dark) ?
            theme.light:
            theme.dark;
        this.applyThemeOnBody(currentTheme, newTheme);
        this.setState({theme: newTheme});
        localStorage.setItem("theme",  newTheme);
    }

    getConfig = () =>
        fetch(`${this.state.config.apiURL}/ServerConfig`)
            .then((response) => response.json())
            .then((serverConfig) => {
                this.setState(currentState => ({
                    config: {...currentState.config, ...serverConfig},
                }))
            });

}