import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Modal } from "../../controls/Modal/Modal"
import { Notification } from '../../controls/Notification/Notification';
import "./Auths.scss"
import { getAllAuths, deleteAuth } from "../../../services/rest/auth";

import {ReactComponent as EditButton} from "../../../icons/edit.svg";
import {ReactComponent as DeleteButton} from "../../../icons/delete.svg";
import {withTranslation} from "react-i18next";
import {withRouter} from "react-router-dom";

class Auths extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auths: [],
            showModal: false,
            selectedAuth: "",
        }
        this.notification = React.createRef();
    }

    componentDidMount = async () =>
        await this.getAuths();

    render = () => {
        const {theme, t} = this.props;
        const {auths, showModal} = this.state;
        return <Fragment>
            <Button additionalClasses="new-auth-btn" theme={theme} caption={t("button.add")} onClick={this.navigateToEdit}/>
            <div className="auths">
                {
                    auths.map(auth => <div key={auth.id} className={`auth ${theme}`}>
                        <p className="auth-title">{auth.name}</p>
                        <p className="auth-url">[{auth.method}] {auth.url}</p>
                        <p className="auth-data">{auth.data}</p>
                        <div className="auth-manipulations">
                           <span onClick={async () => this.navigateToEdit(auth.id)} className={`auth-edit ${theme}`}>
                              <EditButton fill={"black"} className="theme-switch"/>
                           </span>
                            <span onClick={async () => this.onDecidedToDelete(auth.id)} className={`auth-delete ${theme}`}>
                              <DeleteButton fill={"white"} className="theme-switch"/>
                           </span>
                        </div>
                    </div>)
                }
            </div>
            <Modal theme={theme} onSuccess={async () => await this.onDelete()} onReject={() => this.setState({showModal: false})}
                   show={showModal} title={t("auths.deleteWarningTitle")} text={t("auths.deleteWarningText")}/>
            <Notification ref={this.notification}/>
        </Fragment>
    }

    navigateToEdit = (authId) => {
        this.props.history.push({
            pathname: (authId) ? `/auth/${authId}` : "/auth/",
        })
    }

    notify = (text) => {
        this.notification.current.addElement(text);
    }

    onDecidedToDelete = (authId) => {
        this.setState({selectedAuth: authId, showModal: true})
    }

    onDelete = async () => {
        const { t } = this.props;
        const {selectedAuth} = this.state;
        const response = await deleteAuth(this.props.config.apiURL, selectedAuth);
        if (response.ok){
            this.deleteAuth(selectedAuth);
            this.notify(t("auths.deletion.success"))
        } else {
            this.notify(t("auths.deletion.error"))
        }
    }

    deleteAuth = (authId) => {
        const newAuths = this.state.auths.filter((auth) => auth.id !== authId);
        this.setState({auths: newAuths, showModal: false});
    }

    getAuths = async () => {
        const response = await getAllAuths(this.props.config.apiURL);
        if (response.ok){
            const auths = await response.json();
            this.setState({auths});
        }
    }
}

const WrappedAuth = withTranslation()(withRouter(Auths));
export {WrappedAuth as Auths}