import React, { Component } from 'react';
import "./Logs.css"
import { HubConnectionBuilder } from '@microsoft/signalr';

export class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        }
        this.logs();
    }

    componentDidMount = () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/logs')
            .withAutomaticReconnect()
            .build();

        hubConnection.on("NewLog", data => {
            const newElement = {isNew: true, ...data};
            this.setState(prevState => ({
                logs: [newElement, ...prevState.logs]}))
        });

        this.setState({ hubConnection }, () => {
            this.state.hubConnection.start()
                .then(()=>console.log("connected"))
                .catch(()=>console.log("not connected"));
        });
    }

    formatDate = (date) => 
        this.addZeroes(date.getDate()) + "/" + this.addZeroes((date.getMonth() + 1)) + "/" + date.getFullYear() 
        + " " + this.addZeroes(date.getHours()) + ":" + this.addZeroes(date.getMinutes());

    addZeroes = (value) => 
        (value <= 9) ?
            "0" + value :
            value; 

    renderLog = (log) =>
        <div onMouseEnter={() => this.onMouseEnter(log)} key={log.id} className="log">
            <span className="log-date">{this.formatDate(new Date(log.createdOn))}</span> 
            <div>{this.props?.config?.testUrl}{log.path}</div>
            <div>Got: {log.recieved}</div>
            <div>Sent: {log.returned}</div>
            {
                log.isNew ? 
                    <span className="new-label">New</span> :
                    <span></span>
            }
        </div>

    onMouseEnter = ({isNew, id}) => {
        if (isNew){
            this.setState((state) => {
                const logs = state.logs.map((log) =>
                    (log.id === id) ? 
                        {...log, isNew: false}: 
                        log
                );
                return {logs};
            })
        }
    }

    render = () => 
        <div>
            {this.state.logs.map((log) => this.renderLog(log))}
        </div>

    logs = () => 
        fetch("RequestLog")
            .then((response)=> response.json())
            .then((logs)=> {this.setState({logs: logs})});
}