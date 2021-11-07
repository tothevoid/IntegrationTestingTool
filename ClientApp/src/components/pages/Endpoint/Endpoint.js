import "./Endpoint.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Spinner } from "../../controls/Spinner/Spinner"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Notification } from "../../controls/Notification/Notification"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { Field } from "../../controls/Field/Field";
import { uuidv4, formatFileSize } from "../../../utils/coreExtensions"
import { ReactComponent as FileIcon } from "./images/file.svg";
import {HeadersModal} from "../../controls/HeadersModal/HeadersModal";

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

    async componentDidMount() {
        await this.fetchEndpoint();
        this.getStatusCodes();
        this.getRESTMethods();
        this.getAuths();
    }

    fetchEndpoint = async () => {
        const id = this.props.location.state?.endpointId;
        if (id){
            const state = {...await this.getStateFromEndpoint(id)};
            this.setState({...state, id, isLoading: false});
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

    getStateFromEndpoint = async (id) => {
        const fetchResult = await fetch(`${this.props.config.apiURL}/Endpoint/Get?id=${id}`);
        if (fetchResult.ok){
            const endpoint = await fetchResult.json();
            return {
                path: endpoint.path,
                outputData: endpoint.outputData,
                statusCode: endpoint.outputStatusCode,
                interactionType: endpoint.callbackType,
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
        const {statusCode, outputData, statusCodes, method, methods, outputFile,
            interactionType, showHeadersModal, headers, id, active} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>{(id) ? "Update endpoint": "New endpoint"}</h1>
            <p className={`url ${theme}`}>
                <span>{config?.mockURL}/</span>
                <input className={`dynamic-url ${theme}`} onChange={this.onPathChanged}
                    value={this.state.path} type="text"/>
            </p>
            <div className="form-part-row">
                {this.formatRowField(method, methods, "REST method", "method")}
                {this.formatRowField(statusCode, statusCodes, "Status code", "statusCode")}
                {this.formatRowField(interactionType, this.getInteractions(), "Interaction", "interactionType")}
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
                    <div onClick={()=>this.onDeleteFileClick()} className="file-container">
                        <div className="file-control" onClick={() => this.setState({outputFile: null})}>Output data: {formatFileSize(outputFile.size)}</div>
                        <div className="delete-btn">x</div>
                    </div>:
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
                //TODO: simplify condition
                ((typeof(interactionType) === "number") ? 
                    interactionType === 1 : 
                    this.getInteractions().indexOf(interactionType)) ?
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

    getFileIcon = () => {  
        const {theme} = this.props;
        return (theme === "dark") ?
            <FileIcon fill="white"/> :
            <FileIcon/>
    }

    onDeleteFileClick = (propName) => {
        const propValue = this.state[propName]
        if (propValue && !propValue.lastModified){
            this.setState({[propName]: null});
        }
    }

    renderAsyncCallbackSettings = () => {
        const { theme } = this.props;
        const { methods, callbackMethod, callbackData, callbackUrl, auth, auths, callbackFile } = this.state;
        return <Fragment>
            <div className="form-part-row">
                {this.formatRowField(auth, auths, "Auth", "auth")}
                {this.formatRowField(callbackMethod, methods, "Method", "callbackMethod")}
                <Field theme={theme} name="callbackUrl" value={callbackUrl} label="URL" onInput={this.onValueUpdated} placeholder="https://test.com/api"/>
            </div>
            {
                (callbackFile) ?
                    <Fragment>
                        <div onClick={() => this.setState({callbackFile: null})}>Callback data: {formatFileSize(callbackFile.size)}</div>
                    </Fragment>:
                    <Fragment>
                        <Field isTextarea theme={theme} name="callbackData" value={callbackData} label="Data:" onInput={this.onValueUpdated}/>
                        <div className="file-data" >
                            <label htmlFor="callbackFile">{this.getFileIcon()} Attach output by file</label>
                            <input  ref={this.callbackFileControl} id="callbackFile" className="callbackFile" type='file' name="callbackFile" 
                                onChange={(e)=>this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
        </Fragment>
    }

    formatRowField = (value, values, title, name) => {
        const {theme} = this.props;
        return (values && values.length !== 0) ?
            <div>
                <div>{title}</div>
                <ComboBox theme={theme} selectedValue={value} values={values} onSelect={(value) => this.onValueUpdated(name, value)}></ComboBox>
            </div>:
            <Fragment/>
    }


    onInteractionSelected = (data) => {
        this.setState({interactionType: data})
    }

    getInteractions = () => [
        "Synchronous",
        "Asynchronous"
    ]

    onValueUpdated = (propName, value) => {
        this.setState({[propName]: value})
    }

    onPathChanged = (event) => {
        this.setState({path: event.target.value});
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
        const {path, outputData, statusCode, method, interactionType, id, outputFile, callbackFile,
            callbackData, callbackMethod, callbackUrl, auth, auths, headers, active} = this.state;
        const data = {
            path: path,
            outputStatusCode: parseInt(statusCode),
            method: method,
            callbackMethod: callbackMethod,
            callbackUrl: callbackUrl,
            //TODO: simplify
            authId: auths.find(element => element.name === auth)?.id,
            callbackType: (typeof(interactionType) === "number") ? interactionType: this.getInteractions().indexOf(interactionType),
            headers,
            id,
            active
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

        const operation = (id) ? "Update" : "Add";
        this.setState({isLoading: true});

        const processResponse = (result) => {
            if (!result) {
                this.props.history.push("/endpoints")
            } else {
                this.setState({isLoading: false});
                this.notify(result);
            }
        }

        fetch(`${this.props.config.apiURL}/Endpoint/${operation}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok){
                response.json();
            } else {
                processResponse();
            }
        })
        .then(result => processResponse(result)).catch(error => processResponse(error.message));
    }

    getStatusCodes = () => {
        fetch(`${this.props.config.apiURL}/Endpoint/GetStatusCodes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((statusCodes) => this.setState({statusCodes}));
    }

    getRESTMethods = () => {
        fetch(`${this.props.config.apiURL}/Endpoint/GetRESTMethods`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((methods) => this.setState({methods}));
    }

    getAuths = () => {
        fetch(`${this.props.config.apiURL}/Auth/GetAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((auths) => this.setState({auths: [{id: null, name: "None"}, ...auths]}));
    }

    validateEndpoint = () => {
        const {path, callbackUrl, interactionType} = this.state;
        if (!path || path.trim() === ""){
            return "Endpoint's path can't be empty";
        } else if (this.getInteractions().indexOf(interactionType) === 1 && (!callbackUrl || callbackUrl.trim() === "")){
            return "Callback url is not specified";
        }
        return null;
    }
}