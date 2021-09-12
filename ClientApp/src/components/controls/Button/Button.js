import React from 'react';
import "./Button.scss"

export const Button = (props) =>
{   
    const {disabled, additionalClasses, caption, mode, onClick, theme} = props;
    return <button disabled={disabled === true} 
        onClick={(e) => {onButtonClick(e, onClick)}} className={getClasses(mode, additionalClasses, theme)}>
        {caption}
    </button>
}

const onButtonClick = (event, onClick) => {
    event.preventDefault(); 
    if (onClick){
        onClick();
    }
}

const getClasses = (mode, additionalClasses, theme) => [
    "button-common",
    getCoreClass(mode),
    theme, 
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
        case "custom":
            return "button-custom"
        default:
            return "button-default";
    }
}