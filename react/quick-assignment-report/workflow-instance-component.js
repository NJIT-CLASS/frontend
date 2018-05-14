import React, { Component } from 'react';
import TaskComponent from './task-component';
import Checkbox from '../shared/checkbox';
import Tooltip from '../shared/tooltip';

// This component renders a workflow instance.
// It contains all of the workflow instance's task activities (each represented as a TaskComponent).
const WorkflowInstanceComponent = ({
    currentUserID,
    hasInstructorPrivilege,
    showAnonymousVersion,
    Workflow,
    Structure,
    WI_ID,
    WA_ID,
    Filters,
    Strings,
    onReplaceUserInTaskButtonClick,
    onMoreInformationButtonClick,
    showCheckboxes,
    onCheckboxClick,
    selectedWorkflowIDs,
    onBypassTaskButtonClick,
    onCancelTaskButtonClick,
    onRestartTaskButtonClick,
    index
}) => {
    let taskActivitiesArray = Object.keys(Workflow)
        .map(taskActivityID => (
            <TaskComponent
                TaskActivity={Workflow[taskActivityID]}
                TA_ID={taskActivityID}
                WI_ID={WI_ID}
                WA_ID={WA_ID}
                key={`${WA_ID}-${WI_ID}-${taskActivityID}`}
                Filters={Filters}
                Strings={Strings}
                onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
                onMoreInformationButtonClick={onMoreInformationButtonClick}
                hasInstructorPrivilege={hasInstructorPrivilege}
                showAnonymousVersion={showAnonymousVersion}
                currentUserID={currentUserID}
                onBypassTaskButtonClick={onBypassTaskButtonClick}
                onCancelTaskButtonClick={onCancelTaskButtonClick}
                onRestartTaskButtonClick={onRestartTaskButtonClick}
            />
        ));

    return (
        <div className="workflow-block">
            {showCheckboxes ? ( 
                /* Checkboxes for selecting workflows to cancel are shown next to the workflow instance.*/
                <Checkbox
                    isClicked={selectedWorkflowIDs.includes(WI_ID)}
                    click={() => onCheckboxClick(WI_ID)}
                />
            ) : null}
            <div className="workflow-instance-label">
                {/* This shows the workflow instance ID next to the workflow instance.
                 An explanatory tooltip is shown next to only the first workflow instance 
                 (the one with index 0). */}
                {WI_ID} {index === 0 ? <Tooltip Text={Strings.WorkflowInstanceTooltip} ID={WA_ID} /> : null}
            </div>
            <div className="workflow-instance">
                {taskActivitiesArray}
                <br />
                <br />
            </div>
        </div>
    );
    return null;
};

export default WorkflowInstanceComponent;
