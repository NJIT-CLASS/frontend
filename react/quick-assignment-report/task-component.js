import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';

const TaskComponent = ({TaskActivity, TA_ID, WI_ID, WA_ID}) => {
    let taskInstancesArray = TaskActivity.map((taskInstance, index)=> {
        return <TaskInstanceComponent TaskInstance={taskInstance}
                                      key={`${WA_ID}-${WI_ID}-${TA_ID}-${index}`}
                                  />;
    });
    return <div className='task-activity-block'>{taskInstancesArray}</div>;
};

export default TaskComponent;
