import React, { Component, Fragment } from 'react';
import "./Endpoint.css"
import { Button } from "../../controls/Button/Button"
import { ComboBox } from "../../controls/ComboBox/ComboBox"

export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            outputData: "",
            statusCodes: [],
            statusCode: 200
        };
    }

    componentDidMount = () =>
        this.getStatusCodes();

    render = () => {
        const {theme} = this.props;
        const {statusCode, statusCodes} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>Add new endpoint</h1>
            <p className={`url ${theme}`}>
                <span>{this.props.config?.mockURL}/</span>
                <input className={`dynamic-url ${theme}`} onBlur={() => this.validateUrl()} onChange={this.onPathChanged}
                    value={this.state.path} type="text"/>
                <span className="url-validation-error">{this.state.urlPathValidationText}</span>
            </p>
            {
                (statusCodes && statusCodes.length !== 0) ?
                    <Fragment>
                        <div>Status code: </div>
                        <ComboBox theme={theme} selectedValue={statusCode} values={statusCodes} onSelect={this.onStatusCodeSelected}></ComboBox>
                    </Fragment>:
                    <div>Loading statuses...</div>
            }
            <div>Output data:</div>
            <textarea className={`output ${theme}`} onChange={this.onOutputChanged} 
                value={this.state.outputData}/>
            <Button theme={theme} disabled={(this.state.urlPathValidationText && this.state.urlPathValidationText.length !== 0 )} onClick={this.addEndpoint} caption={"Add endpoint"}></Button>
        </div>
    }

    onStatusCodeSelected = (selectedValue) => {
        this.setState({statusCode: selectedValue})
    }

    onOutputChanged = (event) => {
        this.setState({outputData: event.target.value});
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
        const {path, outputData, statusCode} = this.state;

        const data = {
            path: path,
            outputData: outputData,
            outputStatusCode: parseInt(statusCode)

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