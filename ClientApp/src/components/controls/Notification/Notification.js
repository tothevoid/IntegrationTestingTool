import "./Notification.scss"

import React, {Component, Fragment} from "react"
import ReactDOM from "react-dom"
import { v4 as uuidv4 } from 'uuid';
export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
        this.timers = [];
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
        const newNotification = {id, text};
        const timerIndex = setTimeout(this.onTimerEnded, duration * 1000, id);
        this.timers.push({id: id, index: timerIndex});
        const notifications = [newNotification, ...this.state.notifications]
        this.setState({notifications});
    }

    onTimerEnded = (id) => {
        const newNotifications = this.state
            .notifications.filter((notification) => notification.id !== id);
        this.setState({notifications: newNotifications});
        if (this.timers.hasOwnProperty(id)){
            const timerIndex = this.timers[id].index;
            clearTimeout(timerIndex);
            this.timers = this.timers.filter(storedTimer => storedTimer.index !== timerIndex);
        }
    }

    componentWillUnmount = () => {
        this.timers.forEach(timer => {clearTimeout(timer.index);});
    }
}