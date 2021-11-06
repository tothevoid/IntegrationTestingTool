import React, { Component, Fragment } from 'react';
import { Button } from "../../controls/Button/Button"
import { Modal } from "../../controls/Modal/Modal"
import { Notification } from '../../controls/Notification/Notification';
import "./Auths.scss"

export class Auths extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auths: [],
            showModal: false,
            selectedAuth: "",
        }
        this.notification = React.createRef();
    }

    componentDidMount = () => {
        this.getAuths();
    }

    render = () => {
        const {theme} = this.props;
        const {auths, showModal} = this.state;
        return <Fragment>
            <Button theme={theme} caption="New" onClick={this.navigateToEdit}/>
            <div className="auths">
                {
                    auths.map(auth => <div key={auth.id} className={`auth ${theme}`}>
                        <div>{auth.name}</div>
                        <div>{auth.url}</div>
                        <div className="auth-delete">
                            <Button onClick={async () => this.navigateToEdit(auth.id)} caption="Edit"/>
                            <Button onClick={() => this.onDecidedToDelete(auth.id)} additionalClasses="auth-delete-btn" mode="danger" caption="Delete"/>
                        </div>
                    </div>)
                }
            </div>
            {
                <Modal theme={theme} onSuccess={this.onDelete} onReject={() => this.setState({showModal: false})}
                       show={showModal} title="Are you sure?" text="Do you really want to delete that auth?"/>
            }
            <Notification ref={this.notification}/>
        </Fragment>
    }

    navigateToEdit = (authId) => {
        this.props.history.push({
            pathname: '/auth',
            state: { authId }
        })
    }

    notify = (text) => {
        this.notification.current.addElement(text);
    }

    onNewAuthToggle = (addNewAuth) => {
        this.setState({addNewAuth});
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
                    this.notify(`An error occurred while deleting auth`)
                } else {
                    this.deleteAuth(selectedAuth);
                    this.notify(`Auth successfully deleted`)
                }})
    }

    deleteAuth = (authId) => {
        const newAuths = this.state.auths.filter((auth) => auth.id !== authId);
        this.setState({auths: newAuths, showModal: false});
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