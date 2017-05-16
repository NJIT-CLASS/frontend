import React from 'react';
import request from 'request';
import Select from 'react-select';

class SemesterManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
	// fetch all semesters when card is loaded
    componentWillMount() {
        this.fetchAll(this.props.organizationID);
    }
	// fetch all semesters when organizationID prop changes
    componentWillReceiveProps(props) {
        if(this.props.organizationID != props.organizationID) {
            this.setState({
                id: null
            });
        }
        this.fetchAll(props.organizationID);
    }
	// retrieve all semesters for given organization
	// store in semesterID, Name tuples for select dropdown
    fetchAll() {
        const fetchAllOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/getOrganizationSemesters/' + this.props.organizationID,
            json: true
        };
        request(fetchAllOptions, (err, res, body) => {
            let list = [];
            for (let sem of body.Semesters) {
                list.push({ value: sem.SemesterID, label: sem.Name });
            }
            this.setState({
                list: list
            });
        });
    }
	// fetch single semester organization for editing
    fetch() {
        const fetchOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester/' + this.state.id,
            json: true
        };
        request(fetchOptions, (err, res, body) => {
            this.setState({
                name: body.Semester.Name,
                startDate: body.Semester.StartDate.split('T')[0],
                endDate: body.Semester.EndDate.split('T')[0],
                editing: true
            });
        });
    }
	// enabled creation mode with state
    create() {
        this.setState({
            creating: true
        });
    }
	// retrieve semester data before editing
    edit() {
        this.fetch();
    }
	// delete semester
	// additional confirmation should be presented to user to prevent data loss
    delete() {
        const deleteOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester/delete/' + this.state.id,
            json: true
        };
        request(deleteOptions, (err, res, body) => {
            this.changeID({
                value: null
            });
            this.fetchAll();
        });
    }
	// update name, start date, and end date of semester
	// exit edit or create mode, reload semester list with updated semester
    update() {
        const updateOptions = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/semester/update/' + this.state.id,
            body: {
                Name: this.state.name,
                Start: this.state.startDate,
                End: this.state.endDate
            },
            json: true
        };

        request(updateOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.Message) {
                console.log('Error: Semester already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll();
            }
        });
    }
	// exit create or edit mode
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
    }
	// propagate new semesterID to parent for rendering
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
	// next three functions are simple state storage for form fields
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
    changeStartDate(event) {
        this.setState({
            startDate: event.target.value
        });
    }
    changeEndDate(event) {
        this.setState({
            endDate: event.target.value
        });
    }
	// save new semester, reload semester list on success
    save() {
        const saveOptions = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/createSemester',
            body: {
                organizationID: this.props.organizationID,
                semesterName: this.state.name,
                start_sem: this.state.startDate,
                end_sem: this.state.endDate
            },
            json: true
        };

        request(saveOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.sem_feedback) {
                console.log('Error: Semester already exists');
            }
            else {
                this.changeID({
                    value: body.newsemester.SemesterID
                });
                this.fetchAll(this.props.organizationID);
            }
        });
    }
	// prevent default form submission
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
		// render semester list dropdown
		// disable edit button unless a semester is selected
        let select = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.semester}</h2>


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

		// render semester creation form
		// update the date fields for easier date entry (perhaps with a react module)
        let create = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.newSemester}</h2>

        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.name}</label>
					<input type='text' onChange={this.changeName.bind(this)}></input>
					<label>{this.props.strings.startDate}</label>
					<input type='date' onChange={this.changeStartDate.bind(this)}></input>
					<label>{this.props.strings.endDate}</label>
					<input type='date' onChange={this.changeEndDate.bind(this)}></input>
				</form>
			</div>
		);

		// render editing form
		// again, update date fields with better date entry interface
        let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editSemester}</h2>

        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.delete.bind(this)}>{this.props.strings.delete}</button>
        <button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.name}</label>
					<input type='text' value={this.state.name} onChange={this.changeName.bind(this)}></input>
					<label>{this.props.strings.startDate}</label>
					<input type='text' value={this.state.startDate} onChange={this.changeStartDate.bind(this)}></input>
					<label>{this.props.strings.endDate}</label>
					<input type='text' value={this.state.endDate} onChange={this.changeEndDate.bind(this)}></input>
				</form>
			</div>
		);

		// conditional rendering based on state
        if(this.state.creating) {
            return create;
        } else if (this.state.editing) {
            return edit;
        } else {
            return select;
        }
    }
}

export default SemesterManager;
