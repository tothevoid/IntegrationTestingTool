import "./Log.scss"
import React, { Component, Fragment } from 'react';
import { formatDate } from "../../../utils/dateExtensions"
import { formatFileSize } from "../../../utils/coreExtensions"
import { withTranslation } from "react-i18next";

class Log extends Component {
    render = () => {
        const { t, log, theme, onLogHovered } = this.props;
        const { id, createdOn, isError, returned, endpoint, received, isNew } = log;

        return <div onMouseEnter={() => onLogHovered(log)} key={id} className={`log ${theme}`}>
            <span className="log-date">{formatDate(new Date(createdOn))}</span>
            {
                isError && this.getErrorHeader(t, returned)
            }
            <div className="log-url">[{endpoint.method}] {this.props?.config?.mockURL}/{endpoint.path}</div>
            <div>{t("logs.received")}: {received}</div>
            {
                isError && this.getLogBody(t, endpoint.outputStatusCode, formatFileSize(endpoint.outputDataSize))
            }
            {
                isNew && <span className="new-label">{t("logs.new")}</span>
            }
        </div>
    }

    getErrorHeader(t, returned){
        return <div>{t("logs.error", {message: returned})}</div>
    }

    getLogBody(t, statusCode, outputDataSize){
        return <Fragment>
            <b>{t("logs.returned")}:</b>
            <div>{t("logs.code")}: {statusCode}</div>
            <div>{t("logs.dataSize")}: {outputDataSize}</div>
        </Fragment>
    }
}

const WrappedLog = withTranslation()(Log);
export {WrappedLog as Log}