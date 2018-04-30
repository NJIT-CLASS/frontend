import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

const AssignmentComponent = ({currentUserID, hasInstructorPrivilege, Assignment, Filters ,Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick, showCheckboxes, onCheckboxClick, selectedWorkflowIDs}) => {
    const workflowsArray = Object.keys(Assignment).map((key) => {
        return <WorkflowComponent WorkflowInstances={Assignment[key].WorkflowInstances}
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
        />;
    });

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
