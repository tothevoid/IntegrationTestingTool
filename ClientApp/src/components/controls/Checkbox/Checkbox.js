import React from 'react';
import "./Checkbox.scss"

export const Checkbox = (props) => {
    const {caption, value, onSelect, fieldName, theme} = props;
    return <div className={`checkbox ${theme}`}>
        <input onChange={() => onSelect(!value, fieldName)} checked={value} type="checkbox"/>
        <span onClick={() => onSelect(!value, fieldName)}>{caption}</span>
    </div>
}