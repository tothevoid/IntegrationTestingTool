import React, { Component } from 'react';
import "./ComboBox.scss"

export class ComboBox extends Component {
    
    constructor(props) {
        super(props);

        const {selectedValue, values} = this.props;

        if (!selectedValue && values && values.length !== 0){
            this.props.onSelect(this.props.values[0]);
        }
    }

    render = () => {
        const {theme, values, selectedValue} = this.props;
        const preprocessedValue = typeof(selectedValue) === "object" ?
            selectedValue.value :
            selectedValue;

        return <select className={`combobox ${theme}`} onChange={this.handleChange} value={preprocessedValue}>
            {values.map((value) => {
                    const isObject = typeof(value) === "object";
                    return isObject ?
                        <option data-key={value.key} key={value.key}>{value.value}</option> :
                        <option data-key={value} key={value}>{value}</option>
                })
            }
        </select>
    }

    handleChange = ({target}) => {
        const option = target[target.selectedIndex];
        this.setState({ selectedValue: target.value });
        const key = option.getAttribute("data-key");
        if (key === target.value){
            this.props.onSelect(target.value);
        } else {
            this.props.onSelect({key, value: target.value});
        }
    }
}