import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

// This component renders all of an assigment's workflow activities (ie problem types),
// each of which is represented as a WorkflowComponent.
const AssignmentComponent = ({
    currentUserID,
    hasInstructorPrivilege,
    showAnonymousVersion,
    Assignment,
    Filters,
    Strings,
    onReplaceUserInTaskButtonClick,
    onMoreInformationButtonClick,
    showCheckboxes,
    onCheckboxClick,
    selectedWorkflowIDs,
    onBypassTaskButtonClick,
    onCancelTaskButtonClick,
    onRestartTaskButtonClick
}) => {
    const workflowsArray = Object.keys(Assignment)
        .filter(workflowActivityID => Filters.ProblemType == null || Filters.ProblemType.value == workflowActivityID)
        .map(workflowActivityID => (
            <WorkflowComponent
                WorkflowInstances={Assignment[workflowActivityID].WorkflowInstances}
                Structure={Assignment[workflowActivityID].Structure}
                WorkflowActivityName={Assignment[workflowActivityID].Name}
                WA_ID={workflowActivityID}
                key={workflowActivityID}
                Filters={Filters}
                Strings={Strings}
                onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
                onMoreInformationButtonClick={onMoreInformationButtonClick}
                showCheckboxes={showCheckboxes}
                onCheckboxClick={onCheckboxClick}
                selectedWorkflowIDs={selectedWorkflowIDs}
                currentUserID={currentUserID}
                hasInstructorPrivilege={hasInstructorPrivilege}
                showAnonymousVersion={showAnonymousVersion}
                onBypassTaskButtonClick={onBypassTaskButtonClick}
                onCancelTaskButtonClick={onCancelTaskButtonClick}
                onRestartTaskButtonClick={onRestartTaskButtonClick}
            />
    ));

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
