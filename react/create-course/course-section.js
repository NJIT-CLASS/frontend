import React from 'react';
import request from 'request';

import Select from 'react-select';

import SectionMember from './section-member';

import Modal from '../shared/modal';

import {clone} from 'lodash';   // this imports the _.clone() function, it can be used later as just clone()

class CourseSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.section.name || '',
            description: props.section.description || '',
            semesterId: props.section.semesterId || null,
            members: props.section.members || [],
			sectionNameError: false,	
			sectionDescriptionError: false,	
            showCreateSemesterModal: false,
            semesters: [],
            semesterNameError: false,
            semesterDateEmptyError: false,
            semesterDateOrderError: false
			//semesterError: false,	
			//courseMembers: false	
        };

/*
[{ value: 1, label: 'Spring 2016' },
                        { value: 2, label: 'Fall 2015' }]
                        */



    }

    // Will call before section is initially rendered and only then
    componentWillMount() {
        // Fetch the list of semesters.
        const semFetchOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester',
            json: true
        };

        request(semFetchOptions, (err, res, body) => {
            let semList = [];
            for (let sem of body.Semesters) {
                semList.push({ value: sem.SemesterID, label: sem.Name});
            }
            this.setState({
                semesters: semList
            });
        });
    }

    updateMember(index, member) {
        this.setState((previousState) => {
            let memberCount = previousState.members.length;
            let newMembers = previousState.members;

            // if new member then add object to array
            if (index >= memberCount) {
                let difference = index - memberCount - 1;

                while(difference > 0) {
                    newMembers.push({});
                }
            }

            newMembers[index] = member;
            return {members: newMembers};
        });
    }

    createSection(e) {

        // DELETEME
        console.log("State value: " + this.state.semesters);


        e.preventDefault();
	
        const name = this.state.name;	
		const description = this.state.description;
		const semesterId = this.state.semesterId;
		
		
        let section = {
            name: this.state.name,
            description: this.state.description,
            semesterId: this.state.semesterId,
            members: this.state.members
        };		
		

		const sectionNameError = name.length === 0 ? true : false;
		const sectionDescriptionError = description.length === 0 ? true : false;		
		const semesterError = semesterId === null ? true : false;
		
		if(sectionNameError || sectionDescriptionError || semesterError) {			
			return this.setState({				
				sectionNameError: sectionNameError,
				sectionDescriptionError: sectionDescriptionError,
				semesterError: semesterError	
			});
		}
		
		else{
			this.setState({
				sectionNameError: false,
				sectionDescriptionError: false,
				semesterError: false
			});
			
		}		

        return this.props.createSection(section);
    }

    onNameChange(e) {
        this.setState({name: e.target.value});
    }

    onDescriptionChange(e) {
        this.setState({description: e.target.value});
    }



    // Returns true if backend signifies successfully semester creation
    createSemester(semesterName, semesterStartDate, semesterEndDate) {

        // TODO: the body should also include a value for OrganizationID
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/CreateSemester',
            body: {
                Name: semesterName,
                startDate: semesterStartDate,
                endDate: semesterEndDate,
                OrganizationID: 1
            },
            json: true
        };

        request(options, (err, res, body) => {
            // TODO: add error handling
            console.log("Result status code:", res.status);
            if (res.SemesterID !== null) {
                return true;
            }
            return false;
        });
    }

    onSemesterChange(semesterId) {
        if (semesterId == "create") {   // If it's the "create semester" option...
            // Change state to show a "create semester" modal but don't actually change the dropdown selection
            this.setState({showCreateSemesterModal: true});
        }
        else {                          // Otherwise change the dropdown selection as expected
            this.setState({semesterId: semesterId});
        }
    }

    closeModal() {
        this.setState({
            showCreateSemesterModal: false,
            semesterNameError: false,
            semesterDateEmptyError: false,
            semesterDateOrderError: false
        });
    }

    submitCreateSemesterValidation() {
        if (this.refs.field_semesterName.value.length == 0) {   // Name field is empty
            this.setState({
                semesterNameError: true,
                semesterDateEmptyError: false,
                semesterDateOrderError: false
            });
            return false;
        }
        if (this.refs.field_startDate.value == "" || this.refs.field_endDate.value == "") {  // Date fields not complete
            this.setState({
                semesterNameError: false,
                semesterDateEmptyError: true,
                semesterDateOrderError: false
            });
            return false;
        }
        if (this.refs.field_endDate.value < this.refs.field_startDate.value) {  // End date comes before start date
            this.setState({
                semesterNameError: false,
                semesterDateEmptyError: false,
                semesterDateOrderError: true
            });
            return false;
        }
        return true;
    }

    submitCreateSemester() {
        if (this.submitCreateSemesterValidation() === false) {
            return false;
        }
        if (this.createSemester(this.refs.field_semesterName.value, this.refs.field_startDate.value, this.refs.field_endDate.value) === false) {
            // TODO: show something to user to signify failure
            console.log("Failed to create semester on backend");
            return false;
        }

        let semesterCopy = this.state.semesters;
        let newSemesterValue = semesterCopy.length + 1;
        semesterCopy.push({value: newSemesterValue, label:this.refs.field_semesterName.value});  // add the new semester on to the copied array
        this.setState({semesters: semesterCopy, semesterId: newSemesterValue});  // Update the semester list, and set the selector to the new value
        this.closeModal();
    }

    render() {

        let lastIndex = 0;

        let semestersList = clone(this.state.semesters);      // using lodash here
        semestersList.push({ value: "create", label: 'Create new semester...' });

        let semesterNameErrorText = null;
        if (this.state.semesterNameError == true) {
            semesterNameErrorText = (
                <div className="error form-error">
                <i className="fa fa-exclamation-circle"></i>
                    <span>Error: Please enter a name for the semester.</span>
                </div>
            );
        }

        let semesterDateEmptyErrorText = null;
        if (this.state.semesterDateEmptyError == true) {
            semesterDateEmptyErrorText = (
                <div className="error form-error">
                <i className="fa fa-exclamation-circle"></i>
                    <span>Error: Please select a start date and end date for the semester.</span>
                </div>
            );
        }

        let semesterDateOrderErrorText = null;
        if (this.state.semesterDateOrderError == true) {
            semesterDateOrderErrorText = (
                <div className="error form-error">
                <i className="fa fa-exclamation-circle"></i>
                    <span>Error: The end date must come after the start date.</span>
                </div>
            );
        }

        let createSemesterModal = null;
        if (this.state.showCreateSemesterModal) {
            createSemesterModal = (
                <Modal title="Create a Semester" close={this.closeModal.bind(this)}>
                    {semesterNameErrorText}
                    {semesterDateEmptyErrorText}
                    {semesterDateOrderErrorText}
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="field_semesterName">Semester Name</label>
                        <div class="col-sm-10">
                            <input class="form-control" name="field_semesterName" ref="field_semesterName" id="field_semesterName" type="text"></input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="field_startDate">Start Date</label>
                        <div class="col-sm-10">
                            <input class="form-control" name="field_startDate" ref="field_startDate" id="field_startDate" type="date"></input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="field_endDate">End Date</label>
                        <div class="col-sm-10">
                            <input class="form-control" name="field_endDate" ref="field_endDate" id="field_endDate" type="date"></input>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-lg" onClick={this.submitCreateSemester.bind(this)}>Submit</button>
                </Modal>
            );
        }

        let members = this.state.members.map((member) => {
            return (
                <SectionMember
                    email={member.email}
                    role={member.role}
                    updateMember={this.updateMember.bind(this, lastIndex)}
                    key={lastIndex++}
                />
            );
        });



        // always have one extra member field
        members.push(<SectionMember updateMember={this.updateMember.bind(this, lastIndex)} key={lastIndex++}/>);

        return (
            <div className="section">
                {createSemesterModal}
                <h2 className="title">Create Section</h2>
                <div className="section-content">
                    <label>Section Name</label>
                    <div>
                        <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)} className={ this.state.sectionNameError ? 'error' : '' }></input>
                    </div>
                    <label>Section Description</label>
                    <div>
                        <textarea value={this.state.description} onChange={this.onDescriptionChange.bind(this)} className={ this.state.sectionDescriptionError ? 'error' : '' }></textarea>
                    </div>
                    <label>Semester</label>
                    <Select
                        name="semester"
                        value={this.state.semesterId}
                        options={semestersList}
                        clearable={false}
                        searchable={false}
                        onChange={this.onSemesterChange.bind(this)}
						className={ this.state.semesterError ? 'error' : '' } 
                    />
                    <label>Course Members</label>
                    <div>
                        {members}
                    </div>
                    <button type="submit" onClick={this.createSection.bind(this)}>{this.props.section.name ? 'Update Section' : 'Create Section'}</button>
                </div>
            </div>
        );
    }
}

CourseSection.defaultProps = {
    section: {}
};

export default CourseSection;