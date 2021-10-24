import "./Notification.scss"

import React, {Component, Fragment} from "react"
import ReactDOM from "react-dom"
import { uuidv4 } from "../../../utils/coreExtensions"

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
    }

    render = () => {
        const {theme} = this.props;
        if (this.state.notifications.length === 0){
            return null;
        }

        const notification = <div className={`notifications ${theme}`}>
            {
                this.state.notifications.map((notification) => 
                    <div key={notification.id} className="notification">{notification.text}</div>)
            }
        </div>
    
        const element = document.getElementById("notification");
        return <Fragment>
            {ReactDOM.createPortal(notification, element)}
        </Fragment>
    }

    addElement = (text, duration = 10) => {
        const id = uuidv4();
        const newNotication = {id, text};
        setTimeout(this.onTimerEnded, duration * 1000, id);
        const notifications = [newNotication, ...this.state.notifications]
        this.setState({notifications});
    }

    onTimerEnded = (id) => {
        const newNotifications = this.state
            .notifications.filter((notification) => notification.id !== id);
        this.setState({notifications: newNotifications});
    }
}