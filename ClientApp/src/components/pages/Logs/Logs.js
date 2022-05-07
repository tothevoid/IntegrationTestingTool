import "./Logs.scss"
import React, { Component, Fragment } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from "../../controls/Button/Button"
import { Log } from "../Log/Log"
import { getCurrentDate, getIsoStringWithoutTime, setMaxTimeToDate} from "../../../utils/dateExtensions"
import { withTranslation } from "react-i18next";

class Logs extends Component {
    BATCH_SIZE = 15;

    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            newLogs: [],
            offset: 0,
            dateFilter: getCurrentDate(),
            loadingNewLogs: false
        }
    }

    componentDidMount = async () => {
        const { dateFilter, offset } = this.state;
        await this.fetchLogs(dateFilter, offset);
        window.addEventListener('scroll', this.handleScroll);
        this.attachDynamicLogs();
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll);
        this.state.hubConnection.stop();
    }
    
    handleScroll = async () => {
        const {loadingNewLogs} = this.state;
        if (loadingNewLogs){
            return;
        }
        const {documentElement, body} = document;

        const scrollTop = documentElement.scrollTop || body.scrollTop;
        const scrollHeight = documentElement.scrollHeight || body.scrollHeight;

        var percent = scrollTop / (scrollHeight - documentElement.clientHeight) * 100;

        if (percent >= 95){
            await this.loadMore();
        }
    }

    attachDynamicLogs = () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(`${this.props.config.wsURL}/hubs/logs`)
            .withAutomaticReconnect()
            .build();

        hubConnection.on("NewLog", data => {
            const newElement = {isNew: true, ...data};
            const isCurrentDate = getIsoStringWithoutTime(getCurrentDate()) === 
                getIsoStringWithoutTime(this.state.dateFilter);
            
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

    onDateFilterChanged = async (event) => {
        const date = new Date(event.target.value);
        const maxDate = setMaxTimeToDate(date);
        await this.onDateUpdated(maxDate);
    }
    
    onNewRequestsClick = async () => 
        await this.onDateUpdated(getCurrentDate());

    onDateUpdated = async (date) => {
        const newOffset = 0;
        this.setState({dateFilter: date, offset: newOffset});
        await this.fetchLogs(date, newOffset);
    }

    render = () => {
        const {theme, t, config} = this.props;
        return <div>
            <span>
                <div className={`datepicker ${theme}`}>
                    <span className="datepicker-label">{t("logs.date")}:</span>
                    <input className="datepicker-value" value={getIsoStringWithoutTime(this.state.dateFilter)} onChange={this.onDateFilterChanged} type="date"/>
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

    fetchLogs = async (date, offset) => {
        const logs = await this.getLogs(date, offset);
        if (logs){
            this.setState({
                offset: this.state.offset + this.BATCH_SIZE,
                logs: logs.map(log => {return {...log, isNew: this.state.newLogs.find(newLog => newLog === log.id)}})
            });
        }
    }

    loadMore = async () => {
        const {offset, dateFilter} = this.state;
        this.setState({loadingNewLogs: true});
        const logs = await this.getLogs(dateFilter, offset);
        if (logs && logs.length !== 0){
            this.setState({
                offset: offset + this.BATCH_SIZE,
                loadingNewLogs: false,
                logs: [...this.state.logs, ...logs]
            });
        }
    }

    getLogs = async (date, offset) => {
        const timeZoneOffset = new Date().getTimezoneOffset();
        const response = await fetch(`${this.props.config.apiURL}/RequestLog?date=${date}&offset=${offset}&timeZoneOffset=${timeZoneOffset}`);
        return (response.ok) ?
            await response.json():
            null;
    }
}

const WrappedLogs = withTranslation()(Logs);
export {WrappedLogs as Logs}