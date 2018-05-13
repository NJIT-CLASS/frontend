import React, { Component } from 'react';
import WorkflowInstanceComponent from './workflow-instance-component';
import Tooltip from '../shared/tooltip';

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
        .filter(key => {
            if (hasInstructorPrivilege) {
                return true;
            }
            for (const [taskActivityID, taskActivity] of Object.entries(
                WorkflowInstances[key]
            )) {
                if (
                    taskActivity.some(
                        taskInstance =>
                            taskInstance.User.UserID === currentUserID
                    )
                ) {
                    return true;
                }
            }
            return false;
        })
        .map((key, index) => {
            return (
                <WorkflowInstanceComponent
                    Workflow={WorkflowInstances[key]}
                    Structure={Structure}
                    WI_ID={key}
                    WA_ID={key}
                    key={`${WA_ID}-${key}`}
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
