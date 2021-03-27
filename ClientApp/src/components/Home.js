import React, { Component, Fragment } from 'react';
import "./Home.css"
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            types: [],
            inputParameters: [{ name: "val", type: "int" }, { name: "day", type: "datetime" }],
            outputParameters: [{ name: "isSuccessful", type: "bool", desiredValue: "true"}]
        };
    }

    componentDidMount() {
        this.getTypes();
    }

    renderInputParameters = (inputParameters) =>
        <table className="input-parameter-container">
            <tr>
                <th className="input-parameter-name">Name</th>
                <th className="input-parameter-type">Type</th>
            </tr>
            {
                inputParameters.map((parameter) => 
                {
                    return <tr>
                        <td className="input-parameter-name">{parameter.name}</td>
                        <td className="input-parameter-type">
                            <select>
                                {this.state.types.map((type) =>
                                    <option key={type.id} selected={type.name === parameter.type}>
                                        {type.name}
                                    </option>
                                    )
                                }
                            </select>
                        </td>
                    </tr>
                }) 
            }
        </table>

    renderOutputParamers = (outputParameters) => 
        <table className="output-parameter-container">
            <tr>
                <th className="output-parameter-name">Name</th>
                <th className="output-parameter-type">Type</th>
                <th className="output-parameter-desired">DesiredValue</th>
            </tr>
            {
                outputParameters.map((parameter) => <tr>
                    <td className="output-parameter-name">{parameter.name}</td>
                    <td className="output-parameter-type">{parameter.type}</td>
                    <td className="output-parameter-desired">{parameter.desiredValue}</td>
                </tr>)
            }
        </table>

    render () {
        return (
            <div>
                <div>New endpoint:</div>
                <button className="button-default">Add new input parameter</button>
                {this.renderInputParameters(this.state.inputParameters)}
                <button className="button-default">Add new output parameter</button>
                {this.renderOutputParamers(this.state.outputParameters)}
                <button className="button-default" onClick={() => this.addEndpoint()}>Add endpoint</button>
            </div>
        );
    }

    async addEndpoint(endpoint) {
        await fetch("Endpoint", {
            method: 'POST',
            body: JSON.stringify(endpoint),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getTypes() {
        fetch("ParameterType")
            .then((response)=> response.json())
            .then((types)=> {this.setState({types: types})});
    }
}
