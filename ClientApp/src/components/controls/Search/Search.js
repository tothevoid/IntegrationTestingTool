import React, { Component } from 'react';
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
        return <div className={`search-input-container ${theme}`}>
            <input placeholder={caption} type="text" className={`search-input ${theme}`}
                onChange={this.handleChange} value={searchText}/>
            {
                (searchText) ?
                    <span className={`search-clear ${theme}`} onClick={this.onClearClick}>x</span> :
                    null
            }
            </div>
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