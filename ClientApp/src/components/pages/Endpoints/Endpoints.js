import React, { Component, Fragment } from 'react';
import "./Endpoints.css"
import { Button } from "../../controls/Button/Button"
import { Search } from "../../controls/Search/Search"

export class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: []
        }
        this.getEndpoints("");
    }

    renderEndpoint = (endpoint) =>
    {
        const {theme} = this.props;
        const {path, outputData} = endpoint;
        return <div key={endpoint.id} className={`endpoint ${theme}`}>
            <div>
                <div className="path">{this.props?.config?.mockURL}/{path}</div>
                <div>{this.formatOutput(outputData)}</div>
            </div>
            {
                <Button onClick={() => this.deleteEndpoint(endpoint.id)} additionalClasses="endpoint-delete" mode="danger" caption={"Delete"}></Button>
            }
        </div>
    }

    deleteEndpoint = (endpointId) => 
        fetch(`${this.props.config.apiURL}/Endpoint/Delete?id=${endpointId}`)
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
        const {theme} = this.props;
        return <Fragment>
            <Search theme={theme} onTextChanged={this.getEndpoints}/>
            <div className="endpoints-list">
                {this.state.endpoints.map((endpoint)=>this.renderEndpoint(endpoint))}
            </div>
        </Fragment> 
    }

    getEndpoints = (path) => 
        fetch(`${this.props.config.apiURL}/Endpoint/GetAll?path=${path}`)
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
}    