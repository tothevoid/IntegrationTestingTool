import React, { Component } from 'react';
import "./ComboBox.scss"

export class ComboBox extends Component {
    
    constructor(props) {
        super(props);
        const selectedValue = (this.props.selectedValue) ?
            this.props.selectedValue:
            this.props.values[0];
        this.state = {selectedValue: selectedValue};
        this.props.onSelect(selectedValue);
    }

    render = () => {
        const {theme} = this.props;
        const {selectedValue} = this.state;
        const {values} = this.props;

        const currentValue = typeof(selectedValue) === "object" ?
            selectedValue.value :
            selectedValue

        console.log(values.map(x=>(typeof(x) === "object") ? x.key: x));

        return <select className={`combobox ${theme}`} onChange={this.handleChange} value={currentValue}>
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