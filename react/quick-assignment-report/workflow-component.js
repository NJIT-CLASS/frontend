import React, { Component } from 'react';
import WorkflowInstanceComponent from './workflow-instance-component';
import Tooltip from '../shared/tooltip';

// This component renders a workflow activity (ie a problem type).
// It contains all of the workflow activity's workflow instances (ie problem threads), each
// represented as a WorkflowInstanceComponent.
const WorkflowComponent = ({
    hasInstructorPrivilege,
    showAnonymousVersion,
    currentUserID,
    WorkflowInstances,
    Structure,
    WorkflowActivityName,
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
    onRestartTaskButtonClick
}) => {
    const workflowInstancesArray = Object.keys(WorkflowInstances)
        .filter(workflowInstanceID => {
            // We only show workflow instances that contain at least one task belonging to the current user
            // (unless the user has instructor privileges -- then they are allowed to see everything)
            if (hasInstructorPrivilege) {
                return true;
            }
            for (const [taskActivityID, taskActivity] of Object.entries(WorkflowInstances[workflowInstanceID])) {
                if (taskActivity.some(taskInstance => taskInstance.User.UserID === currentUserID)) {
                    return true;
                }
            }
            return false;
        })
        .map((workflowInstanceID, index) => {
            return (
                <WorkflowInstanceComponent
                    Workflow={WorkflowInstances[workflowInstanceID]}
                    Structure={Structure}
                    WI_ID={workflowInstanceID}
                    WA_ID={workflowInstanceID}
                    key={`${WA_ID}-${workflowInstanceID}`}
                    Filters={Filters}
                    Strings={Strings}
                    onReplaceUserInTaskButtonClick={
                        onReplaceUserInTaskButtonClick
                    }
                    onMoreInformationButtonClick={onMoreInformationButtonClick}
                    showCheckboxes={showCheckboxes}
                    onCheckboxClick={onCheckboxClick}
                    selectedWorkflowIDs={selectedWorkflowIDs}
                    hasInstructorPrivilege={hasInstructorPrivilege}
                    showAnonymousVersion={showAnonymousVersion}
                    currentUserID={currentUserID}
                    onBypassTaskButtonClick={onBypassTaskButtonClick}
                    onCancelTaskButtonClick={onCancelTaskButtonClick}
                    onRestartTaskButtonClick={onRestartTaskButtonClick}
                    index={index}
                />
            );
        });

    if (workflowInstancesArray.length > 0) {
        return (
            <div className="workflow-activity-block">
                <div className="workflow-activity-label">
                    {/* This shows the workflow activity's ID and name above its workflow instances.
                     An explanatory tooltip is shown too. */}
                    {WA_ID} - {WorkflowActivityName}<Tooltip Text={Strings.WorkflowActivityTooltip} ID={WA_ID} />
                </div>
                {workflowInstancesArray}
            </div>
        );
    } else {
        return null;
    }
};

export default WorkflowComponent;
