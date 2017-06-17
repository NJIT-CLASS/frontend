import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Highlighter from 'react-highlight-words';

var DisabledUpsellOptions = createClass({
	displayName: 'DisabledUpsellOptions',
	propTypes: {
		label: PropTypes.string,
	},
	getInitialState () {
		return {};
	},
	setValue (value) {
		this.setState({ value });
		if (value) {
		}
	},
	renderLink: function() {
		return <a style={{ marginLeft: 5 }} href="/upgrade" target="_blank"></a>;
	},
	renderOption: function(option) {
		return (
			<Highlighter
			  searchWords={[this._inputValue]}
			  textToHighlight={option.label}
			/>
		);
	},
	renderValue: function(option) {
		return <strong style={{ color: option.color }}>&#x25cf; {option.label}</strong>;
	},
	render: function() {
		var options = [];
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select
					onInputChange={(inputValue) => this._inputValue = inputValue}
					options={options}
					optionRenderer={this.renderOption}
					onChange={this.setValue}
					value={this.state.value}
					valueRenderer={this.renderValue}
					/>
			</div>
		);
	}
});
module.exports = DisabledUpsellOptions;
