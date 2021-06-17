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

  render () {
    return (
      <Router>
        <NavMenu/>
        <Container>
          <Switch>
            <Route exact path='/' component={Endpoints} />
            <Route exact path='/endpoints' component={Endpoints} />
            <Route exact path='/endpoint' component={Endpoint} />
            <Route exact path='/logs' component={Logs} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Router>
    );
  }
}