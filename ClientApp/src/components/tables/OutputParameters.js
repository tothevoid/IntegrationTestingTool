import React, { Component } from 'react';
import { ComboBox } from '../controls/ComboBox/ComboBox';

export class OutputParameters extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return <table className="output-parameter-container">
            <thead>
                <tr>
                    <th className="output-parameter-name">Name</th>
                    <th className="output-parameter-type">Type</th>
                    <th className="output-parameter-desired">Desired value</th>
                </tr>
            </thead>
            <tbody>
                {
                    this.props.parameters.map((parameter, ix) => <tr key={ix}>
                        <td className="output-parameter-name">{parameter.name}</td>
                        {
                            (this.props.types) ?
                                <ComboBox onSelect={(selectedType) => this.props.onParameterTypeUpdated(parameter.name, selectedType)}  
                                    values={this.props.types} selectedValue={parameter.type}></ComboBox> :
                                <span></span>
                        }
                        <td className="output-parameter-desired">{parameter.desiredValue}</td>
                        <td><button onClick={() => this.props.onParameterDeleted(parameter)}>X</button></td>
                    </tr>)
                }
            </tbody>
        </table>
    }
}