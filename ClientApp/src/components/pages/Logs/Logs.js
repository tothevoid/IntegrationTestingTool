import "./Logs.scss"
import React, { Component, Fragment } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from "../../controls/Button/Button"
import { formatDate, getCurrentDate } from "../../../utils/dateExtensions"
import { formatFileSize } from "../../../utils/coreExtensions"
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

    renderLog = (log, theme) => {
        const { t } = this.props;
        return <div onMouseEnter={() => this.onMouseEnter(log)} key={log.id} className={`log ${theme}`}>
            <span className="log-date">{formatDate(new Date(log.createdOn))}</span>
            {
                (log.isError) ? 
                    <div>{t("logs.error", {message: log.returned})}</div> :
                    <Fragment/>
            }
            <div className="log-url">[{log.endpoint.method}] {this.props?.config?.mockURL}/{log.endpoint.path}</div>
            <div>{t("logs.received")}: {log.received}</div>
            {
                (!log.isError) ?
                    <Fragment>
                        <b>{t("logs.returned")}:</b>
                        <div>{t("logs.code")}: {log.endpoint.outputStatusCode}</div>
                        <div>{t("logs.dataSize")}: {formatFileSize(log.endpoint.outputDataSize)}</div>
                    </Fragment>:
                    null
            }
            {
                log.isNew ?
                    <span className="new-label">{t("logs.new")}</span> :
                    null
            }
        </div>
    }

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

    onDateFilterChanged = async (event) => {
        const date = event.target.value;
        this.setState({dateFilter: date});
        await this.fetchLogs(date);
    }

    onNewRequestsClick = async () => {
        const date = getCurrentDate();
        this.setState({dateFilter: date});
        await this.fetchLogs(date);
    }

    render = () => {
        const {theme, t} = this.props;
        return <div>
            <span>
                <div className={`datepicker ${theme}`}>
                    <span className="datepicker-label">{t("logs.date")}:  </span>
                    <input className="datepicker-value" value={this.state.dateFilter} onChange={this.onDateFilterChanged} type="date"/>
                    {
                        (this.state.newLogs.length) ?
                            <Button onClick={async () => await this.onNewRequestsClick} mode="danger" caption={t("logs.newRequests", {quantity: this.state.newLogs.length})}/> :
                            null
                    }
                </div>
            </span>
            {this.state.logs.map((log) => this.renderLog(log, theme))}
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