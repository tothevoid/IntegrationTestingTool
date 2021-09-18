import "./NotFound.scss"
import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export class NotFound extends Component {
    render = () => 
        <div className="not-found-block">
            <h1>The link that you've entered is not exists</h1>
            <Link to="/" className="btn btn-primary">Return to main page</Link>
        </div> 
}