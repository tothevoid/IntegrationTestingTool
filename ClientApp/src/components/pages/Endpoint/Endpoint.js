import "./Endpoint.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Notification } from "../../controls/Notification/Notification"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { Field } from "../../controls/Field/Field";
import { uuidv4, formatFileSize } from "../../../utils/coreExtensions"

export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.state.statusCodes = [];
        this.state.auths = [];
        
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
            this.setState({...state, id});
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
                useHeaders: endpoint.headers?.length !== 0,
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
        const {theme} = this.props;
        const {statusCode, outputData, statusCodes, method, methods, outputFile,
            interactionType, useHeaders, headers, id, active} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>{(id) ? "Update endpoint": "New endpoint"}</h1>
            <p className={`url ${theme}`}>
                <span>{this.props.config?.mockURL}/</span>
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
                    <Checkbox caption={`Expect headers (${headers.length})`} theme={theme} value={useHeaders} 
                        onSelect={(useHeaders) => {this.setState({useHeaders})}}/>
                    {
                        (useHeaders) ?
                            <Fragment>
                                {this.renderHeaders()}
                                {this.renderNewHeaderForm()}
                            </Fragment>:
                            null
                    }
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
                            <label ref={this.outputFileControl} htmlFor="outputFile">Or attach an output file</label>
                            <input id="outputFile" type='file' name="outputFile"
                                onChange={(e) => this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
            {
                //TODO: simplify condition
                (this.getInteractions().indexOf(interactionType) === 1) ?
                    <Fragment>
                        <div className={`callback-title ${theme}`}>Callback</div>
                        {this.renderAsyncCallbackSettings()}
                    </Fragment>: 
                    <Fragment/> 
                   
            }
            <Notification ref={this.notification}/>
            <Button theme={theme} onClick={async () => await this.addEndpoint()} caption={(id) ? "Update" : "Create"}/>
        </div>
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
                            <label htmlFor="callbackFile">Or attach an callback file</label>
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
            outputData: (outputFile && outputFile.text) ? await outputFile.text(): outputData,
            outputStatusCode: parseInt(statusCode),
            method: method,
            callbackData: (callbackFile && outputFile.text) ? await callbackFile.text(): callbackData,
            callbackMethod: callbackMethod,
            callbackUrl: callbackUrl,
            //TODO: simplify
            authId: auths.find(element => element.name === auth)?.id,
            callbackType: this.getInteractions().indexOf(interactionType),
            headers,
            id,
            active
        }
        const operation = (id) ? "Update" : "Add";

        fetch(`${this.props.config.apiURL}/Endpoint/${operation}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.status)
            .then(status => { if (status === 200) this.props.history.push("/endpoints")});
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

    validateExisting = async () => {
        const response = await fetch('/movies');
        const movies = await response.json();
    }

    renderHeaders = () => {
        const {theme} = this.props;
        const {headers} = this.state;
        return (headers && headers.length !== 0) ?
            headers.map(header => 
                <div className="header-item" key={header.id}>
                    <Field theme={theme} value={header.key} 
                        onInput={(name, value) => this.onHeaderUpdated(header.id, "key", value)}/>
                    <Field theme={theme} value={header.value} 
                        onInput={(name, value) => this.onHeaderUpdated(header.id, "value", value)}/>
                    <Button theme={theme} mode="danger" onClick={()=>this.deleteHeader(header.key)} caption="X"/>
                </div>) :
            <Fragment/>
    }

    onHeaderUpdated = (id, propName, propValue) => {
        const headers = this.state.headers.map((header) => {
            if (header.id === id){
                header[propName] = propValue;
            }
            return header;
        })
        this.setState({headers});
    }

    renderNewHeaderForm = () => {
        const {theme} = this.props;
        const {headerName, headerValue} = this.state;
        return <div className="new-header-form">
            <Field label="Name" name="headerName" theme={theme} value={headerName} onInput={this.onFieldInput}/>
            <Field label="Value" name="headerValue" theme={theme} value={headerValue} onInput={this.onFieldInput}/>
            <Button theme={theme} onClick={this.addHeader} caption="Add"/>
        </div>
    }

    onFieldInput = (name, value) => {
        this.setState({[name]: value});
    }

    addHeader = () => {
        const {headers, headerName, headerValue} = this.state;
        const alreadyExists = headers.find((header) => headerName === header.key);
        if (!alreadyExists){
            this.setState({headers: [...headers, {id: uuidv4(),key: headerName, value: headerValue}],
                headerName: "", headerValue: ""});
        } else {
            this.notify(`Header with name "${headerName}" already exists`);
        }
    }

    deleteHeader = (key) => {
        const filteredHeaders = this.state.headers.filter((header) =>
            header.key !== key);
        this.setState({headers: filteredHeaders});
    }
}