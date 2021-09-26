import "./Field.scss"
import React from 'react';

export const Field = (props) => {
    const {placeholder, onInput, value, label, theme, name, isTextarea} = props;
    const fieldProps = {value, name, placeholder, onChange: (event) => onInput(event.target.name, event.target.value) }

    return <div className="field-container">
        <div>{label}</div>
        {
            (isTextarea) ?
                <textarea className={`field textarea ${theme}`} {...fieldProps}/> :
                <input className={`field ${theme}`} {...fieldProps}/>
        }
    </div>
}