import React from 'react';
import request from 'request';
import Select from 'react-select';

class CourseManager extends React.Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	componentWillMount() {
		this.fetchAll(this.props.organizationID);
	}
	componentWillReceiveProps(props) {
		if(this.props.organizationID != props.organizationID) {
			this.setState({
				id: null
			});
		}
		this.fetchAll(props.organizationID);
	}
	fetchAll(organizationID) {
		let fetchAllOptions = {
			method: 'GET',
			uri: this.props.apiUrl + '/api/getOrganizationCourses/' + organizationID,
			json: true
		};
		request(fetchAllOptions, (err, res, body) => {
			let list = [];
			for (let course of body.Courses) {
				list.push({ value: course.CourseID, label: course.Number + ' – ' + course.Name });
			}
			this.setState({
				list: list
			});
		});
	}
	fetch() {
		const fetchOptions = {
			method: 'GET',
			uri: this.props.apiUrl + '/api/course/' + this.state.id,
			json: true
		};
		request(fetchOptions, (err, res, body) => {
			this.setState({
				name: body.Course.Name,
				number: body.Course.Number,
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
	changeName(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeNumber(event) {
		this.setState({
			number: event.target.value
		});
	}
	save() {
		const saveOptions = {
			method: 'POST',
			uri: this.props.apiUrl + '/api/course/create',
			body: {
				userid: this.props.userID,
				number: this.state.number,
				Name: this.state.name,
				organizationid: this.props.organizationID
			},
			json: true
		};

		request(saveOptions, (err, res, body) => {
			if(err || res.statusCode == 401) {
				console.log('Error submitting!');
				return;
			} else if (!body.Message) {
				console.log('Error: Course already exists.');
			}
			else {
				this.changeID({
					value: body.NewCourse.CourseID
				});
				this.fetchAll(this.props.organizationID);
			}
		});
	}
	onSubmit(event) {
		event.preventDefault();
	}
	render() {
		let select = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.course}</h2>
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
				<h2 className='title'>{this.props.strings.newCourse}</h2>
				<button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
				<button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>
				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.number}</label>
					<input type='text' onChange={this.changeNumber.bind(this)}></input>
					<label>{this.props.strings.name}</label>
					<input type='text' onChange={this.changeName.bind(this)}></input>
				</form>
			</div>
		);

		let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editCourse}</h2>
				<button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
				<button type='button' onClick={this.delete.bind(this)}>{this.props.strings.delete}</button>
				<button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>
				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.number}</label>
					<input type='text' value={this.state.number} onChange={this.changeNumber.bind(this)}></input>
					<label>{this.props.strings.name}</label>
					<input type='text' value={this.state.name} onChange={this.changeName.bind(this)}></input>
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

export default CourseManager;
