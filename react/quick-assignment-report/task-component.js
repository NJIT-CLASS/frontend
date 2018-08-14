import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';
import { TASK_TYPES } from '../../server/utils/react_constants';

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
    // We only show task instances that match the task type filter
    // Otherwise, an empty block is shown as a placeholder.
    let taskInstancesArray = TaskActivity
        .filter(taskInstance => Filters.TaskType.length === 0 || Filters.TaskType.includes(taskInstance.TaskActivity.TaskActivityID) || taskInstance.TaskActivity.Type == TASK_TYPES.NEEDS_CONSOLIDATION)
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
