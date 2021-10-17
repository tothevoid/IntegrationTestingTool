import "./Endpoints.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Search } from "../../controls/Search/Search"
import { formatFileSize } from "../../../utils/coreExtensions"
import { Modal } from "../../controls/Modal/Modal";

export class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: [],
            showModal: false
        }
        this.getEndpoints("");
    }

    renderEndpoint = (endpoint) =>
    {
        const {theme} = this.props;
        const {path, outputDataSize, outputStatusCode, method, callbackType, 
            callbackURL, callbackMethod, callbackData} = endpoint;
        return <div key={endpoint.id} className={`endpoint ${theme}`}>
            <div>
                <div className="path">{this.props?.config?.mockURL}/{path}</div>
                <div>Method: <b>{method}</b></div>
                <div className="returns">Returns</div>
                <div className="returns-values">
                    <div>Data size: <b>{formatFileSize(outputDataSize)}</b></div>
                    <div>Status code: <b>{outputStatusCode}</b></div>
                </div>
                {
                    (callbackType === 1) ?
                        <Fragment>
                            <div className="returns">Then call</div>
                            <div className="returns-values">
                                <div>URL: {callbackURL}</div>
                                <div>Method: <b>{callbackMethod}</b></div>
                                <div>Data: {callbackData}</div>
                            </div>
                        </Fragment>:
                        <Fragment/>
                }
            </div>
            {
                <Button onClick={() => this.deleteEndpoint(endpoint.id)} additionalClasses="endpoint-delete" mode="danger" caption={"Delete"}></Button>
            }
        </div>
    }

    deleteEndpoint = (endpointId) => {
        this.setState({showModal: true, selectedEndpoint: endpointId});
    }
 
    deleteEndpoints = (endpointId) => {
        const filteredEndpoints = this.state.endpoints.filter((endpoint) =>
            endpoint.id !== endpointId)
        this.setState({endpoints: filteredEndpoints});
    }

    formatOutput = (outputData) => {
        return (outputData && outputData.trim()) ?
            `${outputData}`:
            "nothing";
    }

    render = () => {
        const {theme} = this.props;
        const {showModal} = this.state;
        return <Fragment>
            <Search theme={theme} onTextChanged={this.getEndpoints}/>
            <div className="endpoints-list">
                {this.state.endpoints.map((endpoint)=>this.renderEndpoint(endpoint))}
            </div>
            {
                <Modal theme={theme} onSuccess={this.onDecidedToDelete} onReject={()=>this.setState({showModal: false})} 
                    show={showModal} title="Are you sure?" text="Do you really want to delete that endpoint?"/>
            }
        </Fragment> 
    }

    onDecidedToDelete = () => {
        const {selectedEndpoint} = this.state;
        this.setState({showModal: false});
        fetch(`${this.props.config.apiURL}/Endpoint/Delete?id=${selectedEndpoint}`)
            .then((response) => {if (response.text()) this.deleteEndpoints(selectedEndpoint)})
    }

    getEndpoints = (path) => 
        fetch(`${this.props.config.apiURL}/Endpoint/GetAll?path=${path}`)
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
}    