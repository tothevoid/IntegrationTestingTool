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
            headers: [],
            usedHeader: "",
            usedHeaders: [],
            usedBodyPath: "",
            usedBodyPaths: []
        }
    }

    componentDidMount = () => {
        this.getRESTMethods();
    }
 
    render = () => {
        const {theme} = this.props;
        const {name, data, url, method, methods, usedHeader, usedBodyPath} = this.state;
        return <div className={`new-auth ${theme}`}>
            <h1>New auth</h1>
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
            <div>Include into next Request:</div>
            <div className="used-headers">
                {this.state.usedHeaders.map((header) =>
                    <div className={theme} onClick={() => this.deleteFromCollection(header,"usedHeaders")} key={header}>{header}</div>
                )}
            </div>
            <div className="new-collection-item">
                <Field inline label="Add header" name="usedHeader" theme={theme} value={usedHeader} onInput={this.onFieldInput}/>
                <Button theme={theme} onClick={() => this.addIntoCollection("usedHeaders")} caption={"Add"}/>
            </div>
            <div className="used-body-paths">
                {this.state.usedBodyPaths.map((path) =>
                    <div className={theme} onClick={() => this.deleteFromCollection(path, "usedBodyPaths")} key={path}>{path}</div>
                )}
            </div>
            <div className="new-collection-item">
                <Field inline label="Add body path" name="usedBodyPath" theme={theme} value={usedBodyPath} onInput={this.onFieldInput}/>
                <Button theme={theme} onClick={() => this.addIntoCollection("usedBodyPaths")} caption={"Add"}/>
            </div>
           
            <Button theme={theme} onClick={this.addAuth} caption={"Create"}/>
        </div>
    }

    addIntoCollection = (collection) => {
        //TODO: commonize
        switch (collection){
            case ("usedHeaders"):
                const {usedHeader, usedHeaders} = this.state;
                debugger;
                if (!this.state.usedHeaders.find((element) => usedHeader === element)){
                    const newHeaders = [...usedHeaders, usedHeader];
                    this.setState({usedHeaders: newHeaders});
                }
                
                break;
            case ("usedBodyPaths"):
                const {usedBodyPath, usedBodyPaths} = this.state;
                if (!this.state.usedBodyPaths.find((element) => usedBodyPath === element)){
                    const newBodyPaths = [...usedBodyPaths, usedBodyPath];
                    this.setState({usedBodyPaths: newBodyPaths});
                }
                break;
        }
    }

    deleteFromCollection = (element, collection) => {
        //TODO: commonize
        switch (collection){
            case ("usedHeaders"):
                const {usedHeaders} = this.state;
                const newHeaders = usedHeaders
                    .filter((header) => header !== element);
                this.setState({usedHeaders: newHeaders}); 
                break;
            case ("usedBodyPaths"):
                const {usedBodyPaths} = this.state;
                const newPath = usedBodyPaths
                    .filter((path) => path !== element);
                this.setState({usedBodyPats: newPath});
                break;
        }
    }

    addAuth = () => {
        //TODO: simplify
        const {name, data, url, method, headers, usedHeaders, usedBodyPaths} = this.state;
        const authData = {
            name,
            data,
            url,
            method,
            headers,
            usedResponseHeaders: usedHeaders,
            usedBodyPaths: usedBodyPaths
        }

        fetch(`${this.props.config.apiURL}/Auth/Add`, {
            method: 'POST',
            body: JSON.stringify(authData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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