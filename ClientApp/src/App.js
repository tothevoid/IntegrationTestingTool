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
    this.state = {
      config: {}
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
    fetch("ServerConfig")
        .then((response)=> response.json())
        .then((config)=> {this.setState({config: config})});
  }
}