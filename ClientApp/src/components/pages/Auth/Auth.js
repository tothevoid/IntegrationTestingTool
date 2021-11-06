import React, { Component, Fragment } from 'react';
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Field } from "../../controls/Field/Field";
import { Button } from "../../controls/Button/Button"
import { Notification } from '../../controls/Notification/Notification';
import "./Auth.scss"
import {HeadersModal} from "../../controls/HeadersModal/HeadersModal";

export class Auth extends Component {
    constructor(props) {
        super(props);
        const defaultState = this.getDefaultState();
        this.state = {
            ...defaultState,
            addNewAuth: false,
            showModal: false,
            selectedAuth: "",
            showHeadersModal: false
        }
        this.notification = React.createRef();
    }

    getDefaultState = () => {
        return {
            id: undefined,
            name: "",
            data: "",
            url: "",
            method: "",
            headers: [],
            usedHeader: "",
            usedHeaders: []
        }
    }

    componentDidMount = async () => {
        this.getRESTMethods();

        const id = this.props.location.state?.authId;
        if (id){
            await this.fetchEndpoint(id);
        }

    }

    render = () => {
        return <Fragment>
            {this.renderNewAuth()}
            <Notification ref={this.notification}/>
        </Fragment>
    }

    fetchEndpoint = async (id) => {
        const fetchResult = await fetch(`${this.props.config.apiURL}/Auth/Get?id=${id}`);
        if (fetchResult.ok){
            const auth = await fetchResult.json();
            const state = {
                id: auth.id,
                name: auth.name,
                data: auth.data,
                url: auth.url,
                method: auth.method,
                headers: auth.headers,
                usedHeaders: auth.usedResponseHeaders || [],
                usedHeader: "",
                addNewAuth: true,
            };
            this.setState({...state});
        }
    }

    renderNewAuth = () => {
        const {theme} = this.props;
        const {name, data, url, method, methods, usedHeader, id, headers, showHeadersModal} = this.state;
        return <div className={`new-auth ${theme}`}>
            <h1>{(id) ? "Update auth" : "New auth" }</h1>
            <Field className="auth-name" label="Name" name="name" theme={theme} value={name} onInput={this.onFieldInput}/>
            <div className="fields-row">
                {
                    (methods && methods.length !== 0) ?
                        <div className="method">
                            <div>Method</div>
                            <ComboBox theme={theme} selectedValue={method} values={methods} onSelect={(value) => this.setState({[method]: value})}/>
                        </div>:
                        null
                }
                <Field className="url" label="URL" name="url" theme={theme} value={url} onInput={this.onFieldInput}/>
            </div>
            <Field label="Data" name="data" theme={theme} value={data} onInput={this.onFieldInput} isTextarea/>
            <Button theme={theme} caption={`Setup headers (${headers.length})`} onClick={()=>this.setState({showHeadersModal: true})}/>
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
            <div>
                <Button theme={theme} onClick={async () => await this.addAuth()} caption={(id) ? "Update": "Create"}/>
                {
                    (id) ?
                        <Button additionalClasses="cancel-btn" theme={theme} onClick={this.naviagateToAuths} caption="Back"/> :
                        null
                }
            </div>
            <HeadersModal onModalClosed={()=>this.setState({showHeadersModal: false})} theme={theme} show={showHeadersModal} headers={headers} onHeaderCollectionChanged={this.onHeaderCollectionChanged}/>
        </div>
    }

    naviagateToAuths = () =>
        this.props.history.push({pathname: '/auths',})

    onHeaderCollectionChanged = (newHeaders) => {
        this.setState({headers: newHeaders})
    }

    notify = (text) => {
        this.notification.current.addElement(text);
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
        }
    }

    addAuth = async () => {
        //TODO: simplify
        const {name, data, url, method, headers, usedHeaders, id} = this.state;
        const authData = {
            id,
            name,
            data,
            url,
            method,
            headers,
            usedResponseHeaders: usedHeaders
        }

        const requestMethod = (id) ? "Update" : "Add";
        debugger;
        const response = await fetch(`${this.props.config.apiURL}/Auth/${requestMethod}`, {
            method: 'POST',
            body: JSON.stringify(authData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok){
            this.naviagateToAuths();
        } else {
            await this.notify(response.text())
        }
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