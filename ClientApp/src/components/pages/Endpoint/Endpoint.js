import "./Endpoint.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Notification } from "../../controls/Notification/Notification"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { Field } from "../../controls/Field/Field";
import { uuidv4 } from "../../../utils/coreExtensions"

export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            outputData: "",
            statusCodes: [],
            statusCode: 200,
            interactionType: 0,
            method: "POST",
            useHeaders: false,
            callbackMethod: "POST",
            callbackData: "",
            callbackUrl: "",
            auths:[],
            auth: "",
            headers: []
        };
        this.notification = React.createRef();
    }

    componentDidMount = () => {
        this.getStatusCodes();
        this.getRESTMethods();
        this.getAuths();
    }

    render = () => {
        const {theme} = this.props;
        const {statusCode, outputData, statusCodes, method, methods, 
            interactionType, useHeaders, headers} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>New endpoint</h1>
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
            <Field isTextarea theme={theme} name="outputData" value={outputData} label="Response data:" onInput={this.onValueUpdated}/>
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
            <Button theme={theme} onClick={this.addEndpoint} caption={"Create"}/>
        </div>
    }

    renderAsyncCallbackSettings = () => {
        const { theme } = this.props;
        const { methods, callbackMethod, callbackData, callbackUrl, auth, auths } = this.state;
        return <Fragment>
            <div className="form-part-row">
                {this.formatRowField(auth, auths, "Auth", "auth")}
                {this.formatRowField(callbackMethod, methods, "Method", "callbackMethod")}
                <Field theme={theme} name="callbackUrl" value={callbackUrl} label="URL" onInput={this.onValueUpdated} placeholder="https://test.com/api"/>
            </div>
            <Field isTextarea theme={theme} name="callbackData" value={callbackData} label="Data:" onInput={this.onValueUpdated}/>
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

    addEndpoint = () => {
        const validationResult = this.validateEndpoint();
        if (validationResult){
            this.notify(validationResult);
            return;
        }
        const {path, outputData, statusCode, method, interactionType, 
            callbackData, callbackMethod, callbackUrl, auth, auths, headers} = this.state;

        const data = {
            path: path,
            outputData: outputData,
            outputStatusCode: parseInt(statusCode),
            method: method,
            callbackData: callbackData,
            callbackMethod: callbackMethod,
            callbackUrl: callbackUrl,
            //TODO: simplify
            authId: auths.find(element => element.name === auth)?.id,
            callbackType: this.getInteractions().indexOf(interactionType),
            headers
        }
        fetch(`${this.props.config.apiURL}/Endpoint/Add`, {
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
        debugger;
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