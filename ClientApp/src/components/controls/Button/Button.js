import React from 'react';
import "./Button.css"

export const Button = (props) => 
    <button onClick={(e) => {e.preventDefault(); props.onClick()}} className={getClasses(props.mode, props.additionalClasses)}>
        {props.caption}
    </button>

const getClasses = (mode, additionalClasses) => ["button-common", getCoreClass(mode), additionalClasses].join(" ")

const getCoreClass = (mode) => {
    switch (mode){
        case "main":
            return "button-default";
        case "danger":
            return "button-danger";
        default:
            return "button-default";
    }
}