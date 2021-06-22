import React, { Component } from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';

export const InputParameters = (props) => 
    <div>
        <p>Input parameters</p>
        <table className="input-parameter-container">
            <thead>
                <tr>
                    <th className="input-parameter-name">Name</th>
                    <th className="input-parameter-type">Type</th>
                </tr>
            </thead>
            <tbody>
            {
                props.parameters.map((parameter, ix) => 
                {
                    return <tr key={ix}>
                        <td className="input-parameter-name">{parameter.name}</td>
                        <td className="input-parameter-type">
                            <ComboBox onSelect={(selectedType) => props.onParameterTypeUpdated(parameter.name, selectedType)}  
                                values={props.types} selectedValue={parameter.type}></ComboBox>
                        </td>
                        <td><button onClick={() => props.onParameterDeleted(parameter)}>X</button></td>
                    </tr>
                }) 
            }
            </tbody>
         </table>
    </div> 
