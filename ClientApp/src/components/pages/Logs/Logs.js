import "./Logs.scss"
import React, { Component, Fragment } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from "../../controls/Button/Button"
import { Log } from "../Log/Log"
import { getCurrentDate } from "../../../utils/dateExtensions"
import {withTranslation} from "react-i18next";

class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            newLogs: [],
            dateFilter: getCurrentDate()
        }
    }

    componentDidMount = async () => {
        const { dateFilter } = this.state;
        await this.fetchLogs(dateFilter);
    }

    attachDynamicLogs = () => {
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

        this.setState({ hubConnection }, () =>
            this.state.hubConnection.start()
        );
    }

    onLogHovered = ({isNew, id}) => {
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

    onDateFilterChanged = async (event) => 
        await this.onDateUpdated(event.target.value);
    
    onNewRequestsClick = async () => 
        await this.onDateUpdated(getCurrentDate());

    onDateUpdated = async (date) => {
        this.setState({dateFilter: date});
        await this.fetchLogs(date);
    }

    render = () => {
        const {theme, t, config} = this.props;
        return <div>
            <span>
                <div className={`datepicker ${theme}`}>
                    <span className="datepicker-label">{t("logs.date")}:</span>
                    <input className="datepicker-value" value={this.state.dateFilter} onChange={this.onDateFilterChanged} type="date"/>
                    {
                        (this.state.newLogs.length) ?
                            <Button onClick={async () => await this.onNewRequestsClick} mode="danger" 
                                caption={t("logs.newRequests", {quantity: this.state.newLogs.length})}/> :
                            null
                    }
                </div>
            </span>
            {this.state.logs.map((log) => <Log onLogHovered={this.onLogHovered} config={config} key={log.id} theme={theme} log={log}/>)}
        </div>
    }

    fetchLogs = async (date) => {
        const response = await fetch(`${this.props.config.apiURL}/RequestLog?date=${date}`);
        if (response.ok){
            const logs = await response.json();
            this.setState({
                logs: logs.map(log => {return {...log, isNew: this.state.newLogs.find(newLog => newLog === log.id)}})
            });
        }
    }
}

const WrappedLogs = withTranslation()(Logs);
export {WrappedLogs as Logs}