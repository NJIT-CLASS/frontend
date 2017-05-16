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
            semester_name: '',
            start_date: '',
            end_date:'',
          //  semester_value: '',
            name: props.section.name || '',
            description: props.section.description || '',
            semesterId: props.section.semesterId || null,
            members: props.section.members || [],
			      sectionNameError: false,
			      //sectionDescriptionError: false,
            showCreateSemesterModal: false,
            semesters: [],
            semesterNameError: false,
            semesterDateEmptyError: false,
            semesterDateOrderError: false
			//semesterError: false,
			//courseMembers: false
        };

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
      //alert(this.props.organizationID);
        e.preventDefault();
        const name = this.state.name;
		    const description = this.state.description;
		    const semesterId = this.state.semesterId;

    		const sectionNameError = name.length === 0 ? true : false;
    		//const sectionDescriptionError = description.length === 0 ? true : false;
    		const semesterError = semesterId === null ? true : false;

		if(sectionNameError || semesterError) {
			return this.setState({
				sectionNameError: sectionNameError,
				//sectionDescriptionError: sectionDescriptionError,
				semesterError: semesterError
			});
		}

		else{
			this.setState({
				sectionNameError: false,
			//	sectionDescriptionError: false,
				semesterError: false
			});

		}
        if(this.state.semesterId == "create"){

          const options={
            method: 'POST',
            uri: this.props.apiUrl + '/api/createSemester',
            body: {
              semesterName: this.state.semester_name,
              organizationID: this.props.organizationID,
              start_sem: this.state.start_date,
              end_sem: this.state.end_date
            },
            json: true
          };
          request(options, (err, res, body) => {
            const res_semester = body.newsemester;
            if(body.sem_feedback){
              //alert(body.newsemester.SemesterID);
              this.setState({semesterId: this.state.ssemesterId});
              let section = {
                  name: this.state.name,
                  description: this.state.description,
                  semesterId: res_semester.SemesterID,
                  members: this.state.members
              };
              return this.props.createSection(section);
            }else {
              alert(body.sem_feedback + "semester is already exist");
            }
          });
        } else {
          let section = {
              name: this.state.name,
              description: this.state.description,
              semesterId: this.state.semesterId,
              members: this.state.members
          };
          return this.props.createSection(section);
        }
    }

    onNameChange(e) {
        this.setState({name: e.target.value});
    }

    onDescriptionChange(e) {
        this.setState({description: e.target.value});
    }
    onChangeSemesterName(sem){
      this.setState({semester_name: sem.target.value});
    }
    onChangeStartDate(start){
      //alert(start.target.value);
      this.setState({start_date: start.target.value});
    }
    onChangeEndDate(end){
      this.setState({end_date: end.target.value});
    }

    onSemesterChange(semesterId) {
      //alert(semesterId.value);
        if (semesterId.value == "create") {   // If it's the "create semester" option...
            // Change state to show a "create semester" modal but don't actually change the dropdown selection
            this.setState({semesterId: semesterId.value, showCreateSemesterModal: true});
        }
        else {                          // Otherwise change the dropdown selection as expected
            this.setState({showCreateSemesterModal:false,semesterId: semesterId.value});
        }
    }

    /*closeModal() {
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
*/
    /*submitCreateSemester() {
        /*if (this.submitCreateSemesterValidation() === false) {
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
    }*/

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
              <div>
                        <label>Semester Name</label>
                        <div>
                            <input
                              type="text"
                              value={this.state.semester_name}
                              onChange={this.onChangeSemesterName.bind(this)}
                              />
                        </div>
                        <label>Start Date</label>
                        <div>
                            <input
                              type="date"
                              value={this.state.start_date}
                              onChange={this.onChangeStartDate.bind(this)}
                              />
                        </div>
                        <label>End Date</label>
                        <div className="col-sm-10">
                            <input
                              type="date"
                              value={this.state.end_date}
                              onChange={this.onChangeEndDate.bind(this)}/>
                        </div>
            </div>
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
                <h2 className="title">Create Section: {this.props.courseAbb}-{this.props.courseNumber} ({this.props.courseName}) </h2>
                <div className="section-content">
                    <label>Section Identifier</label>
                    <div>
                        <input type="text" value={this.state.name} onChange={this.onNameChange.bind(this)} className={ this.state.sectionNameError ? 'error' : '' }></input>
                    </div>
                    <label>Semester</label>
                    <Select options={semestersList} value={this.state.semesterId} onChange={this.onSemesterChange.bind(this)} className={ this.state.semesterError ? 'error' : '' } />
                    { createSemesterModal }
                    <label>Add Participants</label>
                    <div>{members}</div>
                    <button type="submit" onClick={this.createSection.bind(this)}>{this.props.section.name ? 'Update Section' : 'Create Section'}</button>
                </div>
            </div>
        );
    }
}

/*<label>Section Description</label>
<div>
    <textarea value={this.state.description} onChange={this.onDescriptionChange.bind(this)}></textarea>
</div>*/

CourseSection.defaultProps = {
    section: {}
};

export default CourseSection;
