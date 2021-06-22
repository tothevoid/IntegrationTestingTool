import React, { Component } from 'react';
import "./Logs.css"

export class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        }
        this.logs();
    }

    renderLog = (log) =>
        <div key={log.id} className="log">
            <div>{this.props?.config?.testUrl}{log.path}</div>
            <div>Got: {log.recieved}</div>
            <div>Sent: {log.returned}</div>
        </div>

    render() {
        return <div>
            {this.state.logs.map((log) => this.renderLog(log))}
        </div>
    }

    logs() {
        fetch("RequestLog")
            .then((response)=> response.json())
            .then((logs)=> {this.setState({logs: logs})});
    }
}