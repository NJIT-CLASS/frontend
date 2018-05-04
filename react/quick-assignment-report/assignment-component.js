import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

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
    const workflowsArray = Object.keys(Assignment).map(key => {
        return (
            <WorkflowComponent
                WorkflowInstances={Assignment[key].WorkflowInstances}
                WorkflowStructure={Assignment[key].Structure}
                WA_ID={key}
                key={key}
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
        );
    });

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
