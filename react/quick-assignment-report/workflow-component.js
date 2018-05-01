import React, { Component } from 'react';
import WorkflowInstanceComponent from './workflow-instance-component';

const WorkflowComponent = ({hasInstructorPrivilege, currentUserID, WorkflowInstances, Structure, WA_ID, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick, showCheckboxes, onCheckboxClick, selectedWorkflowIDs}) => {
    const workflowInstancesArray = Object.keys(WorkflowInstances)
        .filter(key => {
            if (hasInstructorPrivilege) {
                return true;
            }
            for (const [taskActivityID, taskActivity] of Object.entries(WorkflowInstances[key])) {
                if (taskActivity.some(taskInstance => taskInstance.User.UserID === currentUserID)) {
                    return true;
                }
            }
            return false;
        })
        .map((key)=> {
        return <WorkflowInstanceComponent Workflow={WorkflowInstances[key]}
                                        Structure={Structure}
                                        WI_ID={key}
                                        WA_ID={key}
                                        key={`${WA_ID}-${key}`}
                                        Filters={Filters}
                                        Strings={Strings}
                                        onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
                                        onMoreInformationButtonClick={onMoreInformationButtonClick}
                                        showCheckboxes={showCheckboxes}
                                        onCheckboxClick={onCheckboxClick}
                                        selectedWorkflowIDs={selectedWorkflowIDs}
                                        hasInstructorPrivilege={hasInstructorPrivilege}
                                        currentUserID={currentUserID}
                                      />;
    });

    return <div className="workflow-activity-block">
        <div className="workflow-activity-label">{WA_ID}</div>
        {workflowInstancesArray}
    </div>;
};

export default WorkflowComponent;
