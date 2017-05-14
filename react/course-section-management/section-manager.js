import React from 'react';
import request from 'request';
import Select from 'react-select';

class SectionManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
	// load all sections when both courseID and semesterID are selected in parent
    componentWillMount() {
        this.fetchAll(this.props.courseID, this.props.semesterID);
    }
	// reset sectionID if courseID or semesterID change (clear dropdown selection)
	// reload all sections based on course and semester
    componentWillReceiveProps(props) {
        if (this.props.organizationID != props.organizationID ||
			this.props.courseID != props.courseID ||
			this.props.semesterID != props.semesterID) {
            this.setState({
                id: null
            });
        }
        this.fetchAll(props.courseID, props.semesterID);
    }
	// get all sections in course and semester
	// store in ID, Name tuples for select dropdown
    fetchAll(courseID, semesterID) {
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
	// fetch single section information for editing
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
	// enable create mode
    create() {
        this.setState({
            creating: true
        });
    }
	// retrieve data before editing
    edit() {
        this.fetch();
    }
	// delete section
	// casading deletes need to be thought through (which tables should be cascaded)
	// add confirmation to prevent accidental deletion
    delete() {
        const deleteOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/section/delete/' + this.state.id,
            json: true
        };
        request(deleteOptions, (err, res, body) => {
            this.changeID({
                value: null
            });
            this.fetchAll();
        });
    }
	// update single section (identifier is the same as name, just different vocubulary for user interface)
	// exit edit or create mode on successful save, reload section list with new section
    update() {
        const updateOptions = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/updatesection',
            body: {
                name: this.state.identifier,
                sectionid: this.state.id
            },
            json: true
        };

        request(updateOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.Message) {
                console.log('Error: Section already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll(this.props.courseID, this.props.semesterID);
            }
        });
    }
	// discard changes, exit create or edit mode
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
    }
	// propagate sectionID change to parent for rendering of other components
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
	// change identifier (name) of section
    changeIdentifier(event) {
        this.setState({
            identifier: event.target.value
        });
    }
	// save new section, set new sectionID, reload section list with new section
    save() {
        const saveOptions = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/createsection',
            body: {
                semesterid: this.props.semesterID,
                courseid: this.props.courseID,
                name: this.state.identifier,
                organizationid: this.props.organizationID
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
                this.fetchAll(this.props.courseID, this.props.semesterID);
            }
        });
    }
	// prevent default form submission
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
		// display dropdown list of sections with new and edit buttons
		// disable edit button until a section is selected
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
