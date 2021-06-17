import React, { Component } from 'react';
import "./Button.css"

export class Button extends Component {
    render() {
        return <button onClick={() => this.props.onClick()} className={this.getClasses()}>{this.props.caption}</button>
    }

    getClasses = () => ["button-default", this.props.additionalClasses].join(" ")
}