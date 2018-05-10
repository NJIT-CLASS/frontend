import React, { Component } from 'react';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';
import LegendSection from './legendSection';
import strings from './strings';
import apiCall from '../shared/apiCall';
import {flatten, uniqBy, flatMap, sortBy} from 'lodash';
import ReallocationModal from './reallocation-modal';
import TaskReallocationForm from './task-reallocation-form';
import AssignmentReallocationForm from './assignment-reallocation-form';
import MoreInformation from './more-information';
import RemoveWorkflow from './remove-workflow';
import BypassTask from './bypass-task';
import CancelTask from './cancel-task';
import RestartTask from './restart-task';
import ToggleSwitch from '../shared/toggleSwitch';

class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            Filters: {
                Type: [],
                Status: [],
                Users: [],
                WorkflowID: ''
            },
            Strings: strings,
            AssignmentDataLoaded: false,
            sectionInfo: null,
            taskActivities: [],
            sectionInfoLoaded: false,
            showAssignmentReallocationForm: false,
            showTaskReallocationForm: false,
            showMoreInformation: false,
            // when workflowCancellationMode is true, select boxes appear next to
            // each workflow instance, the workflow cancellation  buttons show, and 
            // the 'replace in assignment' button is hidden
            workflowCancellationMode: false,
            selectedWorkflowIDs: new Set(),
            showRemoveWorkflowConfirmation: false,
            showBypassTaskConfirmation: false,
            showCancelTaskConfirmation: false,
            showRestartTaskConfirmation: false,
            showAnonymousVersion: false,
        };

        this.changeFilterType = this.changeFilterType.bind(this);
        this.changeFilterWorkflowID = this.changeFilterWorkflowID.bind(this);
        this.changeFilterStatus = this.changeFilterStatus.bind(this);
        this.changeFilterUsers = this.changeFilterUsers.bind(this);
    }

    getTaskActivitiesAsync(assignmentID) {
        const assignmentReportURL = `/getAssignmentReport/${assignmentID}`;
        return apiCall.getAsync(assignmentReportURL)
            .then(response => {
                let taskActivities =
                    flatMap(response.data.Result, workflow =>
                        workflow.map(taskInstance => ({
                            taskActivityDisplayName: taskInstance.TaskActivity.DisplayName,
                            taskActivityID: taskInstance.TaskActivity.TaskActivityID,
                            workflowActivityName: taskInstance.WorkflowInstance.WorkflowActivity.Name,
                            workflowActivityID: taskInstance.WorkflowInstance.WorkflowActivityID
                        })));
                taskActivities = uniqBy(taskActivities, 'taskActivityID');
                return sortBy(taskActivities, ['workflowActivitiyID', 'taskActivityID']);
            });
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
        ).then(flatten);
    }

    async fetchSectionInfo() {
        const {AssignmentID} = this.props;
        const {sectionID, assignmentName} =
            await this.getSectionIdAndAssignmentNameAsync(AssignmentID);
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
            sectionInfoLoaded: true,
        });
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

    

    componentWillMount() {
        this.fetchData();
    }

    changeFilterType(typeArray){
        let newFilters = this.state.Filters;
        newFilters.Type = typeArray.map(t => t.value);
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

    changeFilterUsers(usersArray){
        let newFilters = this.state.Filters;
        newFilters.Users = usersArray.map(user => user.value);
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

    fetchData() {
        this.fetchAssignmentData();
        this.fetchSectionInfo();
    }

    handleWorkflowInstanceSelection(clickedWorkflowID) {
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
        this.fetchData();
    }

    handleBypassTaskButtonClick(clickedTaskInstance) {
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showBypassTaskConfirmation: true });
    }

    handleCancelTaskButtonClick(clickedTaskInstance) {
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showCancelTaskConfirmation: true });
    }

    handleRestartTaskButtonClick(clickedTaskInstance) {
        this.clickedTaskInstance = clickedTaskInstance;
        this.setState({ showRestartTaskConfirmation: true });
    }

    render() {

        if (!this.state.AssignmentDataLoaded) {
            return null;
        }

        let buttons = null;
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
                        onClick={() =>
                            this.setState({
                                showAssignmentReallocationForm: true
                            })
                        }
                        style={{ marginRight: '30px' }}
                    >
                        Remove and replace users in the entire assignment
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            this.setState({
                                workflowCancellationMode: true
                            })
                        }
                    >
                        Remove problem threads
                    </button>
                </div>;
        }

        return (
            <div className="quick-assignment-report">
                {
                    this.props.hasInstructorPrivilege ?
                    <div style={{display: "flex", justifyContent: "space-between", width: "230px"}}>
                        <label style={{marginTop: "5px"}}>
                            Anonymous Version
                        </label>
                        <ToggleSwitch 
                            isClicked={this.state.showAnonymousVersion} 
                            click={() => this.setState(prevState => ({
                                showAnonymousVersion: !prevState.showAnonymousVersion
                                })
                            )} 
                            style={{margin: "0px"}}
                        />
                    </div>
                    : null
                }
                {
                    this.props.hasInstructorPrivilege ?
                        <div>
                            {buttons}
                        </div>
                    : null
                }
                <FilterSection
                    Filters={this.state.Filters}
                    changeFilterStatus={this.changeFilterStatus}
                    changeFilterWorkflowID={this.changeFilterWorkflowID}
                    changeFilterType={this.changeFilterType}
                    changeFilterUsers={this.changeFilterUsers}
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
                        this.handleReplaceUserInTaskButtonClick(
                            clickedTaskInstance
                        )
                    }
                    onMoreInformationButtonClick={clickedTaskInstance =>
                        this.handleMoreInformationButtonClick(
                            clickedTaskInstance
                        )
                    }
                    onBypassTaskButtonClick={clickedTaskInstance => 
                        this.handleBypassTaskButtonClick(clickedTaskInstance)}
                    onCancelTaskButtonClick={clickedTaskInstance => 
                        this.handleCancelTaskButtonClick(clickedTaskInstance)}
                    onRestartTaskButtonClick={clickedTaskInstance => 
                        this.handleRestartTaskButtonClick(clickedTaskInstance)}
                    showCheckboxes={this.state.workflowCancellationMode}
                    onCheckboxClick={clickedWorkflowID =>
                        this.handleWorkflowInstanceSelection(clickedWorkflowID)
                    }
                    selectedWorkflowIDs={Array.from(
                        this.state.selectedWorkflowIDs
                    )}
                />

                {this.state.showTaskReallocationForm &&
                this.state.sectionInfoLoaded ? (
                        <TaskReallocationForm
                            onClose={() => this.setState({showTaskReallocationForm: false})}
                            taskInstance={this.taskInstanceToReallocate}
                            sectionInfo={this.state.sectionInfo}
                            onUserReplaced={() => this.fetchData()}
                        />
                    ) : null}

                {this.state.showAssignmentReallocationForm &&
                this.state.sectionInfoLoaded ? (
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
                        onClose={() =>
                            this.setState({ showMoreInformation: false })
                        }
                        taskInstance={this.clickedTaskInstance}
                        sectionInfo={this.state.sectionInfo}
                    />
                ) : null}

                {this.state.showRemoveWorkflowConfirmation ? (
                    <RemoveWorkflow
                        onClose={() =>
                            this.setState({
                                showRemoveWorkflowConfirmation: false
                            })
                        }
                        workflowIDs={Array.from(this.state.selectedWorkflowIDs)}
                        assignmentID={this.props.AssignmentID}
                        onWorkflowCancel={() => this.handleWorkflowCancel()}
                    />
                ) : null}

                {this.state.showBypassTaskConfirmation ? (
                    <BypassTask
                        onClose={() =>
                            this.setState({ showBypassTaskConfirmation: false })
                        }
                        taskInstance={this.clickedTaskInstance}
                        onBypassTask={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showCancelTaskConfirmation ? (
                    <CancelTask
                        onClose={() =>
                            this.setState({ showCancelTaskConfirmation: false })
                        }
                        taskInstance={this.clickedTaskInstance}
                        onCancelTask={() => this.fetchData()}
                    />
                ) : null}

                {this.state.showRestartTaskConfirmation ? (
                    <RestartTask
                        onClose={() =>
                            this.setState({ showCancelTaskConfirmation: false })
                        }
                        taskInstance={this.clickedTaskInstance}
                        onRestartTask={() => this.fetchData()}
                    />
                ) : null}
            </div>
        );
    }
}

export default QuickAssignmentReport;
