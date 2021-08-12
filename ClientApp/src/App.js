import React, { Component } from 'react';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import { Endpoints } from './components/pages/Endpoints/Endpoints';
import { Endpoint } from './components/pages/Endpoint/Endpoint';
import { Logs } from './components/pages/Logs/Logs';
import { NotFound } from './components/pages/NotFound/NotFound';
import { NavMenu } from "./components/controls/NavMenu/NavMenu"
import { Container } from 'reactstrap';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  constructor(props){
    super(props);
    let apiURL = process?.env?.REACT_APP_SERVER_URL;
    let wsURL = "https://localhost:44315"
    if (!apiURL){
      apiURL = "http://localhost:44314";
    } else {
      wsURL = apiURL;
    }

    this.state = {
      config: {
        apiURL: apiURL,
        wsURL: wsURL
      }
    }
  }

  componentDidMount() {
    this.getConfig();
  }

  render () {
    return (
      <Router>
        <NavMenu/>
        <Container>
          <Switch>
            <Route exact path='/' render={(props) => <Endpoints {...props} config={this.state.config}/>}/>
            <Route exact path='/endpoints' render={(props) => <Endpoints {...props} config={this.state.config}/>}/>
            <Route exact path='/endpoint' render={(props) => <Endpoint  {...props} config={this.state.config}/>}/>
            <Route exact path='/logs' render={(props) => <Logs {...props} config={this.state.config}/>}/>
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Router>
    );
  }

  getConfig() {
    fetch(`${this.state.config.apiURL}/ServerConfig`)
        .then((response) => response.json())
        .then((serverConfig) => {
          this.setState(currentState => ({
            config: {...currentState.config, ...serverConfig},
          }))
        });
  }
}