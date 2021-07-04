import React, { Component } from 'react';
import "./InputParameterForm.css"
import { Button } from "../../controls/Button/Button"
import { ComboBox } from '../../controls/ComboBox/ComboBox';

export class InputParameterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            type: ""
        }
    }

    render = () => {
        const {name} = this.state;

        return <div className="input-parameter-form">
            <span className="input-parameter-element">Name</span>
            <input value={name} onChange={this.handleChange} className="input-parameter-element"/>
            <span className="input-parameter-element">Type</span>
            {
                (this?.props?.types?.length > 0) ? 
                    <ComboBox onSelect={this.onSelect} values={this.props.types} selectedValue={this.props.types[0].name}></ComboBox>:
                    <span></span>
            }
            <Button onClick={this.addParameter} additionalClasses="input-parameter-element" caption={"Add required input parameter"}></Button>
        </div>
    }

    handleChange = (event) => {
        this.setState({name: event.target.value});
    }

    onSelect = (selectedValue) => {
        this.setState({type: selectedValue})
    }

    addParameter = () => {
        const {name, type} = this.state;
        if (name && type){
            this.props.onParameterAdded(name, type);
        }
    }
}