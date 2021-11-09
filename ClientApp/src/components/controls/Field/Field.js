import "./Field.scss"
import React, { Fragment } from 'react';

export const Field = (props) => {
    const {placeholder, onInput, value, label, theme, name, isTextarea, inline, className} = props;
    const fieldProps = {value, name, placeholder, onChange: (event) => onInput(event.target.name, event.target.value) }

    const inlineClass = inline ? "inline": "";

    return <div className={`field-container ${inlineClass} ${className ?? ""}`}>
        {
            (label) ? <div>{label}</div> : null
        }
        {
            (isTextarea) ?
                <textarea className={`field textarea ${theme}`} {...fieldProps}/> :
                <input autoComplete="off" className={`field ${theme}`} {...fieldProps}/>
        }
    </div>
}