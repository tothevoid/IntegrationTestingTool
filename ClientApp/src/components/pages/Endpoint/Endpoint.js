import React, { Component, Fragment } from 'react';
import "./Endpoint.css"
import { InputParameterForm } from "../../forms/InputParameterForm/InputParameterForm"
import { OutputParameterForm } from "../../forms/OutputParameterForm/OutputParameterForm"
import { InputParameters } from '../../tables/InputParameters';
import { OutputParameters } from '../../tables/OutputParameters';
import { Button } from "../../controls/Button/Button"
import { Checkbox } from "../../controls/Checkbox/Checkbox"
export class Endpoint extends Component {
    static displayName = Endpoint.name;

    constructor(props) {
        super(props);
        this.state = {
            path: "",
            types: [],
            inputParameters: [{ name: "val", type: "Integer" }, { name: "day", type: "DateTime" }],
            // outputParameters: [{ name: "isSuccessful", type: "Boolean", desiredValue: "true"}],
            outputData: "",
            noOutput: true,
            anyInput: true
        };
    }

    componentDidMount() {
        this.getTypes();
    }    

    renderNewInputParameter = () => 
        <div>
            <input name="new-input-param-name" type="text"/>
            <input type="text"/>
            <button className="button-default">Add new required input parameter</button>
        </div>

    render () {
        return (
            <div>
                <h1>Add new endpoint</h1>
                <p>
                    {this.props.config?.testUrl}
                    <input className="url" onBlur={() => this.validateUrl()} onChange={this.onPathChanged} value={this.state.path} type="text"/>
                    <span className="url-validation-error">{this.state.urlPathValidationText}</span>
                </p>
                <Checkbox fieldName="anyInput" onSelect={this.onBoolChanged} value={this.state.anyInput} caption="Any input data"/>
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
                <Checkbox fieldName="noOutput" onSelect={this.onBoolChanged} value={this.state.noOutput} caption="Without output"/>
               
                {
                    !this.state.noOutput ?
                        <Fragment>
                            <div>Output data:</div>
                            <input className="output" onChange={this.onOutputChanged} value={this.state.outputData} type="text"/>
                        </Fragment> :
                        // <Fragment>
                        //     <OutputParameters onParameterTypeUpdated={this.onOutputParameterTypeUpdated}
                        //         onParameterDeleted={this.onOutputParameterTypeDeleted}
                        //         parameters={this.state.outputParameters} types={this.state.types}>
                        //     </OutputParameters>
                        //     <hr/>
                        //     <OutputParameterForm onParameterAdded={this.onOutputParameterAdded} types={this.state.types}></OutputParameterForm>
                        // </Fragment> :
                        <div></div>                   
                }
                <hr/>
                <Button onClick={this.addEndpoint} caption={"Add endpoint"}></Button>
            </div>
        );
    }

    onOutputChanged = (event) => {
        this.setState({outputData: event.target.value});
    }

    validateUrl = () => 
    {
        if (this.state.path.trim() === "")
        {
            return;
        }
        
        fetch(`Endpoint/ValidateUrl?path=${this.state.path}`)
            .then(result => result.json())
            .then(result => {this.setState({urlPathValidationText: result})});
    }

    onBoolChanged = (propName, value) => {
        this.setState({[propName]: value});
    }

    onPathChanged = (event) => {
        this.setState({path: event.target.value});
    }

    // onOutputParameterTypeUpdated = (name, newType) => {
    //     this.setState((state) => {
    //         const outputParameters = state.outputParameters.map((storedParameter) =>
    //             (name === storedParameter.name) ? 
    //                 {...storedParameter, type: newType}: 
    //                 storedParameter
    //         );
    //         return {outputParameters};
    //     })
    // }

    // onOutputParameterTypeDeleted = (selectedParameter) => {
    //     const filteredParameters = this.state.outputParameters.filter((parameter) =>
    //         parameter.name !== selectedParameter.name)
    //     this.setState({outputParameters: filteredParameters});
    // }

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

    // onOutputParameterAdded = (name, type, desiredValue) => {
    //     if (this.state.outputParameters.some((param) => param.name === name)){
    //         console.log(`parameter with name {name} already exists`);
    //     } else {
    //         this.setState(prevState => ({
    //             outputParameters: [...prevState.outputParameters, {name: name, type: type, desiredValue: desiredValue}]
    //         }))
    //     }
    // }

    addEndpoint = () => {
        //temporary solution
        const {inputParameters, outputData, anyInput, path} = this.state;

        const updatedInputParameters = (!anyInput) ? inputParameters.map((param) => {
                const type = this.state.types.find((type) => type.name === param.type);
                return {type: type, name: param.name};
            }) :
            []

        // const updatedOutputParameters = (!noOutput) ? 
        //     outputParameters.map((param) => {
        //         const type = this.state.types.find((type) => type.name === param.type);
        //         return {type: type, name: param.name, desiredValue: param.desiredValue};
        //     }) :
        //     [];

        const data = {
            path: path,
            inputParameters: updatedInputParameters,
            outputData: outputData
            // outputParameters: updatedOutputParameters
        }
        fetch("Endpoint/Add", {
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