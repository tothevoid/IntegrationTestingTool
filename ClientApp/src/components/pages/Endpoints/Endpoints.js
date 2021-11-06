import "./Endpoints.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Search } from "../../controls/Search/Search"
import { formatFileSize } from "../../../utils/coreExtensions"
import { Modal } from "../../controls/Modal/Modal";
import { Checkbox } from "../../controls/Checkbox/Checkbox" 

export class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: [],
            showModal: false,
            isOnlyActive: false,
            searchText: ""
        }
        this.fetchEndpoints("", false);
    }

    render = () => {
        const {theme} = this.props;
        const {showModal, isOnlyActive, searchText} = this.state;
        return <Fragment>
            <Button additionalClasses="new-endpoint-btn" theme={theme} caption="Add" onClick={() => this.navigateToEdit()}/>
            <Search theme={theme} onTextChanged={this.getEndpoints}/>
            <Checkbox caption="Only active" additionalClass={"checkbox-inline"} value={isOnlyActive}
                      onSelect={(value) => {this.setState({isOnlyActive: value}); this.fetchEndpoints(searchText, value)}} theme={theme}/>
            <div className="endpoints-list">
                {this.state.endpoints.map((endpoint) => this.renderEndpoint(endpoint))}
            </div>
            {
                <Modal theme={theme} onSuccess={this.onDecidedToDelete} onReject={()=>this.setState({showModal: false})}
                       show={showModal} title="Are you sure?" text="Do you really want to delete that endpoint?"/>
            }
        </Fragment>
    }

    renderEndpoint = (endpoint) =>
    {
        const {theme} = this.props;
        const {path, outputDataSize, outputStatusCode, method, callbackType, 
            callbackURL, callbackMethod, callbackData, expanded, headers, active} = endpoint;
        const prefix = active ? "[Active]" : "[Inactive]";

        return <div key={endpoint.id} className={`endpoint ${theme}`}>
            <div>
                <div className="path"><span>{prefix} </span>{this.props?.config?.mockURL}/{path}</div>
                <div>Method: <b>{method}</b></div>
                <div className="returns">
                    {`Returns status code: ${outputStatusCode}. Data size: ${formatFileSize(outputDataSize)}`}
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
                        null
                }
                {
                    (headers && headers.length !== 0) ?
                        <div className="expand" onClick={() => this.onExpand(endpoint.id)}>{endpoint.expanded ? "[Hide]" : "[Expand]"}</div> :
                        null
                }
                {
                    (expanded) ? 
                        <div>
                            <div>Expected headers: </div>
                            <ul className="expected-headers">
                                {endpoint.headers
                                    .map(header => <li>{`${header.key} : ${header.value}`}</li>)
                                }
                            </ul>
                        </div> :
                        null
                }
            </div>
            {
                <div className="endpoint-manipulations">
                    <Button onClick={() => this.navigateToEdit(endpoint.id)} caption={"Edit"}/>
                    <Button onClick={() => this.deleteEndpoint(endpoint.id)} additionalClasses="endpoint-delete" mode="danger" caption={"Delete"}/>
                </div>
            }
        </div>
    }

    navigateToEdit = (endpointId) => {
        this.props.history.push({
            pathname: '/endpoint',
            state: { endpointId }
        })
    }

    onExpand = (endpointId) => {
        const updatedEndpoints = this.state.endpoints.map((endpoint) => {
            if (endpoint.id === endpointId){
                const expaned = endpoint?.expanded || false;
                endpoint.expanded = !expaned;
            }
            return endpoint;
        })
        this.setState({endpoints: updatedEndpoints});
    }

    deleteEndpoint = (endpointId) => {
        this.setState({showModal: true, selectedEndpoint: endpointId});
    }
 
    deleteEndpoints = (endpointId) => {
        const filteredEndpoints = this.state.endpoints.filter((endpoint) =>
            endpoint.id !== endpointId)
        this.setState({endpoints: filteredEndpoints});
    }

    onDecidedToDelete = () => {
        const {selectedEndpoint} = this.state;
        this.setState({showModal: false});
        fetch(`${this.props.config.apiURL}/Endpoint/Delete?id=${selectedEndpoint}`)
            .then((response) => {if (response.text()) this.deleteEndpoints(selectedEndpoint)})
    }

    getEndpoints = (path) => {
        const {isOnlyActive} = this.state;
        this.setState({path});
        this.fetchEndpoints(path, isOnlyActive);
    }

    fetchEndpoints = (path, isOnlyActive) => {
        fetch(`${this.props.config.apiURL}/Endpoint/GetAll?path=${path}&onlyActive=${isOnlyActive}`)
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
    }
      
}    