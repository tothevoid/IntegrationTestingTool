import React, { Component } from 'react';
import "./Endpoints.css"
import { Button } from "../../controls/Button/Button"

export class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: []
        }
        this.getEndpoints();
    }

    renderEndpoint = (endpoint) =>
    {
        const {path, outputData} = endpoint;
        return <div key={endpoint.id} className="endpoint">
            <div>
                <div className="path">{this.props?.config?.testUrl}{path}</div>
                <div>{this.formatOutput(outputData)}</div>
            </div>
            {
                <Button onClick={() => this.deleteEndpoint(endpoint.id)} additionalClasses="endpoint-delete" mode="danger" caption={"Delete"}></Button>
            }
        </div>
    }

    deleteEndpoint = (endpointId) => 
        fetch(`Endpoint/Delete?id=${endpointId}`)
            .then((response) => {if (response.text()) this.deleteEndpoints(endpointId)})
 
    deleteEndpoints = (endpointId) => {
        const filteredEndpoints = this.state.endpoints.filter((endpoint) =>
            endpoint.id !== endpointId)
        this.setState({endpoints: filteredEndpoints});
    }

    formatOutput = (outputData) => {
        return (outputData && outputData.trim()) ?
            `Returns: ${outputData}`:
            "Returns nothing";
    }

    render = () => {
        return <div className="endpoints-list">
            {this.state.endpoints.map((endpoint)=>this.renderEndpoint(endpoint))}
        </div>
    }

    getEndpoints = () => 
        fetch("Endpoint/GetAll")
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
}    