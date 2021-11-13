import React, { Component, Fragment } from 'react';
import { Button } from '../Button/Button';
import "./Search.scss"

export class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        }
    }

    render = () => {
        const { searchText } = this.state;
        const { theme } = this.props;
        return <Fragment>
            <span className={`search-label ${theme}`}>Search</span>
            <input type="text" className={`search-input ${theme}`} 
                onChange={this.handleChange} value={searchText}/>
            {
                (searchText) ?
                    <Button additionalClasses="search-clear" mode="danger" onClick={this.onClearClick} caption={"X"}/> :
                    null
            }
            </Fragment>
    }

    onClearClick = () => {
        this.setState({searchText: ""});
    }

    handleChange = (event) => {
        const {onTextChanged} = this.props;
        const text = event.target.value;
        this.setState({ searchText: text });
        onTextChanged(text);
    };
}