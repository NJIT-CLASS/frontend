import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import Datetime from 'react-datetime';
import Tooltip from '../shared/tooltip';

class SemesterManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            DeleteChangeMessage: ''
        };
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

        apiCall.get(`/getOrganizationSemesters/${this.props.organizationID}`,(err, res, body) => {
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

        apiCall.get(`/semester/${this.state.id}`, (err, res, body) => {
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

//two level warning check
    deleteChange(num) {
        if (num == 1) {
            this.setState({DeleteChangeMessage: 'check-1'});
        }
        if (num == 2) {
            this.setState({DeleteChangeMessage: 'check-2'});
        }
    }
	// delete semester
	// additional confirmation should be presented to user to prevent data loss
    delete() {
        this.setState({DeleteChangeMessage: ''});
        apiCall.get(`/semester/delete/${this.state.id}`,(err, res, body) => {
            this.changeID({
                value: null
            });
            this.fetchAll();
        });
    }

    closeDeleteMessage() {
        this.setState({DeleteChangeMessage: ''});
    }
	// update name, start date, and end date of semester
	// exit edit or create mode, reload semester list with updated semester
    update() {
        const updateOptions = {
                Name: this.state.name,
                Start: this.state.startDate,
                End: this.state.endDate
            };

        apiCall.post(`/semester/update/${this.state.id}`, updateOptions, (err, res, body) => {
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
        this.setState({DeleteChangeMessage: ''});
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
    changeStartDate(dateString) {
        const date = dateString.format('YYYY-MM-DD');
        this.setState({
            startDate: date
        });
    }
    changeEndDate(dateString) {
        const date = dateString.format('YYYY-MM-DD');
        this.setState({
            endDate: date
        });
    }
	// save new semester, reload semester list on success
    save() {
        const saveOptions = {
                organizationID: this.props.organizationID,
                semesterName: this.state.name,
                start_sem: this.state.startDate,
                end_sem: this.state.endDate
            };

        apiCall.post('/createSemester', saveOptions, (err, res, body) => {
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
        console.log(this.props.strings);
        let create = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.newSemester}</h2>

        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.save.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<div style={{position:"relative"}}><label style={{width:"25%",display:"inline-block"}}>{this.props.strings.newSemesterName}</label><Tooltip style={{display:"inline-block"}} Text={this.props.strings.newSemesterToolTip} ID={'new_semester_name_tooltip'} /></div>
					<input type='text' onChange={this.changeName.bind(this)}></input>
					<label>{this.props.strings.startDate}</label>
          <Datetime
                timeFormat={false}
                closeOnSelect={true}
                onChange={this.changeStartDate.bind(this)}
          />
					<label>{this.props.strings.endDate}</label>
          <Datetime
                timeFormat={false}
                closeOnSelect={true}
                onChange={this.changeEndDate.bind(this)}
          />
				</form>
			</div>
		);

		// render editing form
		// again, update date fields with better date entry interface
        let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editSemester}</h2><br /><br />

        {(this.state.DeleteChangeMessage == 'check-1') &&
        <div>
            <div className = "error form-error" style={{display: 'inline'}}>
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                                      <span>{this.props.strings.deleteSemester}</span></div><br /><br />
                                      <button className = "ynbutton" onClick={this.deleteChange.bind(this, 2)}>{this.props.strings.yes}</button>
                                      <button className = "ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</button><br /><br /><br />
                                    </div>
        }
        {(this.state.DeleteChangeMessage == 'check-2') &&
        <div>
            <div className = "error form-error" style={{display: 'inline'}}>
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                                      <span>{this.props.strings.deleteSemDoubleCheck}</span></div><br /><br />
                                      <button className = "ynbutton" onClick={this.delete.bind(this)}>{this.props.strings.yes}</button>
                                      <button className = "ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</button><br /><br /><br />
                                    </div>
        }

        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.deleteChange.bind(this, 1)}>{this.props.strings.delete}</button>
        <button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.name}</label>
					<input type='text' value={this.state.name} onChange={this.changeName.bind(this)}></input>
					<label>{this.props.strings.startDate}</label>
          <Datetime
                defaultValue={Datetime.moment(this.state.startDate, 'YYYY-MM-DD')}
                timeFormat={false}
                closeOnSelect={true}
                onChange={this.changeStartDate.bind(this)}
          />

          <label>{this.props.strings.endDate}</label>
          <Datetime
                defaultValue={Datetime.moment(this.state.endDate, 'YYYY-MM-DD')}
                timeFormat={false}
                closeOnSelect={true}
                onChange={this.changeEndDate.bind(this)}
          />
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
