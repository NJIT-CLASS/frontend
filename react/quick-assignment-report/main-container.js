import React, { Component } from 'react';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';
import LegendSection from './legendSection';
import strings from './strings';
import apiCall from '../shared/apiCall';
import {flatten} from 'lodash';
import TaskReallocationForm from './task-reallocation-form';
import AssignmentReallocationForm from './assignment-reallocation-form';
import MoreInformation from './more-information';

class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            Filters: {
                Type: '',
                Status: [''],
                WorkflowID: ''
            },
            Strings: strings,
            AssignmentDataLoaded: false,
            sectionInfo: null,
            sectionInfoLoaded: false,
            showAssignmentReallocationForm: false,
            showTaskReallocationForm: false,
            showMoreInformation: false
        };

        this.changeFilterType = this.changeFilterType.bind(this);
        this.changeFilterWorkflowID = this.changeFilterWorkflowID.bind(this);
        this.changeFilterStatus = this.changeFilterStatus.bind(this);
    }

    getVolunteerIdsAsync(sectionID) {
        const volunteersURL = `/VolunteerPool/VolunteersInSection/${sectionID}`;
        return apiCall.getAsync(volunteersURL)
            .then(response => response.data.Volunteers.map(user => user.UserID));
    }

    getNamesAsync(sectionID) {
        // Get the course name, section name, and semester name of the section
        const sectionInfoURL = `/section/info/${sectionID}`;
        return apiCall.getAsync(sectionInfoURL)
            .then(response => ({
                courseName: response.data.Section.Course.Name,
                sectionName: response.data.Section.Name,
                semesterName: response.data.Section.Semester.Name,
            }));
    }

    getSectionIdAndAssignmentNameAsync(assignmentID) {
        const assignmentRecordURL = `/getAssignmentRecord/${assignmentID}`;
        return apiCall.getAsync(assignmentRecordURL)
            .then(response => ({
                sectionID: response.data.Info.SectionID.SectionID,
                assignmentName: response.data.Info.Assignment.DisplayName,
            }));
    }

    getUsersAsync(sectionID) {
        // Get all of the users in the section (students, instructors, and observers)
        const buildUser = user => ({
            id: user.UserID,
            active: user.Active,
            firstName: user.User.FirstName,
            lastName: user.User.LastName,
            role: user.Role,
            email: user.UserLogin.Email
        });

        const usersURL = `/sectionUsers/${sectionID}/`;
        return Promise.all(['Student', 'Instructor', 'Observer']
            .map(role =>
                apiCall.getAsync(usersURL + role)
                    .then(response => response.data.SectionUsers.map(buildUser))
            )
        ).then(flatten);
    }

    async fetchSectionInfo() {
        const {AssignmentID} = this.props;
        const {sectionID, assignmentName} = await this.getSectionIdAndAssignmentNameAsync(AssignmentID);
        const volunteerIDs = this.getVolunteerIdsAsync(sectionID);
        const names = this.getNamesAsync(sectionID); // courseName, sectionName, and semesterName
        const users = this.getUsersAsync(sectionID);

        const sectionInfo = {
            sectionID,
            assignmentName,
            ...(await names),
            volunteerIDs: await volunteerIDs,
            users: await users,
        };

        this.setState({
            sectionInfo,
            sectionInfoLoaded: true
        });
    }

    fetchAssignmentData() {
        const url = `/getAssignmentReport/alternate/${this.props.AssignmentID}`;

        this.props.__(strings, (newStrings) => {
            apiCall.get(url, (err,res, body) => {
                console.log(body);
                this.setState({
                    AssignmentData: body.Result,
                    Strings: newStrings,
                    AssignmentDataLoaded: true
                });
            });
        });
    }

    componentWillMount() {
        this.fetchAssignmentData();
        this.fetchSectionInfo();
    }

    changeFilterType(val){
        let newFilters = this.state.Filters;
        newFilters.Type = val.value;
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterWorkflowID(val){
        let newFilters = this.state.Filters;
        newFilters.WorkflowID = val.value;
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterStatus(statusArray){
        let newFilters = this.state.Filters;
        newFilters.Status = statusArray.map(t => t.value);
        this.setState({
            Filters: newFilters
        });
    }

    handleReplaceUserInTaskButtonClick(clickedTaskInstance) {
        this.taskInstanceToReallocate = clickedTaskInstance;
        this.setState({ showTaskReallocationForm: true });
    }

    handleMoreInformationButtonClick(clickedTaskInstance) {
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showMoreInformation: true });
    }

    handleUserReplaced() {
        this.fetchAssignmentData();
        this.fetchSectionInfo();
    }

    render() {
        if (!this.state.AssignmentDataLoaded) {
            return null;
        }

        return <div className="quick-assignment-report" >
          <button
              type="button"
              onClick={() => this.setState({showAssignmentReallocationForm: true})}
          >
              {'Remove and replace users in the entire assignment'}
          </button>
          <FilterSection Filters={this.state.Filters} changeFilterStatus={this.changeFilterStatus}
             changeFilterWorkflowID={this.changeFilterWorkflowID} changeFilterType={this.changeFilterType}
             Strings={this.state.Strings}
           />
           <LegendSection Strings={this.state.Strings} />
          <AssignmentComponent Assignment={this.state.AssignmentData}
                               Filters={this.state.Filters}
                               Strings={this.state.Strings}
                               onReplaceUserInTaskButtonClick={clickedTaskInstance => this.handleReplaceUserInTaskButtonClick(clickedTaskInstance)}
                               onMoreInformationButtonClick={clickedTaskInstance => this.handleMoreInformationButtonClick(clickedTaskInstance)}
            />

            {this.state.showTaskReallocationForm &&
                this.state.sectionInfoLoaded ? (
                    <TaskReallocationForm
                        onClose={() => this.setState({showTaskReallocationForm: false})}
                        taskInstance={this.taskInstanceToReallocate}
                        sectionInfo={this.state.sectionInfo}
                        onUserReplaced={() => this.handleUserReplaced()}
                    />
                ) : null}

            {this.state.showAssignmentReallocationForm &&
            this.state.sectionInfoLoaded ? (
                    <AssignmentReallocationForm
                        onClose={() => this.setState({showAssignmentReallocationForm: false})}
                        AssignmentID={this.props.AssignmentID}
                        sectionInfo={this.state.sectionInfo}
                        onUserReplaced={() => this.handleUserReplaced()}
                    />
                ) : null}

            {this.state.showMoreInformation ? (
                <MoreInformation
                    onClose={() => this.setState({showMoreInformation: false})}
                    taskInstance={this.clickedTaskInstance}
                    sectionInfo={this.state.sectionInfo}
                />
            ) : null}


        </div>;
    }

}

export default QuickAssignmentReport;
