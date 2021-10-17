import "./Modal.scss"

import React, {Fragment} from "react"
import ReactDOM from "react-dom"
import {Button} from "../Button/Button"

export const Modal = (props) => {
    const {title, text, show, onSuccess, onReject, theme} = props;
    
    if (!show){
        return null;
    }
    
    const modal = <div className={`modal-wrapper ${theme}`}>
        <div className="modal-container">
            <div className="modal-title">{title}</div>
            <div className="modal-text">{text}</div>
            <div className="modal-buttons">
                <Button caption="Yes" onClick={() => onSuccess()}/>
                <Button mode="danger" caption="No" onClick={() => onReject()}/>
            </div>
        </div>
    </div>

    const element = document.getElementById("portal");
    return <Fragment>
        {ReactDOM.createPortal(modal, element)}
    </Fragment>
    
}