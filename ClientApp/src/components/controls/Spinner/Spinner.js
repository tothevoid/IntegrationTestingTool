import React, { Component } from 'react';
import "./Spinner.scss"

export class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render = () => 
        <div className="loading-spinner">
            <div className="circle main-circle">
                <div className="circle sub-circle"></div>
            </div>
        </div>
}