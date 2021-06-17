import React, { Component } from 'react';

export class InputParameters extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }  

    render () {
        return <table className="input-parameter-container">
            <p>Input parameters</p>
            <tr>
                <th className="input-parameter-name">Name</th>
                <th className="input-parameter-type">Type</th>
            </tr>
            {
                inputParameters.map((parameter) => 
                {
                    const onInputTypeSelected = (selectedType) => {
                        this.setState((state) => {
                            const inputParameters = state.inputParameters.map((storedParameter) =>
                                (parameter.name === storedParameter.name) ? 
                                    {...storedParameter, type: selectedType}: 
                                    storedParameter
                            );
                            return {inputParameters};
                        })
                    }

                    return <tr>
                        <td className="input-parameter-name">{parameter.name}</td>
                        <td className="input-parameter-type">
                            {this.renderTypeSelect(parameter.type, onInputTypeSelected)}
                        </td>
                        <td><button onClick={() => this.deleteInputParameter(parameter)}>X</button></td>
                    </tr>
                }) 
            }
        </table>
    }
}