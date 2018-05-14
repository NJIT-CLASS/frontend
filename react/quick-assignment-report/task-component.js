import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';

// This component renders a task activity.
// It contains all of the task activity's task instances.
const TaskComponent = ({
    currentUserID,
    hasInstructorPrivilege,
    showAnonymousVersion,
    TaskActivity,
    TA_ID,
    WI_ID,
    WA_ID,
    Filters,
    Strings,
    onReplaceUserInTaskButtonClick,
    onMoreInformationButtonClick,
    onBypassTaskButtonClick,
    onCancelTaskButtonClick,
    onRestartTaskButtonClick
}) => {
    let taskInstancesArray = TaskActivity
        // We only show task instances that match the task type filter (which filters by task activity ID).
        // Otherwise, an empty block is shown as a placeholder.
        .filter(taskInstance => Filters.Type.length === 0 || Filters.Type.includes(taskInstance.TaskActivity.TaskActivityID))
        .map((taskInstance, index) => {
            return (
                <TaskInstanceComponent
                    TaskInstance={taskInstance}
                    key={`${WA_ID}-${WI_ID}-${TA_ID}-${index}`}
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
            );
        });

    if (taskInstancesArray.length > 0) {
        return <div className="task-activity-block">{taskInstancesArray}</div>;
    } else {
        return (
            <div className={'task-activity-block empty-block-placeholder'} />
        );
    }
};

export default TaskComponent;
