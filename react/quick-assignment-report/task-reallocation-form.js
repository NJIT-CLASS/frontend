import React, { Component } from 'react';
import Modal from '../shared/modal';
import { RadioGroup, Radio } from 'react-radio-group';
import apiCall from '../shared/apiCall';
import FallbackReplacementSection from './fallback-replacement-section';
import ReplacementPoolsSection from './replacement-pools-section';
import ExtraCreditSection from './extra-credit-section';

class TaskReallocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        const currentlyAssignedUserID = this.props.taskInstance.User.UserID;
        const defaultFallbackID = this.props.users.find(
            user => user.role === 'Instructor'
        ).id;
        const mustSpecifyFallback =
            defaultFallbackID === currentlyAssignedUserID;
        const users = this.props.users.map(user => ({
            ...user,
            selectedAsReplacement: false,
            selectedForRemoval: false
        }));
        users.find(
            user => user.id === currentlyAssignedUserID
        ).selectedForRemoval = true;

        return {
            users: users,
            extraCredit: true,
            replaceUserIn: 'ti', // 'ti means "task instance." Can also be "wi" for "workflow instance."'
            useDefaultFallback: true,
            fallbackID: defaultFallbackID,
            mustSpecifyFallback: mustSpecifyFallback,
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
        const activeStudentIDs = this.state.users
            .filter(user => user.active && user.role === 'Student')
            .map(user => user.id);

        const volunteerIDs = this.props.volunteerIDs;

        const specificIDs = this.state.users
            .filter(user => user.selectedAsReplacement && user.active)
            .map(user => user.id);

        const poolsList = this.state.replacementPools
            .filter(item => item.enabled)
            .map(item => {
                switch (item.id) {
                case 'volunteers':
                    return volunteerIDs;
                case 'specific':
                    return specificIDs;
                case 'students':
                    return activeStudentIDs;
                }
            });

        return poolsList;
    }

    doReplace() {
        const currentUserID = this.props.taskInstance.User.UserID;
        if (this.state.fallbackID === currentUserID) {
            showMessage(
                'Error: Cannot remove the fallback replacement user. Select a different fallback.'
            );
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
        apiCall.postAsync(url, postBody).then(() => this.props.onUserReplaced());
        showMessage('User successfully replaced');
        this.props.onClose();
    }

    confirmationPopup() {
        const title = 'Are you sure you want to replace this user?';
        const okLabel = 'Replace this user';
        const cancelLabel = 'Don\'t replace this user';

        const taskInstance = this.props.taskInstance;
        const task = taskInstance.TaskActivity.Type;
        const currentUserID = taskInstance.User.UserID;
        const firstName = taskInstance.User.FirstName;
        const lastName = taskInstance.User.LastName;

        const user = `${firstName} ${lastName} (ID: ${currentUserID})`;
        const message =
            this.state.replaceUserIn === 'ti' ? (
                <span>
                    User {user} will be replaced in task '{task}'.
                </span>
            ) : (
                <span>
                    User {user} will be replaced in task '{task}' and the rest of
                    the problem thread.
                </span>
            );

        return (
            <Modal
                close={() => this.setState({ showConfirmationPopup: false })}
                title={title}
                styles={{ marginTop: '50px' }}
            >
                <div id="modal-text">{message}</div>
                <div id="modal-footer">
                    <button
                        className="button"
                        id="cancel-button"
                        onClick={() =>
                            this.setState({ showConfirmationPopup: false })
                        }
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
        const taskInstance = this.props.taskInstance;
        const task = taskInstance.TaskActivity.Type;

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

        const currentUserID = taskInstance.User.UserID;
        const currentUserEmail = taskInstance.User.UserContact.Email;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            Replace this user <br />
                            <div
                                style={{
                                    fontSize: 'smaller',
                                    marginTop: '5px'
                                }}
                            >
                                {`User: ${currentUserEmail} (UserID: ${currentUserID})`}
                                <br />
                                {`Task: ${task}`} <br />
                            </div>
                        </div>
                    }
                    close={this.props.onClose}
                    width={'680px'}
                >
                    {replaceUserInSection}
                    <br /> <hr /> <br />
                    {extraCreditSection}
                    <br /> <hr /> <br />
                    {replacementPoolsSection}
                    <br /> <hr /> <br />
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
