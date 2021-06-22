import React, { Component } from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';

export const OutputParameters = (props) => 
    <table className="output-parameter-container">
        <thead>
            <tr>
                <th className="output-parameter-name">Name</th>
                <th className="output-parameter-type">Type</th>
                <th className="output-parameter-desired">Desired value</th>
            </tr>
        </thead>
        <tbody>
            {
                props.parameters.map((parameter, ix) => <tr key={ix}>
                    <td className="output-parameter-name">{parameter.name}</td>
                    {
                        (props.types) ?
                            <ComboBox onSelect={(selectedType) => props.onParameterTypeUpdated(parameter.name, selectedType)}  
                                values={props.types} selectedValue={parameter.type}></ComboBox> :
                            <span></span>
                    }
                    <td className="output-parameter-desired">{parameter.desiredValue}</td>
                    <td><button onClick={() => props.onParameterDeleted(parameter)}>X</button></td>
                </tr>)
            }
        </tbody>
    </table>