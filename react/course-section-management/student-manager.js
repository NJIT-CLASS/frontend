import React from 'react';
import request from 'request';
import Select from 'react-select';
import TextArea from 'react-textarea';
var parse = require('csv-parse/lib/sync');

import Student from './student.js'

class StudentManager extends React.Component {
	constructor(props){
		super(props);
		this.state = { modeCSV: true }
	}
	changeName(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeEmail(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeFirstName(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeLastName(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeStatus(event) {
		this.setState({
			name: event.target.value
		});
	}
	changeEntryMode(event) {
		if(event.target.value == 'csv') {
			this.setState({
				modeCSV: true
			})
		} else {
			this.setState({
				modeCSV: false
			})
		}
	}
	validate(students) {
		let errors = [];
		let email = /^.+@.+\..+$/;
		let active = ['1','y','yes','a','active','t','true'];
		let inactive = ['0','n','no','i','inactive','f','false'];
		for (let i = 0; i < students.length; i++) {
			let student = students[i];
			if (!email.test(student.email)) {
				errors.push('Invalid email for student on line ' + (i + 1));
			}
			if (student.status) {
				student.status = student.status.toLowerCase();
				if (active.includes(student.status)) {
					student.status = true;
				} else if (inactive.includes(student.status)) {
					student.status = false;
				} else {
					errors.push('Unrecognized status for student on line ' + (i + 1));
				}
			} else {
				student.status = true;
			}
		}
		if (errors.length > 0) {
			this.setState({
				errors: errors
			})
		} else {
			this.setState({
				students: students,
				creating: false,
				editing: false,
				errors: null
			});
		}
	}
	add() {
		this.setState({
			creating: true,
			modeCSV: true
		});
	}
	save() {
		if (this.state.modeCSV) {
			this.saveCSV();
		} else {
			this.saveSingle();
		}
	}
	cancel() {
		this.setState({
			creating: false,
			editing: false
		});
	}
	saveCSV() {
		let students = parse(this.state.csv, {
			columns: ['email', 'firstName', 'lastName', 'status'],
			trim: true,
			skip_empty_lines: true,
			relax_column_count: true
		});
		this.validate(students);
	}
	saveSingle() {}
	onStudentCSVInput(csv) {
		this.setState({
			csv: csv
		});
	}
	onSubmit(event) {
		event.preventDefault();
	}
	render() {
		let csv = (
			<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
				<TextArea placeholder={this.props.strings.csvHeaders} autoGrow={true} onChange={this.onStudentCSVInput.bind(this)}/>
			</form>
		);
		let form = (
			<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
				<label>{this.props.strings.email}</label>
				<input type='text' onChange={this.changeEmail.bind(this)}></input>
				<label>{this.props.strings.firstName}</label>
				<input type='text' onChange={this.changeFirstName.bind(this)}></input>
				<label>{this.props.strings.lastName}</label>
				<input type='text' onChange={this.changeLastName.bind(this)}></input>
				<label>{this.props.strings.status}</label>
				<select onChange={this.changeStatus.bind(this)}>
					<option value="1">{this.props.strings.active}</option>
					<option value="0">{this.props.strings.inactive}</option>
				</select>
			</form>
		);
		let students = null;
		if (this.state.students) {
			students = this.state.students.map((student, index) => {
				return (
					<Student
						key={index}
						email={student.email}
						firstName={student.firstName}
						lastName={student.lastName}
						status={student.status}
					/>
				);
			});
		}
		let errors = null;
		if (this.state.errors) {
			errors = this.state.errors.map((error, index) => {
				return (
					<p key={index}>{error}</p>
				);
			})
		}
		let create = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.students}</h2>
				<button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>
				<button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
				{ errors }
				{ this.state.modeCSV ? csv : form }
			</div>
		);
		let list = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.students}</h2>
				<button type='button' onClick={this.add.bind(this)}>{this.props.strings.add}</button>
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{ students }
					</tbody>
				</table>
			</div>
		);
		if (this.state.creating) {
			return create;
		} else {
			return list;
		}
	}
}

export default StudentManager;
