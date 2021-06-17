import React, { Component, Fragment } from 'react';
import "./Home.css"
import { InputParameter } from "./forms/InputParameter"
import { InputParameters } from './tables/InputParameters';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            types: [],
            inputParameters: [{ name: "val", type: "Integer" }, { name: "day", type: "DateTime" }],
            outputParameters: [{ name: "isSuccessful", type: "bool", desiredValue: "true"}]
        };
    }

    componentDidMount() {
        this.getTypes();
        this.getConfig();
    }

    renderOutputParamers = (outputParameters) => 
        <table className="output-parameter-container">
            <thead>
                <tr>
                    <th className="output-parameter-name">Name</th>
                    <th className="output-parameter-type">Type</th>
                    <th className="output-parameter-desired">DesiredValue</th>
                </tr>
            </thead>
            <tbody>
                {
                    outputParameters.map((parameter, ix) => <tr key={ix}>
                        <td className="output-parameter-name">{parameter.name}</td>
                        <td className="output-parameter-type">{parameter.type}</td>
                        <td className="output-parameter-desired">{parameter.desiredValue}</td>
                    </tr>)
                }
            </tbody>
          
        </table>

    renderNewInputParameter = () => 
        <div>
            <input name="new-input-param-name" type="text"/>
            <input type="text"/>
            <button className="button-default">Add new input parameter</button>
        </div>

    render () {
        return (
            <div>
                <p>Server url: {this?.state?.config?.testUrl}<input type="text"/></p>
                <InputParameters onParameterTypeUpdated={this.onParameterTypeUpdated}
                    onParameterDeleted={this.onParameterDeleted}
                    parameters={this.state.inputParameters} types={this.state.types}></InputParameters>
                <hr/>
                <InputParameter onParameterAdded={this.onParameterAdded} types={this.state.types}></InputParameter>
                <hr/>
                    <button onClick={()=>console.log(this.state.inputParameters)} className="button-default">Add output parameter</button>
                {this.renderOutputParamers(this.state.outputParameters)}
                <button className="button-default" onClick={() => this.addEndpoint()}>Add endpoint</button>
            </div>
        );
    }

    onParameterDeleted = (selectedParameter) => {
        const filteredParameters = this.state.inputParameters.filter((parameter) =>
            parameter.name !== selectedParameter.name)
        this.setState({inputParameters: filteredParameters});
    }

    onParameterTypeUpdated = (name, newType) => {
        this.setState((state) => {
            const inputParameters = state.inputParameters.map((storedParameter) =>
                (name === storedParameter.name) ? 
                    {...storedParameter, type: newType}: 
                    storedParameter
            );
            return {inputParameters};
        })
    }

    onParameterAdded = (name, type) => {
        if (this.state.inputParameters.some((param) => param.name === name)){
            console.log(`parameter with name {name} already exists`);
        } else {
            this.setState(prevState => ({
                inputParameters: [...prevState.inputParameters, {name: name, type: type}]
              }))
        }
    }

    async addEndpoint(endpoint) {
        console.log(this.state.inputParameters);
        await fetch("Endpoint", {
            method: 'POST',
            body: JSON.stringify(endpoint),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    getConfig() {
        fetch("ServerConfig")
            .then((response)=> response.json())
            .then((config)=> {this.setState({config: config})});
    }

    getTypes() {
        fetch("ParameterType")
            .then((response)=> response.json())
            .then((types)=> {this.setState({types: types})});
    }
}