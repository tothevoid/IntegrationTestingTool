import React from 'react';
import "./Button.css"

export const Button = (props) =>
{   
    const {disabled, additionalClasses, caption, mode, onClick} = props;
    debugger;
    return <button disabled={disabled === true} onClick={(e) => {onButtonClick(e, onClick)}} className={getClasses(mode, additionalClasses)}>
        {caption}
    </button>
}

const onButtonClick = (event, onClick) => {
    event.preventDefault(); 
    if (onClick){
        onClick();
    }
}

const getClasses = (mode, additionalClasses) => [
    "button-common",
    getCoreClass(mode), 
    additionalClasses
].join(" ")

const getCoreClass = (mode) => {
    switch (mode){
        case "main":
            return "button-default";
        case "danger":
            return "button-danger";
        case "disabled":
            return "button-disabled"
        default:
            return "button-default";
    }
}