import React, { Component, Fragment } from 'react';
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Field } from "../../controls/Field/Field";
import { Button } from "../../controls/Button/Button"
import { uuidv4 } from "../../../utils/coreExtensions"
import "./CallbackAuth.scss"

export class CallbackAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            data: "",
            url: "",
            method: "",
            headers: []
        }
    }

    componentDidMount = () => {
        this.getRESTMethods();
    }
 
    render = () => {
        const {theme} = this.props;
        const {name, data, url, method, methods} = this.state;
        return <div className={`new-auth ${theme}`}>
            <Field label="Name" name="name" theme={theme} value={name} onInput={this.onFieldInput}/>
            <Field label="URL" name="url" theme={theme} value={url} onInput={this.onFieldInput}/>
            {
                (methods && methods.length !== 0) ?
                <div>
                    <div>Method</div>
                        <ComboBox theme={theme} selectedValue={method} values={methods} onSelect={(value) => this.setState({[method]: value})}></ComboBox>
                    </div>:
                <Fragment/>
            }
            <Field label="Data" name="data" theme={theme} value={data} onInput={this.onFieldInput} isTextarea/>
            <div>Headers:</div>
            {this.renderHeaders()}
            {this.renderNewHeaderForm()}
            <Button theme={theme} onClick={this.addAuth} caption={"Create"}/>
        </div>
    }

    addAuth = () => {
        
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

    addHeader = () => {
        const {headers, headerName, headerValue} = this.state;
        const alreadyExists = headers.find((header) => headerName === header.key);
        if (!alreadyExists){
            this.setState({headers: [...headers, {id: uuidv4(),key: headerName, value: headerValue}],
                headerName: "", headerValue: ""});
        }
        //TODO: notify user
    }

    deleteHeader = (key) => {
        const filteredHeaders = this.state.headers.filter((header) =>
            header.key !== key)
        this.setState({headers: filteredHeaders});
    }

    onFieldInput = (name, value) => {
        this.setState({[name]: value});
    }

    //TODO: remove duplication
    getRESTMethods = () => {
        fetch(`${this.props.config.apiURL}/Endpoint/GetRESTMethods`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((methods) => this.setState({methods}));
    }
}