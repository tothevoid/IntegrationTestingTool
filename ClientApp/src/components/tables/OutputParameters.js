import React from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';
import { Button } from '../controls/Button/Button'

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
            props.parameters.map((parameter, ix) => 
                <tr key={ix}>
                    <td className="output-parameter-name">{parameter.name}</td>
                    <td className="output-parameter-type">
                        <ComboBox onSelect={(selectedType) => props.onParameterTypeUpdated(parameter.name, selectedType)}  
                            values={props.types} selectedValue={parameter.type}>
                        </ComboBox>
                    </td>
                    <td className="output-parameter-desired">{parameter.desiredValue}</td>
                    <td>
                        <Button mode="danger" caption="Delete" onClick={() => props.onParameterDeleted(parameter)}/> 
                    </td>
                </tr>
            )
        }
        </tbody>
    </table>