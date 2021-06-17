import React, { Component, Fragment } from 'react';
import "./Home.css"
import {InputParameter} from "./forms/InputParameter"
import { ComboBox } from './controls/ComboBox/ComboBox';
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

    renderInputParameters = (inputParameters) => {
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
                    inputParameters.map((parameter, ix) => 
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

                        return <tr key={ix}>
                            <td className="input-parameter-name">{parameter.name}</td>
                            <td className="input-parameter-type">
                                <ComboBox onSelect={onInputTypeSelected} values={this.state.types} selectedValue={parameter.type}></ComboBox>
                            </td>
                            <td><button onClick={() => this.deleteInputParameter(parameter)}>X</button></td>
                        </tr>
                    }) 
                }
                </tbody>
         </table>
        </div> 
    }
   
    deleteInputParameter = (selectedParameter) => {
        const filteredParameters = this.state.inputParameters.filter((parameter) =>
            parameter.name !== selectedParameter.name)
        this.setState({inputParameters: filteredParameters});
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
                {this.renderInputParameters(this.state.inputParameters)}
                <hr/>
                <InputParameter onParameterAdded={this.onParameterAdded} types={this.state.types}></InputParameter>
                <hr/>
                    <button onClick={()=>console.log(this.state.inputParameters)} className="button-default">Add output parameter</button>
                {this.renderOutputParamers(this.state.outputParameters)}
                <button className="button-default" onClick={() => this.addEndpoint()}>Add endpoint</button>
            </div>
        );
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