import React, { Component } from 'react';
import "./Logs.css"
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from "../../controls/Button/Button"

export class Logs extends Component {
    constructor(props) {
        super(props);
        const date = this.getCurrentDate();
        this.state = {
            logs: [],
            dateFilter: date,
            newLogs: []
        }
        this.fetchLogs(date);
    }

    componentDidMount = () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/logs')
            .withAutomaticReconnect()
            .build();

        hubConnection.on("NewLog", data => {
            const newElement = {isNew: true, ...data};
            const isCurrentDate = this.getCurrentDate() === this.state.dateFilter;

            this.setState(prevState => ({
                newLogs: [...prevState.newLogs, newElement.id],
                logs: (isCurrentDate) ? [newElement, ...prevState.logs] : prevState.logs
            }))
        });

        this.setState({ hubConnection }, () => {
            this.state.hubConnection.start()
                .then(() => console.log("connected"))
                .catch(() => console.log("not connected"));
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
            <div className="log-url">{this.props?.config?.testAPIUrl}/{log.path}</div>
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
                const selected = state.logs.find((log) => log.id === id);
                const logs = state.logs.map((log) =>
                    (log.id === id) ? 
                        {...log, isNew: false}: 
                        log
                );
                const newLogs = (selected.isNew) ? 
                    this.state.newLogs.filter((log) => log !== id) : 
                    this.state.newLogs

                return {logs, newLogs};
            })
        }
    }

    onDateFilterChanghed = (event) => {
        const date = event.target.value;
        this.setState({dateFilter: date});
        this.fetchLogs(date);
    }

    getCurrentDate = () => {
        const date = new Date();
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString().substr(0, 10);
    }

    onNewRequestsClick = () => {
        const date = this.getCurrentDate();
        this.setState({dateFilter: date});
        this.fetchLogs(date);
    }

    render = () => {
        return <div>
            <span>
                <div className="date-container">
                    <span>Date: </span>
                    <input className="input-date" value={this.state.dateFilter} onChange={this.onDateFilterChanghed} type="date"/>
                    {
                        (this.state.newLogs.length) ?
                            <Button onClick={this.onNewRequestsClick} mode="danger" caption={`New requests: ${this.state.newLogs.length}`}/> :
                            <span></span>
                    }
                </div>
            </span>
            {this.state.logs.map((log) => this.renderLog(log))}
        </div>
    }
        

    fetchLogs = (date) => 
        fetch(`RequestLog?date=${date}`)
            .then((response)=> response.json())
            .then((logs) => {this.setState({
                logs: logs.map(log => {return {...log, isNew: this.state.newLogs.find(newLog => newLog === log.id)}})
            })});
}