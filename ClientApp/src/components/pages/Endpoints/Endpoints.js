import React, { Component } from 'react';
import "./Endpoints.css"

export class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: []
        }
        this.getEndpoints();
    }

    renderEndpoint = (endpoint) =>
        <div key={endpoint.id} className="endpoint">
            <span>URL: {this.props?.config?.testUrl}{endpoint.path}</span>
            <span>Input: {endpoint.inputParameters.length}</span>
            <span>Output: {endpoint.outputParameters.length}</span>
        </div>

    render() {
        return <div>
            {this.state.endpoints.map((endpoint)=>this.renderEndpoint(endpoint))}
        </div>
    }

    getEndpoints() {
        fetch("Endpoint")
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
    }
}