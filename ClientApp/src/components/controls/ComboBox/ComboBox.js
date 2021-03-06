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
        return <select className={`combobox ${theme}`} onChange={this.handleChange} value={selectedValue}>
            {values.map((value, ix) =>
                <option key={ix}>
                    {value}
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