import React from 'react';
import request from 'request';
import Select from 'react-select';

class SectionManager extends React.Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	componentWillMount() {
		this.fetchAll(this.props.organizationID, this.props.courseID, this.props.semesterID);
	}
	componentWillReceiveProps(props) {
		if (this.props.organizationID != props.organizationID ||
			this.props.courseID != props.courseID ||
			this.props.semesterID != props.semesterID) {
			this.setState({
				id: null
			});
		}
		this.fetchAll(props.organizationID, props.courseID, props.semesterID);
	}
	fetchAll(organizationID, courseID, semesterID) {
		const fetchAllOptions = {
			method: 'GET',
			qs: {
				semesterID: semesterID
			},
			uri: this.props.apiUrl + '/api/getCourseSections/' + courseID,
			json: true
		};

		request(fetchAllOptions, (err, res, body) => {
			let list = [];
			for (let section of body.Sections) {
				list.push({ value: section.SectionID, label: section.Name });
			}
			this.setState({
				list: list
			});
		});
	}
	fetch() {
		const fetchOptions = {
			method: 'GET',
			uri: this.props.apiUrl + '/api/section/' + this.state.id,
			json: true
		};
		request(fetchOptions, (err, res, body) => {
			this.setState({
				identifier: body.Section.Name,
				editing: true
			});
		});
	}
	create() {
		this.setState({
			creating: true
		});
	}
	edit() {
		this.fetch();
	}
	delete() {}
	update() {}
	cancel() {
		this.setState({
			creating: false,
			editing: false
		});
	}
	changeID(option) {
		if(this.state.id != option.value) {
			this.setState({
				id: option.value,
				creating: false,
				editing: false
			});
			this.props.changeID(option.value);
		}
	}
	changeIdentifier(event) {
		this.setState({
			identifier: event.target.value
		});
	}
	save() {
		const saveOptions = {
			method: 'POST',
			uri: this.props.apiUrl + '/api/course/createsection',
			body: {
				organizationid: this.props.organizationID,
				semesterid: this.props.semesterID,
				courseid: this.props.courseID,
				name: this.state.identifier
			},
			json: true
		};

		request(saveOptions, (err, res, body) => {
			if(err || res.statusCode == 401) {
				console.log('Error submitting!');
				return;
			} else {
				this.changeID({
					value: body.result.SectionID
				});
				this.fetchAll(this.props.organizationID, this.props.courseID, this.props.semesterID);
			}
		});
	}
	onSubmit(event) {
		event.preventDefault();
	}
	render() {

		let select = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.section}</h2>
				<button type='button' onClick={this.create.bind(this)}>{this.props.strings.new}</button>
				{ this.state.id ?
					<button type='button' onClick={this.edit.bind(this)}>{this.props.strings.edit}</button>
					:
					<button type='button' onClick={this.edit.bind(this)} disabled>{this.props.strings.edit}</button>
				}
				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<Select options={this.state.list} value={this.state.id} onChange={this.changeID.bind(this)} resetValue={''} clearable={true} searchable={true}/>
				</form>
			</div>
		);

		let create = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.newSection}</h2>
				<button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
				<button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>
				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.identifier}</label>
					<input type='text' onChange={this.changeIdentifier.bind(this)}></input>
				</form>
			</div>
		);

		let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editSection}</h2>
				<button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
				<button type='button' onClick={this.delete.bind(this)}>{this.props.strings.delete}</button>
				<button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>
				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.identifier}</label>
					<input type='text' value={this.state.identifier} onChange={this.changeIdentifier.bind(this)}></input>
				</form>
			</div>
		);

		if(this.state.creating) {
			return create;
		} else if (this.state.editing) {
			return edit;
		} else {
			return select;
		}
	}
}

export default SectionManager;
