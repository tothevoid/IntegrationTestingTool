import "./HeadersModal.scss"
import React, { Component, Fragment } from 'react';
import { Field } from "../Field/Field";
import { Button } from "../Button/Button"
import ReactDOM from "react-dom";
import { uuidv4 } from "../../../utils/coreExtensions";

export class HeadersModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerName: "",
            headerValue: ""
        }
    }

    render = () => {
        const {show, theme, headers, onModalClosed} = this.props;
        if (!show){
            return null;
        }

        const modal =
            <div className={`headers-modal-wrapper ${theme}`}>
                <div className="headers-modal-container">
                    <button onClick={() => onModalClosed()} className="close-btn">X</button>
                    <div className="headers-top">Configure headers</div>
                    <div className="headers-controls">
                        {this.renderNewHeaderForm()}
                    </div>
                    {
                        (headers?.length) ?
                            <div className="headers-top">Headers list</div>:
                            null
                    }
                    <div className="headers-list">
                        {headers.map(header =>
                            <div className="header-item" key={header.id}>
                                <Field theme={theme} value={header.key}
                                       onInput={(name, value) => this.updateHeader(header.id, "key", value)}/>
                                <Field theme={theme} value={header.value}
                                       onInput={(name, value) => this.updateHeader(header.id, "value", value)}/>
                                <Button additionalClasses="header-btn" theme={theme} mode="danger" onClick={()=>this.deleteHeader(header.key)} caption="X"/>
                            </div>)
                        }
                    </div>
                </div>
            </div>;

        const element = document.getElementById("portal");
        return <Fragment>
            {ReactDOM.createPortal(modal, element)}
        </Fragment>
    }

    onFieldInput = (name, value) => {
        this.setState({[name]: value});
    }

    renderNewHeaderForm = () => {
        const {theme} = this.props;
        const {headerName, headerValue} = this.state;
        return <div className="new-header-form">
            <Field label="Name" name="headerName" theme={theme} value={headerName} onInput={this.onFieldInput}/>
            <Field label="Value" name="headerValue" theme={theme} value={headerValue} onInput={this.onFieldInput}/>
            <Button additionalClasses="header-btn"  theme={theme} onClick={this.addHeader} caption="Add"/>
        </div>
    }

    addHeader = () => {
        const {headers } = this.props;
        const {headerName, headerValue} = this.state;

        if (!headerName){
            return;
        }

        const alreadyExists = headers.find((header) => headerName === header.key);
        if (!alreadyExists){
            const updatedCollection = [...headers, {id: uuidv4(),key: headerName, value: headerValue}];
            this.onCollectionChanged(updatedCollection);
            this.setState({headerName: "", headerValue: ""});
        }
        //TODO: notify user
    }

    updateHeader = (id, propName, propValue) => {
        const headers = this.props.headers.map((header) => {
            if (header.id === id){
                header[propName] = propValue;
            }
            return header;
        })
        this.onCollectionChanged(headers);
    }

    deleteHeader = (key) => {
        const filteredHeaders = this.props.headers.filter((header) =>
            header.key !== key);
        this.onCollectionChanged(filteredHeaders);
    }

    onCollectionChanged = (newCollection) => {
        const {onHeaderCollectionChanged} = this.props;
        if (onHeaderCollectionChanged){
            onHeaderCollectionChanged(newCollection);
        }
    }
}
