import React from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';
import { Button } from '../controls/Button/Button'

export const InputParameters = (props) => 
    <div>
        <p>Required input parameters</p>
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
                    <tr key={ix}>
                        <td className="input-parameter-name">{parameter.name}</td>
                        <td className="input-parameter-type">
                            <ComboBox onSelect={(selectedType) => props.onParameterTypeUpdated(parameter.name, selectedType)}  
                                values={props.types} selectedValue={parameter.type}></ComboBox>
                        </td>
                        <td>
                            <Button mode="danger" caption="Delete" onClick={() => props.onParameterDeleted(parameter)}/>
                        </td>
                    </tr>
                ) 
            }
            </tbody>
         </table>
    </div> 
