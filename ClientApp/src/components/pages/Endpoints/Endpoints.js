import React, { Component } from 'react';
import "./Endpoints.css"

export class Endpoints extends Component {
    
    componentDidMount() {
        this.getEndpoints();
    }
    
    render() {
        return <div>
            {this.state?.endpoints?.length}
        </div>
    }

    getEndpoints() {
        fetch("Endpoint")
            .then((response)=> response.json())
            .then((endpoints)=> {this.setState({endpoints: endpoints})});
    }
}