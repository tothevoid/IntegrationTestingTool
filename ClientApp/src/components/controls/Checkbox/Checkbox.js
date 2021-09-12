import React from 'react';
import "./Checkbox.scss"

export const Checkbox = (props) => 
    <div className="checkbox">
        <input onChange={() => props.onSelect(props.fieldName, !props.value)} checked={props.value} type="checkbox"/>
        <span onClick={() => props.onSelect(props.fieldName, !props.value)}>{props.caption}</span>
    </div>
