import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

const AssignmentComponent = ({Assignment, Filters ,Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick, showCheckboxes, onCheckboxClick, selectedWorkflowIDs,onReallocate}) => {
    const workflowsArray = Object.keys(Assignment).map((key) => {
        return <WorkflowComponent onReallocate={onReallocate}
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
        />;
    });

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
