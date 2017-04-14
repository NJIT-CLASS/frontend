import React from 'react';
import request from 'request';
import Select from 'react-select';

class Observer extends React.Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	render() {
		return (
			<tr>
				<td>{this.props.email}</td>
				<td>{this.props.firstName}</td>
				<td>{this.props.lastName}</td>
				<td>{this.props.status ? 'Active' : 'Inactive'}</td>
			</tr>
		)
	}
}

export default Observer;
