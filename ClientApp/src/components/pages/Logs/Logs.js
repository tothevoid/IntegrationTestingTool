import React, { Component } from 'react';
import "./Logs.css"
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from "../../controls/Button/Button"
import { formatDate, getCurrentDate } from "../../../utils/dateExtensions"

export class Logs extends Component {
    constructor(props) {
        super(props);
        const date = getCurrentDate();
        this.state = {
            logs: [],
            dateFilter: date,
            newLogs: []
        }
        this.fetchLogs(date);
    }

    componentDidMount = () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(`${this.props.config.wsURL}/hubs/logs`)
            .withAutomaticReconnect()
            .build();

        hubConnection.on("NewLog", data => {
            const newElement = {isNew: true, ...data};
            const isCurrentDate = getCurrentDate() === this.state.dateFilter;

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

    renderLog = (log, theme) =>
        <div onMouseEnter={() => this.onMouseEnter(log)} key={log.id} className={`log ${theme}`}>
            <span className="log-date">{formatDate(new Date(log.createdOn))}</span> 
            <div className="log-url">[{log.endpoint.method}] {this.props?.config?.mockURL}/{log.endpoint.path}</div>
            <div>Got data: {log.recieved}</div>
            <b>Returned:</b>
            <div>Code: {log.endpoint.outputStatusCode}</div>
            <div>Data: {log.returned}</div>
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

    onNewRequestsClick = () => {
        const date = getCurrentDate();
        this.setState({dateFilter: date});
        this.fetchLogs(date);
    }

    render = () => {
        const {theme} = this.props;
        return <div>
            <span>
                <div className={`datepicker ${theme}`}>
                    <span className="datepicker-label">Date:  </span>
                    <input className="datepicker-value" value={this.state.dateFilter} onChange={this.onDateFilterChanghed} type="date"/>
                    {
                        (this.state.newLogs.length) ?
                            <Button onClick={this.onNewRequestsClick} mode="danger" caption={`New requests: ${this.state.newLogs.length}`}/> :
                            <span></span>
                    }
                </div>
            </span>
            {this.state.logs.map((log) => this.renderLog(log, theme))}
        </div>
    }
        

    fetchLogs = (date) => 
        fetch(`${this.props.config.apiURL}/RequestLog?date=${date}`)
            .then((response) => response.json())
            .then((logs) => {this.setState({
                logs: logs.map(log => {return {...log, isNew: this.state.newLogs.find(newLog => newLog === log.id)}})
            })});
}