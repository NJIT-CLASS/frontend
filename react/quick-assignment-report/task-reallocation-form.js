import React, { Component } from 'react';
import Modal from '../shared/modal';
import { RadioGroup, Radio } from 'react-radio-group';
import apiCall from '../shared/apiCall';
import FallbackReplacementSection from './fallback-replacement-section';
import ReplacementPoolsSection from './replacement-pools-section';
import ExtraCreditSection from './extra-credit-section';

// This component renders the form for removing and replacing users in a single task or 
// an entire workflow (ie problem thread).
class TaskReallocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        const currentlyAssignedUserID = this.props.taskInstance.User.UserID;

        // These new properties added to each user will allow for keeping track
        // of which user will be removed, and which users have been selected to be 
        // a candidate replacement for the removed user. The user to be removed is
        // the user currently assigned to the task in question.
        const users = this.props.sectionInfo.users
            .map(user => ({
                ...user,
                selectedAsReplacement: false,
                selectedForRemoval: user.id === currentlyAssignedUserID
            }));

        // The fallback replacement is the user who will be the replacement if all other candidate replacements
        // don't satisfy the problem's constraints. By default, this user is an instructor.
        const defaultFallbackID = users.find(user => user.role === 'Instructor').id;

        // The user assigned to the task in question will be removed, so they cannot also be the fallback 
        // replacement. The user using this form will have to specify a new fallback replacement.
        const mustSpecifyFallback = defaultFallbackID === currentlyAssignedUserID;

        return {
            users: users,

            extraCredit: true, // the replacement user will receive extra credit by default

            // 'ti' means "task instance," ie the user will be replaced only in this task instance by default.
            // Can also be "wi" for "workflow instance," ie the user will be replaced in the whole problem thread.
            // Don't rename these values -- they're used by the backend API.
            replaceUserIn: 'ti',

            fallbackID: defaultFallbackID,

            // Indicates whether or not the user using the form has chosen to use the default fallback replacement
            useDefaultFallback: true,

            // Indicates whether or not the instrutor using the form MUST manually specify the fallback replacement
            // (due to the current fallback replacement being invalid).
            // This property overrides useDefaultFallback if set to true.
            mustSpecifyFallback: mustSpecifyFallback,

            // Indicates the ordering of the replacement user pools and whether or not each one should be used.
            replacementPools: [
                {
                    id: 'volunteers',
                    displayName: 'Volunteer pool',
                    enabled: true
                },
                {
                    id: 'students',
                    displayName: 'All active students',
                    enabled: true
                },
                {
                    id: 'specific',
                    displayName: 'Specific users',
                    enabled: false
                }
            ],

            showConfirmationPopup: false
        };
    }

    handleSubmit() {
        this.setState({ showConfirmationPopup: true });
    }

    buildReplacementPoolsList() {
        // Builds a list containing each replacement user pool
        // (active students, volunteers, and specifically selected students).

        const activeStudentIDs = this.state.users
            .filter(user => user.active && user.role === 'Student')
            .map(user => user.id);

        const volunteerIDs = this.props.sectionInfo.volunteerIDs;

        // The IDs of the users who were specifically selected by the user using the form
        // to be candidate replacements.
        const specificReplacementUserIDs = this.state.users
            .filter(user => user.selectedAsReplacement && user.active)
            .map(user => user.id);

        const poolsList = this.state.replacementPools
            .filter(item => item.enabled)
            .map(item => {
                switch (item.id) {
                case 'volunteers':
                    return volunteerIDs;
                case 'specific':
                    return specificReplacementUserIDs;
                case 'students':
                    return activeStudentIDs;
                }
            });

        return poolsList;
    }

    doReplace() {
        // Calls the backend API for replacing a user in a task or problem thread.
        // See the 'Automatically reallocate new user to this task instance' section of the 
        // 'Pool and Reallocation APIs' document for information about this API call
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)

        const currentlyAssignedUserID = this.props.taskInstance.User.UserID;
        if (this.state.fallbackID === currentlyAssignedUserID) {
            showMessage('Error: Cannot remove the fallback replacement user. Select a different fallback.');
            return;
        }

        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const postBody = {
            taskarray: [this.state.replaceUserIn, [taskInstanceID]],
            is_extra_credit: this.state.extraCredit,
            user_pool_wc: this.buildReplacementPoolsList(),
            user_pool_woc: [this.state.fallbackID]
        };

        const url = '/reallocate/task_based/';
        showMessage('Replacing the user...');
        apiCall.postAsync(url, postBody).then(() => {
            this.props.onUserReplaced();
            showMessage('User successfully replaced');
        });
        this.props.onClose();
    }

    confirmationPopup() {
        const title = 'Are you sure you want to replace this user?';
        const okLabel = 'Replace this user';
        const cancelLabel = 'Don\'t replace this user';

        const taskInstance = this.props.taskInstance;
        const taskName = taskInstance.TaskActivity.DisplayName;
        const currentlyAssignedUserID = taskInstance.User.UserID;
        const firstName = taskInstance.User.FirstName;
        const lastName = taskInstance.User.LastName;

        const user = `${firstName} ${lastName} (ID: ${currentlyAssignedUserID})`;
        let message = null;
        if (this.state.replaceUserIn === 'ti') {
            message = (
                <span>
                    User {user} will be replaced in task '{taskName}'.
                </span>
            ); 
        } else {
            message = (
                <span>
                    User {user} will be replaced in task '{taskName}' and the rest of the problem thread.
                </span>
            );
        }

        return (
            <Modal
                close={() => this.setState({ showConfirmationPopup: false })}
                title={title}
                styles={{ marginTop: '60px' }} // clear room so that the title of the form underneath can still be seen
            >
                <div id="modal-text">{message}</div>
                <div id="modal-footer">
                    <button
                        className="button"
                        id="cancel-button"
                        onClick={() => this.setState({ showConfirmationPopup: false })}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="button"
                        id="confirm-button"
                        onClick={() => this.doReplace()}
                    >
                        {okLabel}
                    </button>
                </div>
            </Modal>
        );
    }

    render() {
        const replaceUserInSection = (
            <div>
                <p>Replace this user:</p>
                <RadioGroup
                    selectedValue={this.state.replaceUserIn}
                    onChange={replaceUserIn => this.setState({ replaceUserIn })}
                >
                    <label>
                        <Radio value="ti" />
                        In this task only
                    </label>
                    <br />
                    <label>
                        <Radio value="wi" />In the entire problem thread
                    </label>
                </RadioGroup>
            </div>
        );

        const extraCreditSection = (
            <ExtraCreditSection
                extraCredit={this.state.extraCredit}
                onChange={extraCredit => this.setState({ extraCredit })}
            />
        );

        const replacementPoolsSection = (
            <ReplacementPoolsSection
                replacementPools={this.state.replacementPools}
                users={this.state.users}
                onUsersChange={users => this.setState({ users })}
                onPoolChange={replacementPools =>
                    this.setState({ replacementPools })
                }
            />
        );

        const fallbackReplacementSection = (
            <FallbackReplacementSection
                useDefaultFallback={this.state.useDefaultFallback}
                fallbackID={this.state.fallbackID}
                mustSpecifyFallback={this.state.mustSpecifyFallback}
                onFallbackChange={fallbackID => this.setState({ fallbackID })}
                onUseDefaultFallbackChange={useDefaultFallback =>
                    this.setState({ useDefaultFallback })
                }
                users={this.state.users}
            />
        );

        const buttons = (
            <div>
                <button type="button" onClick={() => this.handleSubmit()}>
                    Replace User
                </button>
                <button type="button" onClick={this.props.onClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => this.setState(this.getDefaultState())}
                >
                    Reset Form
                </button>
            </div>
        );

        const taskInstance = this.props.taskInstance;
        const taskName = taskInstance.TaskActivity.DisplayName;
        const currentlyAssignedUserID = taskInstance.User.UserID;
        const currentlyAssignedUserEmail = taskInstance.User.UserContact.Email;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            Replace this user <br />
                            <div style={{ fontSize: 'smaller', marginTop: '5px' }}>
                                {`User: ${currentlyAssignedUserEmail} (UserID: ${currentlyAssignedUserID})`}
                                <br />
                                {`Task: ${taskName}`} <br />
                            </div>
                        </div>
                    }
                    close={this.props.onClose}
                    width={'680px'}
                >
                    {replaceUserInSection}
                    <hr />
                    {extraCreditSection}
                    <hr />
                    {replacementPoolsSection}
                    <hr />
                    {fallbackReplacementSection}
                    <br />
                    {buttons}
                </Modal>
                {this.state.showConfirmationPopup
                    ? this.confirmationPopup()
                    : null}
            </div>
        );
    }
}

export default TaskReallocationForm;
