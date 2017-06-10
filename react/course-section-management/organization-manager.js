import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

class OrganizationManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
	// load all organizations when page loads
    componentWillMount() {
        this.fetchAll();
    }
	// retrieve all organizations in system
	// format as organizationID, Name tuples for select component
    fetchAll() {
        apiCall.get('/organization', (err, res, body) => {
            let list = [];
            for (let org of body.Organization) {
                list.push({ value: org.OrganizationID, label: org.Name});
            }
            this.setState({
                list: list
            });
        });
    }
	// get single organization information for editing
    fetch() {
        apiCall.get(`/organization/${this.state.id}`, (err, res, body) => {
            this.setState({
                name: body.Organization.Name,
                editing: true
            });
        });
    }
	// enable creation mode
    create() {
        this.setState({
            creating: true
        });
    }
	// fetch organizaton information before editing
    edit() {
        this.fetch();
    }
	// delete organization, cascade deletes
	// EXTENSIVE, PARANOID confirmation should be added here
	// opportunity for MASSIVE accidental data loss
	// reload organization list after deletion, nullify selected ID, propagate to parent
    delete() {
        apiCall.get(`/organization/delete/${this.state.id}`, deleteOptions, (err, res, body) => {
            this.changeID({
                value: null
            });
            this.fetchAll();
        });
    }
	// update organization name, logo editing should be added
    update() {
        const updateOptions = {
                Name: this.state.name
            };

        apiCall.post(`/organization/update/${this.state.id}`, updateOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.Message) {
                console.log('Error: Organization already exists.');
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
	// exit edit or creation mode, return to list
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
    }
	// send selected ID to parent if it changed, exit edit mode on successful ID change
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
	// store organization name into state on entry
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
	// save new organization, send new organizationID to parent for rendering
	// reload organization list to show new organization
    save() {
        const saveOptions = {
				//userid: this.props.userID,
                organizationname: this.state.name
            };

        apiCall.post('/createorganization', saveOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.org_feedback) {
                console.log('Error: Organization already exists.');
            }
            else {
                this.changeID({
                    value: body.neworganization.OrganizationID
                });
                this.fetchAll();
            }
        });

    }
	// prevent default form submission
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
		// show organization dropdown list with edit and new buttons
		// disable edit button unless there is a selected organization
        let select = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.organization}</h2>


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

		// show new organization creation form
		// add Dropzone for organization logo here
        let create = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.newOrganization}</h2>


        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.name}</label>
					<input type='text' onChange={this.changeName.bind(this)}></input>
				</form>
			</div>
		);

		// show organization editing form
		// fix Dropzone for organization logo here (not fully functional)
        let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editOrganization}</h2>


        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.delete.bind(this)}>{this.props.strings.delete}</button>
        <button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.name}</label>
					<input type='text' value={this.state.name} onChange={this.changeName.bind(this)}></input>
					<label>{this.props.strings.logo}</label>
					<Dropzone>{this.props.strings.upload}</Dropzone>
				</form>
			</div>
		);

		// conditionally render mode of card based on state
        if(this.state.creating) {
            return create;
        } else if (this.state.editing) {
            return edit;
        } else {
            return select;
        }
    }
}

export default OrganizationManager;
