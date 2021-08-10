import React, { Component } from 'react';
import "./ComboBox.css"

export class ComboBox extends Component {
    
    constructor(props) {
        super(props);       
        const selectedValue = (this.props.selectedValue) ?
            this.props.selectedValue:
            this.props.values[0].name;
        
        this.state = {selectedValue: selectedValue};
        this.props.onSelect(selectedValue);
    }

    render = () => {
        const {selectedValue} = this.state;
        const {values} = this.props;
        return <select onChange={this.handleChange} value={selectedValue}>
            {values.map((value, ix) =>
                <option key={ix}>
                    {value.name}
                </option>
                )
            }
        </select>
    }

    handleChange = (event) => {
        const newValue = event.target.value;
        this.setState({ selectedValue: newValue });
        this.props.onSelect(newValue);
    };
}