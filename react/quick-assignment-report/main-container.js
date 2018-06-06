import React, { Component } from 'react';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';
import LegendSection from './legendSection';
import strings from './strings';
import apiCall from '../shared/apiCall';
import {flatten, uniqBy, flatMap, sortBy} from 'lodash';
import TaskReallocationForm from './task-reallocation-form';
import AssignmentReallocationForm from './assignment-reallocation-form';
import MoreInformation from './more-information';
import RemoveWorkflow from './remove-workflow';
import BypassTask from './bypass-task';
import CancelTask from './cancel-task';
import RestartTask from './restart-task';
import ToggleSwitch from '../shared/toggleSwitch';
import Tooltip from '../shared/tooltip';

class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            AssignmentDataLoaded: false,
            Filters: { ProblemType: null, TaskType: [], Status: [], Users: [] },
            Strings: strings,
            sectionInfo: null,
            sectionInfoLoaded: false,
            taskActivities: [], // List of info for each task activity. Used by the task type filter in the FilterSection component.
            showAssignmentReallocationForm: false,
            showTaskReallocationForm: false,
            showMoreInformation: false,
            // When workflowCancellationMode is true, checkboxes appear next to each 
            // workflow instance so that they can be selected for cancellation, the 
            // hidden workflow cancellation buttons are revealed, and the 'replace in 
            // assignment' button is hidden.
            workflowCancellationMode: false,
            selectedWorkflowIDs: new Set(),
            showRemoveWorkflowConfirmation: false,
            showBypassTaskConfirmation: false,
            showCancelTaskConfirmation: false,
            showRestartTaskConfirmation: false,
            showAnonymousVersion: false
        };

        this.changeFilterTaskType = this.changeFilterTaskType.bind(this);
        this.changeFilterProblemType = this.changeFilterProblemType.bind(this);
        this.changeFilterStatus = this.changeFilterStatus.bind(this);
        this.changeFilterUsers = this.changeFilterUsers.bind(this);
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        this.fetchAssignmentData();
        this.fetchSectionInfo();
    }

    fetchAssignmentData() {
        const url = `/getAssignmentReport/alternate/${this.props.AssignmentID}`;

        this.props.__(strings, (newStrings) => {
            apiCall.get(url, (err,res, body) => {
                this.setState({
                    AssignmentData: body.Result,
                    Strings: newStrings,
                    AssignmentDataLoaded: true
                });
            });
        });

        this.getTaskActivitiesAsync(this.props.AssignmentID)
            .then(taskActivities => this.setState({taskActivities}));
    }

    async fetchSectionInfo() {
        /*
        Fetches all of the following data and combines them into the sectionInfo object:
            Assignment Name: shown at the top of the page.
            Section ID:      needed for the APIs to fetch everything else below.
            Volunteer IDs:   needed for the volunteer pool in the TaskReallocationForm and AssignmentReallocationForm components.
            Course Name:     shown at the top of the page.
            Course Number:   shown at the top of the page.
            Section Name:    shown at the top of the page.
            Semester Name:   shown at the top of the page.
            Users:           needed in many of the child components.
        */
        const {AssignmentID} = this.props;
        const {sectionID, assignmentName} = await this.getSectionIdAndAssignmentNameAsync(AssignmentID);
        const volunteerIDs = this.getVolunteerIdsAsync(sectionID);
        const names = this.getNamesAsync(sectionID); // courseName, courseNumber, sectionName, and semesterName
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
            sectionInfoLoaded: true,
        });
    }

    getTaskActivitiesAsync(assignmentID) {
        const assignmentReportURL = `/getAssignmentReport/${assignmentID}`;
        return apiCall.getAsync(assignmentReportURL)
            .then(response => {
                let taskActivities =
                    flatMap(response.data.Result, (workflow) =>
                        workflow.map(taskInstance => ({
                            taskActivityDisplayName: taskInstance.TaskActivity.DisplayName,
                            taskActivityID: taskInstance.TaskActivity.TaskActivityID,
                            workflowActivityName: taskInstance.WorkflowInstance.WorkflowActivity.Name,
                            workflowActivityID: taskInstance.WorkflowInstance.WorkflowActivityID
                        })));
                taskActivities = uniqBy(taskActivities, 'taskActivityID'); // remove duplicates
                return sortBy(taskActivities, ['workflowActivitiyID', 'taskActivityID']);
            });
    }

    getVolunteerIdsAsync(sectionID) {
        const volunteersURL = `/VolunteerPool/VolunteersInSection/${sectionID}`;
        return apiCall.getAsync(volunteersURL)
            .then(response => response.data.Volunteers.map(user => user.UserID))
            // The API call will fail if the logged in user is a student, in which case return an empty 
            // list. (The volunteers are only needed by instructors/admins anyway, for reallocation.)
            .catch(() => []); 
    }

    getNamesAsync(sectionID) {
        // Get the course name, course number, section name, and semester name of the section
        const sectionInfoURL = `/section/info/${sectionID}`;
        return apiCall.getAsync(sectionInfoURL)
            .then(response => ({
                courseName: response.data.Section.Course.Name,
                courseNumber: response.data.Section.Course.Number,
                sectionName: response.data.Section.Name,
                semesterName: response.data.Section.Semester.Name,
            }));
    }

    getSectionIdAndAssignmentNameAsync(assignmentID) {
        const assignmentRecordURL = `/getAssignmentRecord/${assignmentID}`;
        return apiCall.getAsync(assignmentRecordURL)
            .then(response => ({
                sectionID: response.data.Info.SectionID.SectionID,
                assignmentName: response.data.Info.SectionID.DisplayName
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
        ).then(flatten); // return as a flat list of users rather than a list of lists.
    }


    changeFilterTaskType(taskTypeArray){
        let newFilters = this.state.Filters;
        newFilters.TaskType = taskTypeArray.map(t => t.value);
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterProblemType(problemType){
        let newFilters = this.state.Filters;
        newFilters.ProblemType = problemType;
        // The task type filter should only display tasks that belong to the selected problem type,
        // so since the problem type changed, we must reset the task type filter:
        newFilters.TaskType = [];
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

    changeFilterUsers(usersArray){
        let newFilters = this.state.Filters;
        newFilters.Users = usersArray.map(user => user.value);
        this.setState({
            Filters: newFilters
        });
    }

    handleReplaceUserInTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'replace user' form
        // knows which task to reallocate.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showTaskReallocationForm: true });
    }

    handleMoreInformationButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'more information'
        // modal knows which task to show information about.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showMoreInformation: true });
    }

    handleWorkflowInstanceSelection(clickedWorkflowID) {
        // This is called when the checkbox next to a workflow instance is
        // checked/unchecked. We update the selectedWorkflowIDs accordingly.
        this.setState(prevState => {
            const selectedWorkflowIDs = new Set(prevState.selectedWorkflowIDs);
            if (selectedWorkflowIDs.has(clickedWorkflowID)) {
                selectedWorkflowIDs.delete(clickedWorkflowID);
            } else {
                selectedWorkflowIDs.add(clickedWorkflowID);
            }
            return { selectedWorkflowIDs: selectedWorkflowIDs };
        });
    }

    handleWorkflowCancel() {
        this.setState({
            workflowCancellationMode: false,
            selectedWorkflowIDs: new Set()
        });
        this.fetchData(); // fetch the updated data from the backend
    }

    handleBypassTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'bypass task'
        // confirmation popup knows which task to bypass.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showBypassTaskConfirmation: true });
    }

    handleCancelTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'cancel task'
        // confirmation pop knows which task to cancel.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showCancelTaskConfirmation: true });
    }

    handleRestartTaskButtonClick(clickedTaskInstance) {
        // Store the clicked task instance so that the 'restart task'
        // confirmation popup knows which task to restart.
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showRestartTaskConfirmation: true });
    }

    render() {

        if (!this.state.AssignmentDataLoaded) {
            return null;
        }

        let buttons = null;
        // When in 'workflow cancellation mode,' we show the buttons related to cancelling workflows.
        // Otherwise, we show the button for replacing users in the entire assignment, and the
        // button for removing problem threads (which enables workflow cancellation mode).
        if (this.state.workflowCancellationMode) {
            buttons =
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            this.setState({
                                showRemoveWorkflowConfirmation: true
                            })
                        }
                    >
                        Remove selected problem threads
                        <Tooltip Text={strings.RemoveSelectedProblemThreadsTooltip} ID="replace-in-assignment-tooltip" />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            this.setState({
                                workflowCancellationMode: false
                            })
                        }
                    >
                        Cancel problem thread removals
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            this.setState({
                                selectedWorkflowIDs: new Set()
                            })
                        }
                    >
                        Clear Selections
                    </button>
                </div>;
        } else {
            buttons =
                <div>
                    <button
                        type="button"
                        onClick={() => this.setState({ showAssignmentReallocationForm: true })}
                        style={{ marginRight: '30px' }}
                    >
                        Remove and replace users in the entire assignment
                        <Tooltip Text={strings.ReplaceInAssignmentTooltip} ID="replace-in-assignment-tooltip" />
                    </button>
                    <button
                        type="button"
                        onClick={() => this.setState({ workflowCancellationMode: true })}
                    >
                        Remove problem threads
                        <Tooltip Text={strings.RemoveProblemThreadsTooltip} ID="remove-problem-threads-tooltip" />
                    </button>
                </div>;
        }

        return (
            <div className="quick-assignment-report">
                {this.state.sectionInfoLoaded?
                    (<div className="details">
                        {`${this.state.sectionInfo.courseNumber} - 
                          ${this.state.sectionInfo.courseName} - 
                          ${this.state.sectionInfo.sectionName} - 
                          ${this.state.sectionInfo.semesterName} - 
                          ${this.state.sectionInfo.assignmentName}`}
                    </div>)
                :null}

                {this.props.hasInstructorPrivilege ? // Only instructors/admins should see the anonymous mode switch
                    <div style={{display: "flex", justifyContent: "space-between", width: "230px"}}>
                        <label style={{marginTop: "5px"}}>
                            Anonymous Version
                        </label>
                        <ToggleSwitch
                            isClicked={this.state.showAnonymousVersion}
                            click={() => this.setState(prevState => ({
                                showAnonymousVersion: !prevState.showAnonymousVersion
                            }))}
                        />
                    </div>
                : null}

                {this.props.hasInstructorPrivilege ? // Only instructors/admins should see the buttons
                    <div>
                        {buttons}
                    </div>
                : null}

                <FilterSection
                    Filters={this.state.Filters}
                    onChangeFilterProblemType={this.changeFilterProblemType}
                    onChangeFilterStatus={this.changeFilterStatus}
                    onChangeFilterTaskType={this.changeFilterTaskType}
                    onChangeFilterUsers={this.changeFilterUsers}
                    Strings={this.state.Strings}
                    users={this.state.sectionInfoLoaded ? this.state.sectionInfo.users : []}
                    taskActivities={this.state.taskActivities}
                    hasInstructorPrivilege={this.props.hasInstructorPrivilege}
                    showAnonymousVersion={this.state.showAnonymousVersion}
                />

                <LegendSection Strings={this.state.Strings} />

                <AssignmentComponent
                    hasInstructorPrivilege={this.props.hasInstructorPrivilege}
                    showAnonymousVersion={this.state.showAnonymousVersion}
                    currentUserID={parseInt(this.props.UserID)}
                    Assignment={this.state.AssignmentData}
                    Filters={this.state.Filters}
                    Strings={this.state.Strings}
                    onReplaceUserInTaskButtonClick={clickedTaskInstance =>
                        this.handleReplaceUserInTaskButtonClick(clickedTaskInstance)
                    }
                    onMoreInformationButtonClick={clickedTaskInstance =>
                        this.handleMoreInformationButtonClick(clickedTaskInstance)
                    }
                    onBypassTaskButtonClick={clickedTaskInstance =>
                        this.handleBypassTaskButtonClick(clickedTaskInstance)
                    }
                    onCancelTaskButtonClick={clickedTaskInstance =>
                        this.handleCancelTaskButtonClick(clickedTaskInstance)
                    }
                    onRestartTaskButtonClick={clickedTaskInstance =>
                        this.handleRestartTaskButtonClick(clickedTaskInstance)
                    }
                    onCheckboxClick={clickedWorkflowID =>
                        this.handleWorkflowInstanceSelection(clickedWorkflowID)
                    }
                    showCheckboxes={this.state.workflowCancellationMode}
                    selectedWorkflowIDs={Array.from(this.state.selectedWorkflowIDs)}
                />

                {this.state.showTaskReallocationForm && this.state.sectionInfoLoaded ? (
                    <TaskReallocationForm
                    onClose={() => this.setState({showTaskReallocationForm: false})}
                    taskInstance={this.clickedTaskInstance}
                    sectionInfo={this.state.sectionInfo}
                    onUserReplaced={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showAssignmentReallocationForm && this.state.sectionInfoLoaded ? (
                    <AssignmentReallocationForm
                        onClose={() =>
                            this.setState({
                                showAssignmentReallocationForm: false
                            })
                        }
                        AssignmentID={this.props.AssignmentID}
                        sectionInfo={this.state.sectionInfo}
                        onUserReplaced={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showMoreInformation ? (
                    <MoreInformation
                        onClose={() => this.setState({ showMoreInformation: false })}
                        taskInstance={this.clickedTaskInstance}
                        sectionInfo={this.state.sectionInfo}
                    />
                ) : null}

                {this.state.showRemoveWorkflowConfirmation ? (
                    <RemoveWorkflow
                        onClose={() => this.setState({ showRemoveWorkflowConfirmation: false })}
                        workflowIDs={Array.from(this.state.selectedWorkflowIDs)}
                        assignmentID={this.props.AssignmentID}
                        onWorkflowCancel={() => this.handleWorkflowCancel()}
                    />
                ) : null}

                {this.state.showBypassTaskConfirmation ? (
                    <BypassTask
                        onClose={() => this.setState({ showBypassTaskConfirmation: false })}
                        taskInstance={this.clickedTaskInstance}
                        onBypassTask={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showCancelTaskConfirmation ? (
                    <CancelTask
                        onClose={() => this.setState({ showCancelTaskConfirmation: false })}
                        taskInstance={this.clickedTaskInstance}
                        onCancelTask={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showRestartTaskConfirmation ? (
                    <RestartTask
                        onClose={() => this.setState({ showRestartTaskConfirmation: false })}
                        taskInstance={this.clickedTaskInstance}
                        onRestartTask={() => this.fetchData()}
                    />
                ) : null}
            </div>
        );
    }
}

export default QuickAssignmentReport;
