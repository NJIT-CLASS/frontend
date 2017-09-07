import React from 'react';
import Select from 'react-select';
import apiCall from '../shared/apiCall';

class CourseManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            DeleteChangeMessage: ''
        };
    }
	// load all courses when selected organization changes
    componentWillMount() {
        this.fetchAll(this.props.organizationID);
    }
	// reload courses when organizationID changes
    componentWillReceiveProps(props) {
        if(this.props.organizationID != props.organizationID) {
            this.setState({
                id: null
            });
        }
        this.fetchAll(props.organizationID);
    }
	// fetch all courses belonging to an organization
	// store courseIDs in array along with name and number
	// list is used in select element
	// courses displayed in "Number - Name" format
    fetchAll(organizationID) {
        apiCall.get(`/getOrganizationCourses/${organizationID}`, (err, res, body) => {
            let list = [];
            for (let course of body.Courses) {
                list.push({ value: course.CourseID, label: course.Number + ' – ' + course.Name });
            }
            this.setState({
                list: list
            });
        });
    }
	// fetch course info for editing
    fetch() {

        apiCall.get(`/course/${this.state.id}`, (err, res, body) => {
            this.setState({
                name: body.Course.Name,
                number: body.Course.Number,
                editing: true
            });
        });
    }
	// display new course page
    create() {
        this.setState({
            creating: true
        });
    }
	// load information before editing
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

	// delete course, cascade deletes
    delete() {
        this.setState({DeleteChangeMessage: ''});
        apiCall.get(`/course/delete/${this.state.id}`, (err, res, body) => {
            this.changeID({
                value: null
            });
            this.fetchAll();
        });
    }

    closeDeleteMessage() {
        this.setState({DeleteChangeMessage: ''});
    }
	// update number and name of course, reload course list, exit edit mode
    update() {
        const updateOptions = {
                Number: this.state.number,
                Name: this.state.name
            };

        apiCall.post(`/course/update/${this.state.id}`,updateOptions, (err, res, body) => {
            if(err || res.statusCode == 401) {
                console.log('Error submitting!');
                return;
            } else if (!body.Message) {
                console.log('Error: Course already exists.');
            }
            else {
                this.setState({
                    creating: false,
                    editing: false
                });
                this.fetchAll(this.props.organizationID);
            }
        });
    }
	// discard changes and return to list
    cancel() {
        this.setState({
            creating: false,
            editing: false
        });
        this.setState({DeleteChangeMessage: ''});
    }
	// on successful creation of course, new ID is passed to parent
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
	// store course name to state
    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }
	// store course number to state
    changeNumber(event) {
        this.setState({
            number: event.target.value
        });
    }
	// save new course, update selected courseID, reload course list
    save() {
        const saveOptions = {
                userid: this.props.userID,
                number: this.state.number,
                Name: this.state.name,
                organizationid: this.props.organizationID
            };

        apiCall.post('/course/create', saveOptions, (err, res, body) => {
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
	// prevent forms from being submitted normally
    onSubmit(event) {
        event.preventDefault();
    }
    render() {
		// show dropdown list of courses
		// enable edit button if a course is selected
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


		// display form to create new course
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

		// display form to edit existing course, prepopulated with existing data
        let edit = (
			<div className='card'>
				<h2 className='title'>{this.props.strings.editCourse}</h2><br /><br />

        {(this.state.DeleteChangeMessage == 'check-1') &&
        <div>
            <div className = "error form-error" style={{display: 'inline'}}>
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                                      <span>{this.props.strings.deleteCourse}</span></div><br /><br />
                                      <button className = "ynbutton" onClick={this.deleteChange.bind(this, 2)}>{this.props.strings.yes}</button>
                                      <button className = "ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</button><br /><br /><br />
                                    </div>
        }
        {(this.state.DeleteChangeMessage == 'check-2') &&
        <div>
            <div className = "error form-error" style={{display: 'inline'}}>
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                                      <span>{this.props.strings.deleteCourseDoubleCheck}</span></div><br /><br />
                                      <button className = "ynbutton" onClick={this.delete.bind(this)}>{this.props.strings.yes}</button>
                                      <button className = "ynbutton" onClick={this.closeDeleteMessage.bind(this)}>{this.props.strings.no}</button><br /><br /><br />
                                    </div>
        }

        <button type='button' onClick={this.cancel.bind(this)}>{this.props.strings.cancel}</button>
        <button type='button' onClick={this.deleteChange.bind(this, 1)}>{this.props.strings.delete}</button>
        <button type='button' onClick={this.update.bind(this)}>{this.props.strings.save}</button>

				<form className='card-content' onSubmit={this.onSubmit.bind(this)}>
					<label>{this.props.strings.number}</label>
					<input type='text' value={this.state.number} onChange={this.changeNumber.bind(this)}></input>
					<label>{this.props.strings.name}</label>
					<input type='text' value={this.state.name} onChange={this.changeName.bind(this)}></input>
				</form>
			</div>
		);

		// conditionally render create or edit modes by state
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
