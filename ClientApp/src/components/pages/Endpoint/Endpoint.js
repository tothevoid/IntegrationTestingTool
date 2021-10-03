import "./Endpoint.scss"
import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Field } from "../../controls/Field/Field";

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
            callbackMethod: "POST",
            callbackData: "",
            callbackUrl: "",
            auths:[],
            auth: ""
        };
    }

    componentDidMount = () => {
        this.getStatusCodes();
        this.getRESTMethods();
        this.getAuths();
    }

    render = () => {
        const {theme} = this.props;
        const {statusCode, outputData, statusCodes, method, methods, urlPathValidationText, interactionType} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>New endpoint</h1>
            <p className={`url ${theme}`}>
                <span>{this.props.config?.mockURL}/</span>
                <input className={`dynamic-url ${theme}`} onBlur={() => this.validateUrl()} onChange={this.onPathChanged}
                    value={this.state.path} type="text"/>
                <span className="url-validation-error">{this.state.urlPathValidationText}</span>
            </p>
            <div className="form-part-row">
                {this.formatRowField(method, methods, "REST method", "method")}
                {this.formatRowField(statusCode, statusCodes, "Status code", "statusCode")}
                {this.formatRowField(interactionType, this.getInteractions(), "Interaction", "interactionType")}
            </div>
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
            <Button theme={theme} disabled={(urlPathValidationText && urlPathValidationText.length !== 0 )} onClick={this.addEndpoint} caption={"Create"}/>
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

    validateUrl = () => 
    {
        if (!this.state.path?.trim())
        {
            return;
        }
        
        fetch(`${this.props.config.apiURL}/Endpoint/ValidateUrl?path=${this.state.path}`)
            .then(result => result.json())
            .then(result => {this.setState({urlPathValidationText: result})});
    }


    onPathChanged = (event) => {
        this.setState({path: event.target.value});
    }

    addEndpoint = () => {
        const validationResult = this.validateEndpoint();
        if (validationResult){
            console.log(validationResult);
            return;
        }
        const {path, outputData, statusCode, method, interactionType, 
            callbackData, callbackMethod, callbackUrl, auth, auths} = this.state;

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
            callbackType: this.getInteractions().indexOf(interactionType)
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
        const {urlPathValidationText, path} = this.state;

        //move it to modal or smth else
        if (!path || path.trim() === ""){
            return "Path can't be empty";
        } else if (urlPathValidationText){
            return "Url already created";
        }
        return null;
    }
}