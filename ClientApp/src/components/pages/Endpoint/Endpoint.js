import "./Endpoint.scss"
import { withTranslation } from 'react-i18next';
import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom"
import { Button } from "../../controls/Button/Button"
import { Spinner } from "../../controls/Spinner/Spinner"
import { ComboBox } from "../../controls/ComboBox/ComboBox"
import { Notification } from "../../controls/Notification/Notification"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
import { Field } from "../../controls/Field/Field";
import {formatFileSize, isUrl} from "../../../utils/coreExtensions"
import { ReactComponent as FileIcon } from "./images/file.svg";
import { HeadersModal } from "../../controls/HeadersModal/HeadersModal";
import { httpMethods }  from "../../../constants/constants";
import {
    addEndpoint,
    fetchStatusCodes,
    getEndpointById,
    updateEndpoint
} from "../../../services/rest/endpoint";

import { getAllAuthsAsLookup } from "../../../services/rest/auth";

class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);

        const { t } = props;

        this.state = this.getInitialState();
        this.state.isLoading = this.props.match.params.id ?? false;
        this.state.statusCodes = [];
        this.state.auths = [];
        this.showHeadersModal = false;

        this.interaction = {
            Synchronous: t("endpoint.interactionType.sync"),
            Asynchronous: t("endpoint.interactionType.async")
        }
        this.notification = React.createRef();
        this.outputFileControl = React.createRef();
        this.callbackFileControl = React.createRef();
    }

    componentDidMount = async () => {
        const {apiURL} = this.props.config;
        const {id} = this.props.match.params;
        if (id){
            await this.getStateFromEndpoint(apiURL, id);
        }
        await this.getStatusCodes(apiURL);
        await this.getAuths(apiURL);
    }

    getStatusCodes = async (apiURL) => {
        const response = await fetchStatusCodes(apiURL);
        if (response.ok){
            const statusCodes = await response.json();
            this.setState({statusCodes});
        }
    }

    getAuths = async (apiURL) => {
        const response = await getAllAuthsAsLookup(apiURL);
        if (response.ok){
            const auths = await response.json();
            if (auths && auths.length){
                const currentAuth = this.state.auth;
                const emptyAuth = {key: "00000000-0000-0000-0000-000000000000", value: "None"};
                const selectedAuth = auths.find(auth => auth.key === currentAuth) || emptyAuth;
                this.setState({auths: [emptyAuth, ...auths], auth: selectedAuth});
            }
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

    getStateFromEndpoint = async (apiURL, id) => {
        const response = await getEndpointById(apiURL, id);
        if (response.ok){
            const endpoint = await response.json();
            const state = {
                id,
                path: endpoint.path,
                outputData: endpoint.outputData || "",
                statusCode: endpoint.outputStatusCode,
                interactionType: Object.values(this.interaction)[endpoint.callbackType],
                method: endpoint.method,
                callbackMethod: endpoint.callbackMethod,
                callbackData: endpoint.callbackData || "",
                callbackUrl: endpoint.callbackUrl,
                auth: endpoint.authId,
                headers: endpoint.headers,
                active: endpoint.active,
                outputFile: (endpoint.outputDataFileId?.timestamp) ? {size: endpoint.outputDataSize}: null,
                callbackFile: (endpoint.callbackDataFileId?.timestamp) ? {size: endpoint.callbackDataSize}: null
            }
            this.setState({...state, isLoading: false});
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
        const {theme, config, t} = this.props;
        const {statusCode, outputData, statusCodes, method, outputFile,
            interactionType, showHeadersModal, headers, id, active} = this.state;
        return <div className={`new-endpoint ${theme}`}>
            <h1>{t((id) ? "endpoint.action.update": "endpoint.action.add")}</h1>
            <p className={`url ${theme}`}>
                <span>{config?.mockURL}/</span>
                <input className={`dynamic-url ${theme}`} onChange={({target})=>this.setState({path: target.value})}
                    value={this.state.path} type="text"/>
            </p>
            <div className="form-part-row">
                {this.formatRowField(method, httpMethods, t("endpoint.httpMethod"), "method")}
                {this.formatRowField(statusCode, statusCodes, t("endpoint.statusCode"), "statusCode")}
                {this.formatRowField(interactionType, Object.values(this.interaction), t("endpoint.interaction"), "interactionType")}
            </div>
            <Checkbox caption={t("endpoint.active")} theme={theme} value={active}
                onSelect={(active) => {this.setState({active})}}/>
            {
                <Fragment>
                    <HeadersModal onModalClosed={()=>this.setState({showHeadersModal: false})} theme={theme} show={showHeadersModal} headers={headers} onHeaderCollectionChanged={this.onHeaderCollectionChanged}/>
                    <Button theme={theme} caption={t("endpoint.configureHeaders", {quantity: headers.length})} onClick={()=>this.setState({showHeadersModal: true})}/>
                </Fragment>
            }
            {
                (outputFile) ?
                    this.getExistingFileControl(outputFile, "outputFile"):
                    <Fragment>
                        <Field isTextarea theme={theme} name="outputData" value={outputData} label={t("endpoint.data")} onInput={this.onValueUpdated}/>
                        <div className="file-data">
                            <label ref={this.outputFileControl} htmlFor="outputFile">{this.getFileIcon(true)} {t("endpoint.attachByFile")}</label>
                            <input id="outputFile" type='file' name="outputFile"
                                onChange={(e) => this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
            {
                interactionType === this.interaction.Asynchronous ?
                    <Fragment>
                        <div className={`callback-title ${theme}`}>{t("endpoint.callback")}</div>
                        {this.renderAsyncCallbackSettings()}
                    </Fragment>: 
                    null
                   
            }
            <Notification ref={this.notification}/>
            <Button theme={theme} onClick={async () => await this.addEndpoint()} caption={t((id) ? "button.update" : "button.add")}/>
        </div>
    }

    onHeaderCollectionChanged = (newHeaders) => {
        this.setState({headers: newHeaders})
    }

    getFileIcon = (invertColor = false) => {
        const {theme} = this.props;
        return <FileIcon fill={invertColor ? (theme === "dark" ? "#00917C" : "#008FFF" ): "white"}/>
    }


    onDeleteFileClick = (propName) => {
        const propValue = this.state[propName]
        if (propValue && !propValue.lastModified){
            this.setState({[propName]: null});
        }
    }

    renderAsyncCallbackSettings = () => {
        const { theme, t } = this.props;
        const { callbackMethod, callbackData, callbackUrl, auth, auths, callbackFile } = this.state;
        return <Fragment>
            <div className="form-part-row">
                {this.formatRowField(auth, auths, t("endpoint.auth"), "auth")}
                {this.formatRowField(callbackMethod, httpMethods, t("endpoint.httpMethod"), "callbackMethod")}
                <Field theme={theme} name="callbackUrl" value={callbackUrl} label={t("endpoint.url")} onInput={this.onValueUpdated} placeholder="https://test.com/api"/>
            </div>
            {
                (callbackFile) ?
                   this.getExistingFileControl(callbackFile, "callbackFile"):
                    <Fragment>
                        <Field isTextarea theme={theme} name="callbackData" value={callbackData} label={t("endpoint.data")} onInput={this.onValueUpdated}/>
                        <div className="file-data" >
                            <label htmlFor="callbackFile">{this.getFileIcon(true)} {t("endpoint.attachByFile")}</label>
                            <input ref={this.callbackFileControl} id="callbackFile" className="callbackFile" type='file' name="callbackFile"
                                onChange={(e)=>this.onValueUpdated(e.target.name, e.target.files.length !== 0 ? e.target?.files[0]: null)}/>
                        </div>
                    </Fragment>
            }
        </Fragment>
    }

    getExistingFileControl = (file, propName) => {
        const { theme } = this.props;
        return <div className="file-container" onClick={() => this.setState({[propName]: null})}>
            <div className={`file-control ${theme}`}>{this.getFileIcon()} {formatFileSize(file.size)}</div>
            <div className={`delete-btn ${theme}`}>x</div>
        </div>
    }

    formatRowField = (value, values, title, name) => {
        const {theme} = this.props;
        return (values && values.length !== 0) ?
            <div>
                <div>{title}</div>
                <ComboBox theme={theme} selectedValue={value} values={values} onSelect={(value) => this.onValueUpdated(name, value)}/>
            </div>:
            <Fragment/>
    }

    onInteractionSelected = (data) => {
        this.setState({interactionType: data})
    }

    onValueUpdated = (propName, value) => {
        this.setState({[propName]: value})
    }

    notify = (text) => {
        this.notification.current.addElement(text);
    }

    addEndpoint = async () => {
        const { t } = this.props;
        const validationResult = this.validateEndpoint();
        if (validationResult){
            this.notify(t(validationResult));
            return;
        }
        const {id, outputData, outputFile, callbackFile, callbackData} = this.state;
        const data = {
            id,
            path: this.state.path,
            outputStatusCode: parseInt(this.state.statusCode),
            method: this.state.method,
            callbackMethod: this.state.callbackMethod,
            callbackUrl: this.state.callbackUrl,
            authId: this.state.auth?.key,
            callbackType: Object.values(this.interaction).indexOf(this.state.interactionType),
            headers: this.state.headers,
            active: this.state.active
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

        this.setState({isLoading: true});
        const {apiURL} = this.props.config;

        const response = (id) ?
            await updateEndpoint(apiURL, formData) :
            await addEndpoint(apiURL, formData);

        if (response.ok) {
            this.props.history.push("/endpoints")
        } else {
            this.setState({isLoading: false});
            this.notify(t("endpoint.error.save"));
        }
    }

    validateEndpoint = () => {
        const { config } = this.props;
        const { path, callbackUrl, interactionType } = this.state;
        if (!path || !isUrl(`${config?.mockURL}/${path}`)){
            return "endpoint.validation.endpointUrl";
        } else if (interactionType === this.interaction.Asynchronous && !isUrl(callbackUrl)){
            return "endpoint.validation.callbackUrl";
        }
        return null;
    }
}

const WrappedEndpoint = withTranslation()(withRouter(Endpoint));
export {WrappedEndpoint as Endpoint}