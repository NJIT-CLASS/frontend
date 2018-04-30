import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';

const TaskComponent = ({currentUserID, hasInstructorPrivilege, TaskActivity, TA_ID, WI_ID, WA_ID, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick}) => {
    let taskInstancesArray = TaskActivity
        .filter(taskInstance => Filters.Type.length === 0 || Filters.Type.includes(taskInstance.TaskActivity.Type))
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
                    currentUserID={currentUserID}
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
