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
        const { theme, caption } = this.props;
        return <Fragment>
            <span className={`search-label ${theme}`}>{caption}</span>
            <input type="text" className={`search-input ${theme}`} 
                onChange={this.handleChange} value={searchText}/>
            {
                (searchText) ?
                    <Button additionalClasses="search-clear" mode="danger" onClick={this.onClearClick} caption={"X"}/> :
                    null
            }
            </Fragment>
    }

    onClearClick = () =>
        this.handleTextChange("")

    handleChange = ({target}) =>
        this.handleTextChange(target.value)

    handleTextChange = (text) => {
        const {onTextChanged} = this.props;
        this.setState({ searchText: text });
        onTextChanged(text);
    }
}