import React, { Component } from 'react';
import Modal from '../shared/modal';
import { RadioGroup, Radio } from 'react-radio-group';
import apiCall from '../shared/apiCall';
import FallbackReplacementSection from './fallback-replacement-section';
import ReplacementPoolsSection from './replacement-pools-section';
import ExtraCreditSection from './extra-credit-section';
import UserList from './user-list';
import CollapsableBlock from './collapsable-block';
import { cloneDeep } from 'lodash';

class AssignmentReallocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        const users = this.props.sectionInfo.users
            .map(user => ({
                ...user,
                selectedAsReplacement: false,
                selectedForRemoval: false
            }));
        const defaultFallbackID = users.find(
            user => user.role === 'Instructor'
        ).id;

        return {
            users: users,
            extraCredit: true,
            useDefaultFallback: true,
            fallbackID: defaultFallbackID,
            mustSpecifyFallback: false,
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
            showConfirmationPopup: false,
            removeUsersFromOngoingAssignments: false,
            makeRemovedUsersInactiveIn: 'no_assignments'
        };
    }

    buildReplacementPoolsList() {
        const activeStudentIDs = this.state.users
            .filter(user => user.active && user.role === 'Student')
            .map(activeStudent => activeStudent.id);

        const volunteerIDs = this.props.sectionInfo.volunteerIDs;

        const specificReplacementUserIDs = this.state.users
            .filter(user => user.selectedAsReplacement && user.active)
            .map(user => user.id);

        const poolsList = this.state.replacementPools
            .filter(pool => pool.enabled)
            .map(pool => {
                switch (pool.id) {
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
        if (this.state.users.some(
                user => user.selectedForRemoval && user.id === this.state.fallbackID)
        ) {
            showMessage(
                'Error: Cannot remove the fallback replacement user. Select a different fallback.'
            );
            return;
        }

        const removals = this.state.users
            .filter(user => user.selectedForRemoval)
            .map(user => user.id);

        const postBody = {
            old_user_ids: removals,
            sec_id: this.props.sectionInfo.sectionID,
            ai_ids: [this.props.AssignmentID],
            is_extra_credit: this.state.extraCredit,
            user_pool_wc: this.buildReplacementPoolsList(),
            user_pool_woc: [this.state.fallbackID],
            inactivate_users: this.state.makeRemovedUsersInactiveIn,
            remove_from_all_assignments: this.state.removeUsersFromOngoingAssignments
        };

        const url = '/reallocate/user_based/';
        apiCall.postAsync(url, postBody).then(() => this.props.onUserReplaced());
        showMessage('Users successfully replaced');
        this.props.onClose();
    }

    confirmationPopup() {
        const title = 'Are you sure you want to replace these users?';
        const okLabel = 'Replace these users';
        const cancelLabel = 'Don\'t replace these users';

        const removals = this.state.users.filter(
            user => user.selectedForRemoval
        );
        const removalsList =
            removals.length > 0 ? (
                <ul>
                    {removals.map(user => (
                        <li>
                            {`${user.email} (ID: ${
                                user.id
                            })`}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No users selected for removal</div>
            );

        const howToReplace = this.state.removeUsersFromOngoingAssignments
            ? ' in all ongoing and future assignments'
            : ' in this assignment';

        const replaceMessage = (
            <div
            >{`The following users will be removed and replaced${howToReplace}:`}</div>
        );

        let inactiveMessage = null;
        switch (this.state.makeRemovedUsersInactiveIn) {
        case 'this_assignment':
            inactiveMessage = (
                <div>
                        The removed users will also be made inactive in this
                        assignment
                </div>
            );
            break;
        case 'all_assignments':
            inactiveMessage = (
                <div>
                        The removed users will also be made inactive in all
                        ongoing and future assignments
                </div>
            );
            break;
        }

        return (
            <Modal
                close={() => this.setState({ showConfirmationPopup: false })}
                title={title}
                styles={{ marginTop: '65px' }}
            >
                <div id="modal-text">
                    {replaceMessage}
                    {removalsList}
                    {inactiveMessage}
                </div>
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

    userRemovalsSection() {
        const handleUserSelectionChange = changedUserID => {
            const users = cloneDeep(this.state.users);
            const changedUser = users.find(user => user.id === changedUserID);
            changedUser.selectedForRemoval = !changedUser.selectedForRemoval;
            const mustSpecifyFallback = users.find(
                user => user.id === this.state.fallbackID
            ).selectedForRemoval;
            this.setState({ users, mustSpecifyFallback });
        };

        return (
            <div>
                <p> Choose users to remove below: </p>
                <UserList
                    users={this.state.users.filter(user => user.active)}
                    onSelectionChange={handleUserSelectionChange}
                    isSelected={user => user.selectedForRemoval}
                    isDisabled={user => user.selectedAsReplacement}
                    selectType="checkbox"
                />
            </div>
        );
    }

    makeRemovedUsersInactiveSection() {
        const assignmentName = this.props.sectionInfo.assignmentName;
        return (
            <div>
                <p>Make the removed users inactive:</p>
                <RadioGroup
                    selectedValue={this.state.makeRemovedUsersInactiveIn}
                    onChange={makeRemovedUsersInactiveIn =>
                        this.setState({ makeRemovedUsersInactiveIn })
                    }
                >
                    <label>
                        <Radio value="this_assignment" />In this assignment only
                    </label>
                    <br />
                    <label>
                        <Radio value="all_assignments" />In all ongoing and
                        future assignments
                    </label>
                    <br />
                    <label>
                        <Radio value="no_assignments" />Do not make the removed
                        users inactive
                    </label>
                </RadioGroup>
            </div>
        );
    }

    removeFromOngoingAssignmentsSection() {
        const assignmentName = this.props.sectionInfo.assignmentName;
        return (
            <div>
                <p> Remove the selected users: </p>
                <RadioGroup
                    selectedValue={this.state.removeUsersFromOngoingAssignments}
                    onChange={removeUsersFromOngoingAssignments =>
                        this.setState({ removeUsersFromOngoingAssignments })
                    }
                >
                    <label>
                        <Radio value={false} />
                        From this assignment only
                    </label>
                    <br />
                    <label>
                        <Radio value={true} /> From all ongoing assignments
                    </label>
                </RadioGroup>
            </div>
        );
    }

    render() {
        const userRemovalsSection = this.userRemovalsSection();
        const makeInactiveSection = this.makeRemovedUsersInactiveSection();
        const removeFromOngoingAssignmentsSection = this.removeFromOngoingAssignmentsSection();

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
                <button
                    type="button"
                    onClick={() =>
                        this.setState({ showConfirmationPopup: true })
                    }
                >
                    Replace Users
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

        const assignmentName = this.props.sectionInfo.assignmentName;
        const courseName = this.props.sectionInfo.courseName;
        const sectionName = this.props.sectionInfo.sectionName;
        const semesterName = this.props.sectionInfo.semesterName;
        return (
            <div>
                <Modal
                    title={
                        <div>
                            Remove and replace users in this assignment <br />
                            <div
                                style={{
                                    fontSize: 'smaller',
                                    marginTop: '5px'
                                }}
                            >
                                {assignmentName} <br />
                                {`${courseName}, ${sectionName}, ${semesterName}`}
                            </div>
                        </div>
                    }
                    close={this.props.onClose}
                    width={'680px'}
                >
                    <CollapsableBlock Title="Select Users to Remove">
                        {removeFromOngoingAssignmentsSection}
                        <hr />
                        {makeInactiveSection}
                        <hr />
                        {userRemovalsSection}
                    </CollapsableBlock>

                    <CollapsableBlock Title="Select Replacement Users">
                        {extraCreditSection}
                        <hr />
                        {replacementPoolsSection}
                        <hr />
                        {fallbackReplacementSection}
                    </CollapsableBlock>
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

export default AssignmentReallocationForm;
