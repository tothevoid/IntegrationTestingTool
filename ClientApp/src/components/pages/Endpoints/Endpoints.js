import "./Endpoints.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Search } from "../../controls/Search/Search"
import { formatFileSize } from "../../../utils/coreExtensions"
import { Modal } from "../../controls/Modal/Modal";
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import {deleteEndpoint, getAllEndpoints, switchActivity} from "../../../services/rest/endpoint";
import {ReactComponent as EditButton} from "../../../icons/edit.svg";
import {ReactComponent as DeleteButton} from "../../../icons/delete.svg";
import {withTranslation} from "react-i18next";

class Endpoints extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            endpoints: [],
            showModal: false,
            isOnlyActive: false,
            searchText: ""
        }
    }

    componentDidMount = async () =>
        await this.fetchEndpoints("", false);

    render = () => {
        const {theme, t} = this.props;
        const {showModal, isOnlyActive, searchText} = this.state;
        return <Fragment>
            <div className="header-form">
                <Button additionalClasses="new-endpoint-btn" theme={theme} caption={t("button.add")} onClick={() => this.navigateToEdit()}/>
                <Search caption={t("endpoints.search")} theme={theme} onTextChanged={async (path) => await this.getEndpoints(path, isOnlyActive)}/>
                <Checkbox caption={t("endpoints.active")} additionalClass={"checkbox-inline"} value={isOnlyActive}
                          onSelect={async (value) => {this.setState({isOnlyActive: value}); await this.fetchEndpoints(searchText, value)}} theme={theme}/>
            </div>
            <div className="endpoints-list">
                {this.state.endpoints.map((endpoint) => this.renderEndpoint(endpoint))}
            </div>
            {
                <Modal theme={theme} onSuccess={async () => await this.onDecidedToDelete()} onReject={()=>this.setState({showModal: false})}
                       show={showModal} title={t("endpoints.deleteWarningTitle")} text={t("endpoints.deleteWarningText")}/>
            }
        </Fragment>
    }

    renderEndpoint = (endpoint) =>
    {
        const {theme, config, t} = this.props;
        const {path, outputDataSize, outputStatusCode, method, callbackType, 
            callbackUrl, callbackMethod, active, callbackDataSize, id} = endpoint;

        return <div key={endpoint.id} className={`endpoint ${theme}`}>
            <div>
                <div className="path">
                    <Checkbox toggle value={active} onSelect={async (active) => await this.changeEndpointActivity(id, active)} additionalClass={"checkbox-inline"} theme={theme}/>
                    [{method}] {config?.mockURL}/{path}</div>
                <div className="returns">{t("endpoints.descriptionMain", {code: outputStatusCode, dataSize: formatFileSize(outputDataSize)})}</div>
                {
                    (callbackType === 1) ?
                        <div className="returns">
                            {t("endpoints.descriptionAdditional", {method: callbackMethod, url: callbackUrl, dataSize: formatFileSize(callbackDataSize)})}
                        </div> :
                        null
                }
            {
                <div className="endpoint-manipulations">
                    <span onClick={async () => this.navigateToEdit(endpoint.id)} className={`endpoint-edit ${theme}`}>
                      <EditButton fill={"black"} className="theme-switch"/>
                   </span>
                    <span onClick={async () => this.deleteEndpoint(endpoint.id)} className={`endpoint-delete ${theme}`}>
                      <DeleteButton fill={"white"} className="theme-switch"/>
                   </span>
                </div>
            }
            </div>
        </div>
    }

    changeEndpointActivity = async (id, isActive) => {
        const {apiURL} = this.props.config;
        const response = await switchActivity(apiURL, id, isActive);
        if (response.ok && await response.text()){
            const endpoints = this.state.endpoints.map((endpoint) => {
                if (endpoint.id === id){
                    endpoint.active = isActive;
                }
                return endpoint;
            });
            this.setState({endpoints})
        }
    }

    navigateToEdit = (endpointId) => {
        this.props.history.push({
            pathname: (endpointId) ? `/endpoint/${endpointId}` : "/endpoint/",
        })
    }

    deleteEndpoint = (endpointId) => {
        this.setState({showModal: true, selectedEndpoint: endpointId});
    }
 
    deleteEndpoints = (endpointId) => {
        const filteredEndpoints = this.state.endpoints.filter((endpoint) =>
            endpoint.id !== endpointId)
        this.setState({endpoints: filteredEndpoints});
    }

    onDecidedToDelete = async () => {
        const {selectedEndpoint} = this.state;
        this.setState({showModal: false});
        const {apiURL} = this.props.config;
        const response = await deleteEndpoint(apiURL, selectedEndpoint);
        if (response.ok && await response.text()){
            this.deleteEndpoints(selectedEndpoint);
        }
    }

    getEndpoints = async (path, isOnlyActive) => {
        this.setState({path});
        await this.fetchEndpoints(path, isOnlyActive);
    }

    fetchEndpoints = async (path, isOnlyActive) => {
        const {apiURL} = this.props.config;
        const data = {path, isOnlyActive};
        const response = await getAllEndpoints(apiURL, data);
        if (response.ok){
            const endpoints = await response.json();
            this.setState({endpoints})
        }
    }
}

const WrappedEndpoints = withTranslation()(Endpoints);
export {WrappedEndpoints as Endpoints}