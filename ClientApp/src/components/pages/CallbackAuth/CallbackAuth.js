import React, { Component, Fragment } from 'react';
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Field } from "../../controls/Field/Field";
import { Button } from "../../controls/Button/Button"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { uuidv4 } from "../../../utils/coreExtensions"
import { Modal } from "../../controls/Modal/Modal"
import "./CallbackAuth.scss"

export class CallbackAuth extends Component {
    constructor(props) {
        super(props);
        const defaultState = this.getDefaultState();
        this.state = {
            ...defaultState,
            auths: [],
            addNewAuth: false,
            showModal: false,
            selectedAuth: ""
        }
    }

    getDefaultState = () => {
        return {
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
        this.getAuths();
    }

    render = () => {
        const {theme} = this.props;
        const {addNewAuth, auths, showModal} = this.state;
        return <Fragment>
            <Checkbox theme={theme} value={addNewAuth} caption="New auth" onSelect={this.onNewAuthToggle}/>
            {
                (addNewAuth) ? 
                    this.renderNewAuth() :
                    <Fragment/>
            }
            <div className="auths">
            {
                auths.map(auth => <div key={auth.id} className={`auth ${theme}`}>
                    <div>{auth.name}</div>
                    <div>{auth.url}</div>
                    <Button additionalClasses="auth-delete" mode="danger" onClick={() => this.onDecidedToDelete(auth.id)} caption="Delete"/>
                </div>)
            }
            </div>
            {
                <Modal theme={theme} onSuccess={this.onDelete} onReject={() => this.setState({showModal: false})} 
                    show={showModal} title="Are you sure?" text="Do you really want to delete that auth?"/>
            }
        </Fragment>
    }

    renderNewAuth = () => {
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
            {/* <div className="used-body-paths">
                {this.state.usedBodyPaths.map((path) =>
                    <div className={theme} onClick={() => this.deleteFromCollection(path, "usedBodyPaths")} key={path}>{path}</div>
                )}
            </div>
            <div className="new-collection-item">
                <Field inline label="Add body path" name="usedBodyPath" theme={theme} value={usedBodyPath} onInput={this.onFieldInput}/>
                <Button theme={theme} onClick={() => this.addIntoCollection("usedBodyPaths")} caption={"Add"}/>
            </div> */}
            <Button theme={theme} onClick={this.addAuth} caption={"Create"}/>
        </div>
    }

    onNewAuthToggle = (addNewAuth) => {
        this.setState({addNewAuth});
    }

    addIntoCollection = (collection) => {
        //TODO: commonize
        switch (collection){
            case ("usedHeaders"):
                const {usedHeader, usedHeaders} = this.state;
                if (usedHeader && this.state.usedHeaders
                        .findIndex((element) => usedHeader === element) === -1){
                    const newHeaders = [...usedHeaders, usedHeader];
                    this.setState({usedHeaders: newHeaders, usedHeader: ""});
                }
                
                break;
            case ("usedBodyPaths"):
                const {usedBodyPath, usedBodyPaths} = this.state;
                if (usedBodyPath && this.state.usedBodyPaths
                        .findIndex((element) => usedBodyPath === element) === -1){
                    const newBodyPaths = [...usedBodyPaths, usedBodyPath];
                    this.setState({usedBodyPaths: newBodyPaths, usedBodyPath: ""});
                }
                break;
        }
    }

    onDecidedToDelete = (authId) => {
        this.setState({selectedAuth: authId, showModal: true})
    }

    onDelete = () => {
        const {selectedAuth} = this.state
        fetch(`${this.props.config.apiURL}/Auth/Delete?id=${selectedAuth}`)
            .then((response) => response.json())
            .then((response) => {
                if (response){
                    console.log(response);
                } else {
                    this.deleteAuth(selectedAuth);
                }})
    }

    deleteAuth = (authId) => {
        const newAuths = this.state.auths.filter((auth) => auth.id !== authId);
        this.setState({auths: newAuths, showModal: false});
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
        })
        .then(response => response.json())
        .then((auth) => {
            if (auth){
                this.setState({auths: [auth, ...this.state.auths], ...this.getDefaultState()});
            }});
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

        if (!headerName){
            return;
        }

        const alreadyExists = headers.find((header) => headerName === header.key);
        if (!alreadyExists){
            this.setState({headers: [...headers, {id: uuidv4(),key: headerName, value: headerValue}],
                headerName: "", headerValue: ""});
        }
        //TODO: notify user
    }

    deleteHeader = (key) => {
        const filteredHeaders = this.state.headers.filter((header) =>
            header.key !== key);
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

    getAuths = () => {
        fetch(`${this.props.config.apiURL}/Auth/GetAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((auths) => this.setState({auths}));
    }
}