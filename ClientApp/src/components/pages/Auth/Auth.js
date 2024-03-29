import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Field } from "../../controls/Field/Field";
import { Button } from "../../controls/Button/Button"
import { Notification } from '../../controls/Notification/Notification';
import "./Auth.scss"
import { HeadersModal } from "../../controls/HeadersModal/HeadersModal";
import {httpMethods} from "../../../constants/constants";
import {addAuths, getAuthById, updateAuths} from "../../../services/rest/auth";
import {isUrl} from "../../../utils/coreExtensions";
import {withTranslation} from "react-i18next";

class Auth extends Component {
    constructor(props) {
        super(props);
        const defaultState = this.getDefaultState();
        this.state = {
            ...defaultState,
            showModal: false,
            showHeadersModal: false,
            methods: httpMethods
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
            usedResponseHeaders: []
        }
    }

    componentDidMount = async () => {
        const {id} = this.props.match.params;
        if (id){
            await this.getEndpoint(id);
        }
    }

    render = () => {
        return <Fragment>
            {this.renderNewAuth()}
            <Notification ref={this.notification}/>
        </Fragment>
    }

    getEndpoint = async (id) => {
        const { apiURL } = this.props.config;
        const result = await getAuthById(apiURL, id)
        if (result.ok){
            const auth = await result.json();
            this.setState({...auth});
        }
    }

    renderNewAuth = () => {
        const {theme, t} = this.props;
        const {name, data, url, method, methods, usedHeader, id, headers, showHeadersModal} = this.state;
        return <div className={`new-auth ${theme}`}>
            <Field className="auth-name" label={t("auth.name")} name="name" theme={theme} value={name} onInput={this.onFieldInput}/>
            <div className="fields-row">
                <div className="method">
                    <div>{t("auth.httpMethod")}</div>
                    <ComboBox theme={theme} selectedValue={method} values={methods} onSelect={(value) => this.onFieldInput("method", value)}/>
                </div>
                <Field className="url" label={t("auth.url")} name="url" theme={theme} value={url} onInput={this.onFieldInput}/>
            </div>
            <Field label={t("auth.data")} name="data" theme={theme} value={data} onInput={this.onFieldInput} isTextarea/>
            <Button theme={theme} caption={t("auth.requestHeaders", {quantity: headers.length})} onClick={()=>this.setState({showHeadersModal: true})}/>
            <div>{t("auth.copiedHeaders")}:</div>
            <div className="used-headers">
                {this.state.usedResponseHeaders.map((header) =>
                    <div className={theme} onClick={() => this.deleteFromCollection(header)} key={header}>{header}</div>
                )}
            </div>
            <div className="new-collection-item">
                <Field inline label={t("auth.addHeader")} name="usedHeader" theme={theme} value={usedHeader} onInput={this.onFieldInput}/>
                <Button theme={theme} onClick={() => this.addIntoCollection()} caption={t("button.add")}/>
            </div>
            <div>
                <Button theme={theme} onClick={async () => await this.save()} caption={t((id) ? "button.update": "button.add")}/>
                {
                    (id) ?
                        <Button additionalClasses="cancel-btn" theme={theme} onClick={this.navigateToAuths} caption={t("button.back")}/> :
                        null
                }
            </div>
            <HeadersModal onModalClosed={()=>this.setState({showHeadersModal: false})} theme={theme} show={showHeadersModal} headers={headers} onHeaderCollectionChanged={this.onHeaderCollectionChanged}/>
        </div>
    }

    navigateToAuths = () =>
        this.props.history.push({pathname: '/auths',})

    onHeaderCollectionChanged = (newHeaders) => {
        this.setState({headers: newHeaders})
    }

    notify = (text) => {
        this.notification.current.addElement(text);
    }

    addIntoCollection = () => {
        const {usedHeader, usedResponseHeaders} = this.state;
        if (usedHeader && this.state.usedResponseHeaders
                .findIndex((element) => usedHeader === element) === -1){
            const newHeaders = [...usedResponseHeaders, usedHeader];
            this.setState({usedResponseHeaders: newHeaders, usedHeader: ""});
        }
    }

    deleteFromCollection = (element) => {
        const {usedResponseHeaders} = this.state;
        const newHeaders = usedResponseHeaders
            .filter((header) => header !== element);
        this.setState({usedResponseHeaders: newHeaders});
    }

    save = async () => {
        const { id } = this.state;
        const { apiURL } = this.props.config;
        const { t } = this.props;

        const validationResult = this.validateAuth();
        if (validationResult){
            this.notify(t(validationResult));
            return;
        }

        const authData = {
            id: id,
            name: this.state.name,
            data: this.state.data,
            url: this.state.url,
            method: this.state.method,
            headers: this.state.headers,
            usedResponseHeaders: this.state.usedResponseHeaders
        }

        const response = (id) ?
            await updateAuths(apiURL, authData) :
            await addAuths(apiURL, authData);

        if (response.ok){
            this.navigateToAuths();
        } else {
            await this.notify(response.text())
        }
    }

    validateAuth = () => {
        const { url, name, usedResponseHeaders} = this.state;
        if (!name || !name.trim()){
            return "auth.validation.name";
        } else if (!isUrl(url)){
            return "auth.validation.url";
        } else if (!usedResponseHeaders || usedResponseHeaders.length === 0){
            return "auth.validation.headers";
        }
        return null;
    }

    onFieldInput = (name, value) => {
        this.setState({[name]: value});
    }
}

const AuthWithRouter = withTranslation()(withRouter(Auth));
export {AuthWithRouter as Auth}