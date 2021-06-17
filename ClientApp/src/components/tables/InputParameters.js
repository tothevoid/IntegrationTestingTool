import React, { Component } from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';

export class InputParameters extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return <div>
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
                    this.props.parameters.map((parameter, ix) => 
                    {
                        return <tr key={ix}>
                            <td className="input-parameter-name">{parameter.name}</td>
                            <td className="input-parameter-type">
                                <ComboBox onSelect={(selectedType) => this.props.onParameterTypeUpdated(parameter.name, selectedType)}  
                                    values={this.props.types} selectedValue={parameter.type}></ComboBox>
                            </td>
                            <td><button onClick={() => this.props.onParameterDeleted(parameter)}>X</button></td>
                        </tr>
                    }) 
                }
                </tbody>
         </table>
        </div> 
    }
}