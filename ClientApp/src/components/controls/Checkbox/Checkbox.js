import React, {Fragment} from 'react';
import "./Checkbox.scss"

export const Checkbox = (props) => {
    const {caption, value, onSelect, fieldName, theme, additionalClass, toggle} = props;

    return (toggle) ?
        <input className={`toggle ${theme}`} onChange={() => onSelect(!value, fieldName)} checked={value} type="checkbox"/>:
        <div className={`checkbox ${theme} ${additionalClass}`}>
            <input className={`checkbox-switch ${theme}`} onChange={() => onSelect(!value, fieldName)} checked={value} type="checkbox"/>
            <label className="checkbox-text" onClick={() => onSelect(!value, fieldName)}>{caption}</label>
        </div>
}