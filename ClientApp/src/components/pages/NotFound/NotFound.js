import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import "./NotFound.css"

export class NotFound extends Component {
    render() {
        return <div className="not-found-block">
            <h1>The link that you have entered is not exists</h1>
            <Link to="/" className="btn btn-primary">Return to main page</Link>
        </div> 
        
    }
}