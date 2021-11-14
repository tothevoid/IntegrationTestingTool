import "./Endpoint.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Spinner } from "../../controls/Spinner/Spinner"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Notification } from "../../controls/Notification/Notification"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { Field } from "../../controls/Field/Field";
import {formatFileSize, isUrl} from "../../../utils/coreExtensions"
import { ReactComponent as FileIcon } from "./images/file.svg";
import { HeadersModal } from "../../controls/HeadersModal/HeadersModal";
import { httpMethods, interaction }  from "../../../constants/constants";
import {
    addEndpoint,
    fetchStatusCodes,
    getEndpointById,
    updateEndpoint
} from "../../../services/rest/endpoint";
import { getAllAuthsAsLookup } from "../../../services/rest/auth";

export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.state.isLoading = this.props.location.state?.endpointId;
        this.state.statusCodes = [];
        this.state.auths = [];
        this.showHeadersModal = false;

        this.notification = React.createRef();
        this.outputFileControl = React.createRef();
        this.callbackFileControl = React.createRef();
    }

    componentDidMount = async () => {
        const {apiURL} = this.props.config;
        const id = this.props.location.state?.endpointId;
        if (id){
            await this.getStateFromEndpoint(apiURL, id);
        }
        await this.getStatusCodes(apiURL);
        await this.getAuths(apiURL);
    }

    getStatusCodes = async (apiURL) => {
        const response = await fetchStatusCodes(apiURL);
        if (response.ok){
            const statusCodes = await response.json();
            this.setState({statusCodes});
        }
    }

    getAuths = async (apiURL) => {
        const response = await getAllAuthsAsLookup(apiURL);
        if (response.ok){
            const auths = await response.json();
            if (auths && auths.length){
                const currentAuth = this.state.auth;
                const emptyAuth = {key: "00000000-0000-0000-0000-000000000000", value: "None"};
                const selectedAuth = auths.find(auth => auth.key === currentAuth) || emptyAuth;
                this.setState({auths: [emptyAuth, ...auths], auth: selectedAuth});
            }
        }
    }

    getInitialState = () => {
        return {
            path: "",
            outputData: "",
            statusCode: 200,
            interactionType: 0,
            method: "POST",
            useHeaders: false,
            callbackMethod: "POST",
            callbackData: "",
            callbackUrl: "",
            auths:[],
            auth: "",
            headers: [],
            active: true,
            outputFile: "",
            callbackFile: ""
        };
    }

    getStateFromEndpoint = async (apiURL, id) => {
        const response = await getEndpointById(apiURL, id);
        if (response.ok){
            const endpoint = await response.json();
            const state = {
                id,
                path: endpoint.path,
                outputData: endpoint.outputData,
                statusCode: endpoint.outputStatusCode,
                interactionType: Object.keys(interaction)[endpoint.callbackType],
                method: endpoint.method,
                callbackMethod: endpoint.callbackMethod,
                callbackData: endpoint.callbackData,
                callbackUrl: endpoint.callbackUrl,
                auth: endpoint.authId,
                headers: endpoint.headers,
                active: endpoint.active,
                outputFile: (endpoint.outputDataSize) ? {size: endpoint.outputDataSize}: null,
                callbackFile: (endpoint.callbackDataSize) ? {size: endpoint.callbackDataSize}: null
            }
            this.setState({...state, isLoading: false});
        }
        return null;
    }

    render = () => {
        const { isLoading } = this.state;
        
        return (isLoading) ?
            <Fragment>
                <Spinner/>
                <div className="spinner-content">
                    {this.renderContent()}
                </div>
            </Fragment> :
            this.renderContent();
    }

    renderContent = () => {
        const {theme, config} = this.props;
        const {statusCode, outputData, statusCodes, method, outputFile,
            interactionType, showHeadersModal, headers, id, active} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>{(id) ? "Update endpoint": "New endpoint"}</h1>
            <p className={`url ${theme}`}>
                <span>{config?.mockURL}/</span>
                <input className={`dynamic-url ${theme}`} onChange={({target})=>this.setState({path: target.value})}
                    value={this.state.path} type="text"/>
            </p>
            <div className="form-part-row">
                {this.formatRowField(method, httpMethods, "REST method", "method")}
                {this.formatRowField(statusCode, statusCodes, "Status code", "statusCode")}
                {this.formatRowField(interactionType, Object.keys(interaction), "Interaction", "interactionType")}
            </div>
            <Checkbox caption="Active" theme={theme} value={active} 
                onSelect={(active) => {this.setState({active})}}/>
            {
                <Fragment>
                    <HeadersModal onModalClosed={()=>this.setState({showHeadersModal: false})} theme={theme} show={showHeadersModal} headers={headers} onHeaderCollectionChanged={this.onHeaderCollectionChanged}/>
                    <Button theme={theme} caption={`Setup headers (${headers.length})`} onClick={()=>this.setState({showHeadersModal: true})}/>
                </Fragment>
            }
            {
                (outputFile) ?
                    this.getExistingFileControl(outputFile, "outputFile"):
                    <Fragment>
                        <Field isTextarea theme={theme} name="outputData" value={outputData} label="Response data:" onInput={this.onValueUpdated}/>
                        <div className="file-data">
                            <label ref={this.outputFileControl} htmlFor="outputFile">{this.getFileIcon()} Attach output by file</label>
                            <input id="outputFile" type='file' name="outputFile"
                                onChange={(e) => this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
            {
                interactionType === interaction.Asynchronous ?
                    <Fragment>
                        <div className={`callback-title ${theme}`}>Callback</div>
                        {this.renderAsyncCallbackSettings()}
                    </Fragment>: 
                    null
                   
            }
            <Notification ref={this.notification}/>
            <Button theme={theme} onClick={async () => await this.addEndpoint()} caption={(id) ? "Update" : "Create"}/>
        </div>
    }

    onHeaderCollectionChanged = (newHeaders) => {
        this.setState({headers: newHeaders})
    }

    getFileIcon = () =>
        <FileIcon fill="white"/>

    onDeleteFileClick = (propName) => {
        const propValue = this.state[propName]
        if (propValue && !propValue.lastModified){
            this.setState({[propName]: null});
        }
    }

    renderAsyncCallbackSettings = () => {
        const { theme } = this.props;
        const { callbackMethod, callbackData, callbackUrl, auth, auths, callbackFile } = this.state;
        return <Fragment>
            <div className="form-part-row">
                {this.formatRowField(auth, auths, "Auth", "auth")}
                {this.formatRowField(callbackMethod, httpMethods, "Method", "callbackMethod")}
                <Field theme={theme} name="callbackUrl" value={callbackUrl} label="URL" onInput={this.onValueUpdated} placeholder="https://test.com/api"/>
            </div>
            {
                (callbackFile) ?
                   this.getExistingFileControl(callbackFile, "callbackFile"):
                    <Fragment>
                        <Field isTextarea theme={theme} name="callbackData" value={callbackData} label="Data:" onInput={this.onValueUpdated}/>
                        <div className="file-data" >
                            <label htmlFor="callbackFile">{this.getFileIcon()} Attach output by file</label>
                            <input ref={this.callbackFileControl} id="callbackFile" className="callbackFile" type='file' name="callbackFile"
                                onChange={(e)=>this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
        </Fragment>
    }

    getExistingFileControl = (file, propName) => {
        const { theme } = this.props;
        return <div className="file-container">
            <div className={`file-control ${theme}`}
                 onClick={() => this.setState({[propName]: null})}>{this.getFileIcon()} {formatFileSize(file.size)}
            </div>
            <div className={`delete-btn ${theme}`}>x</div>
        </div>
    }

    formatRowField = (value, values, title, name) => {
        const {theme} = this.props;
        return (values && values.length !== 0) ?
            <div>
                <div>{title}</div>
                <ComboBox theme={theme} selectedValue={value} values={values} onSelect={(value) => this.onValueUpdated(name, value)}/>
            </div>:
            <Fragment/>
    }

    onInteractionSelected = (data) => {
        this.setState({interactionType: data})
    }

    onValueUpdated = (propName, value) => {
        this.setState({[propName]: value})
    }

    notify = (text) => {
        this.notification.current.addElement(text);
    }

    addEndpoint = async () => {
        const validationResult = this.validateEndpoint();
        if (validationResult){
            this.notify(validationResult);
            return;
        }
        const {id, outputData, outputFile, callbackFile, callbackData} = this.state;
        const data = {
            id,
            path: this.state.path,
            outputStatusCode: parseInt(this.state.statusCode),
            method: this.state.method,
            callbackMethod: this.state.callbackMethod,
            callbackUrl: this.state.callbackUrl,
            authId: this.state.auth?.key,
            callbackType: this.state.interactionType,
            headers: this.state.headers,
            active: this.state.active
        }

        let formData = new FormData()
        Object.keys(data).forEach(key => {if (data[key] !== undefined) formData.append(key, data[key])});
       
        if (outputFile){
            formData.append('outputDataFile', outputFile);
        } else {
            formData.append('outputData', outputData);
        }

        if (callbackFile){
            formData.append('callbackDataFile', callbackFile);
        } else {
            formData.append('callbackData', callbackData);
        }

        this.setState({isLoading: true});
        const {apiURL} = this.props.config;

        const response = (id) ?
            await updateEndpoint(apiURL, formData) :
            await addEndpoint(apiURL, formData);

        if (response.ok) {
            this.props.history.push("/endpoints")
        } else {
            this.setState({isLoading: false});
            this.notify("An error occurred while processing request");
        }
    }

    validateEndpoint = () => {
        const { config } = this.props;
        const { path, callbackUrl, interactionType } = this.state;
        if (!isUrl(`${config?.mockURL}/${path}`)){
            return "Endpoint url has incorrect format";
        } else if (interactionType === interaction.Asynchronous && !isUrl(callbackUrl)){
            return "Callback url has incorrect format";
        }
        return null;
    }
}