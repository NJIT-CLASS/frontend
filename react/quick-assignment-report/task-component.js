import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';

const TaskComponent = ({currentUserID, hasInstructorPrivilege, TaskActivity, TA_ID, WI_ID, WA_ID, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick}) => {
    let showTaskActivity = true;
    if (Filters.Type.length > 0) {
        showTaskActivity = Filters.Type.includes(parseInt(TA_ID, 10));
    }
    let taskInstancesArray = TaskActivity.map((taskInstance, index)=> {
        return <TaskInstanceComponent TaskInstance={taskInstance}
            key={`${WA_ID}-${WI_ID}-${TA_ID}-${index}`}
            Filters={Filters}
            Strings={Strings}
            onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
            onMoreInformationButtonClick={onMoreInformationButtonClick}
            hasInstructorPrivilege={hasInstructorPrivilege}
            currentUserID={currentUserID}
        />;
    });

    if(showTaskActivity){
        return <div className='task-activity-block'>{taskInstancesArray}</div>;
    }
    else{
        return <div className={'task-activity-block empty-block-placeholder'}></div>;
    }
};

export default TaskComponent;
