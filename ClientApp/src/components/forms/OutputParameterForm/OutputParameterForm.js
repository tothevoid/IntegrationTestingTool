import React, { Component } from 'react';
import "./OutputParameterForm.css"
import { Button } from "../../controls/Button/Button"
import { ComboBox } from '../../controls/ComboBox/ComboBox';

export class OutputParameterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            type: "",
            desiredValue: ""
        }
    }

    render = () => {
        const {name, desiredValue} = this.state;

        return <div className="output-parameter-form">
            <span className="output-parameter-element">Name</span>
            <input name="name" value={name} onChange={this.handleChange} className="output-parameter-element"/>
            <span className="output-parameter-element">Type</span>
            {
                (this?.props?.types?.length > 0) ? 
                    <ComboBox onSelect={this.onSelect} values={this.props.types} selectedValue={this.props.types[0].name}></ComboBox>:
                    <span></span>
            }
            <span className="output-parameter-element">Desired value</span>
            <input name="desiredValue" value={desiredValue} onChange={this.handleChange} className="output-parameter-element"/>
            <Button onClick={this.addParameter} additionalClasses="output-parameter-element" caption={"Add output parameter"}></Button>
        </div>
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    onSelect = (selectedValue) => {
        this.setState({type: selectedValue})
    }

    addParameter = () => {
        const {name, type, desiredValue} = this.state;
        if (name && type && desiredValue){
            this.props.onParameterAdded(name, type, desiredValue);
        }
    }
}