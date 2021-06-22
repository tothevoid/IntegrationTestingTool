import React, { Component, Fragment } from 'react';
import "./Endpoint.css"
import { InputParameterForm } from "../../forms/InputParameterForm/InputParameterForm"
import { OutputParameterForm } from "../../forms/OutputParameterForm/OutputParameterForm"
import { InputParameters } from '../../tables/InputParameters';
import { OutputParameters } from '../../tables/OutputParameters';
import { Button } from "../../controls/Button/Button"

export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            types: [],
            inputParameters: [{ name: "val", type: "Integer" }, { name: "day", type: "DateTime" }],
            outputParameters: [{ name: "isSuccessful", type: "Boolean", desiredValue: "true"}],
            noOutput: false,
            anyInput: false
        };
    }

    componentDidMount() {
        this.getTypes();
    }    

    renderNewInputParameter = () => 
        <div>
            <input name="new-input-param-name" type="text"/>
            <input type="text"/>
            <button className="button-default">Add new input parameter</button>
        </div>

    render () {
        return (
            <div>
                <p>Server url: {this.props.config?.testUrl}
                    <input onChange={this.onPathChanged} value={this.state.path} type="text"/>
                </p>
                <input name="anyInput" onChange={this.onBoolChanged} checked={this.state.anyInput} type="checkbox"/>
                <span>Any input data</span>
                {
                    !this.state.anyInput ?
                        <Fragment>
                                <InputParameters onParameterTypeUpdated={this.onParameterTypeUpdated}
                                    onParameterDeleted={this.onParameterDeleted}
                                    parameters={this.state.inputParameters} types={this.state.types}>    
                                </InputParameters>
                            <hr/>
                            <InputParameterForm onParameterAdded={this.onParameterAdded} types={this.state.types}></InputParameterForm>
                        </Fragment> :
                        <div></div>                   
                }
                <input name="noOutput" onChange={this.onBoolChanged} checked={this.state.noOutput} type="checkbox"/>
                <span> Without output</span>
                {
                    !this.state.noOutput ?
                        <Fragment>
                            <OutputParameters onParameterTypeUpdated={this.onOutputParameterTypeUpdated}
                                onParameterDeleted={this.onOutputParameterTypeDeleted}
                                parameters={this.state.outputParameters} types={this.state.types}>
                            </OutputParameters>
                            <hr/>
                            <OutputParameterForm onParameterAdded={this.onOutputParameterAdded} types={this.state.types}></OutputParameterForm>
                        </Fragment> :
                        <div></div>                   
                }
                
                <hr/>
                <Button onClick={this.addEndpoint} caption={"Add endpoint"}></Button>
            </div>
        );
    }

    onPathChanged = (event) => {
        this.setState({path: event.target.value});
    }

    onBoolChanged = (event) => {
        this.setState({[event.target.name]: event.target.checked});
    }

    onOutputParameterTypeUpdated = (name, newType) => {
        this.setState((state) => {
            const outputParameters = state.outputParameters.map((storedParameter) =>
                (name === storedParameter.name) ? 
                    {...storedParameter, type: newType}: 
                    storedParameter
            );
            return {outputParameters};
        })
    }

    onOutputParameterTypeDeleted = (selectedParameter) => {
        const filteredParameters = this.state.outputParameters.filter((parameter) =>
            parameter.name !== selectedParameter.name)
        this.setState({outputParameters: filteredParameters});
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

    onOutputParameterAdded = (name, type, desiredValue) => {
        if (this.state.outputParameters.some((param) => param.name === name)){
            console.log(`parameter with name {name} already exists`);
        } else {
            this.setState(prevState => ({
                outputParameters: [...prevState.outputParameters, {name: name, type: type, desiredValue: desiredValue}]
            }))
        }
    }

    addEndpoint = () => {
        //temporary solution
        const {inputParameters, outputParameters, noOutput, anyInput, path} = this.state;

        const updatedInputParameters = (!anyInput) ? inputParameters.map((param) => {
                const type = this.state.types.find((type) => type.name === param.type);
                return {type: type, name: param.name};
            }) :
            []

        const updatedOutputParameters = (!noOutput) ? 
            outputParameters.map((param) => {
                const type = this.state.types.find((type) => type.name === param.type);
                return {type: type, name: param.name, desiredValue: param.desiredValue};
            }) :
            [];

        const data = {
            path: path,
            inputParameters: updatedInputParameters,
            outputParameters: updatedOutputParameters
        }
        fetch("Endpoint", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.status)
            .then(status => { if (status === 200) this.props.history.push("/endpoints")});
    }

    getTypes() {
        fetch("ParameterType")
            .then((response)=> response.json())
            .then((types)=> {this.setState({types: types})});
    }
}