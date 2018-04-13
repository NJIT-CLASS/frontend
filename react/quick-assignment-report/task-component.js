import React, { Component } from 'react';
import TaskInstanceComponent from './task-instance-component';

const TaskComponent = ({TaskActivity, TA_ID, WI_ID, WA_ID, Filters, Strings, onReplaceUserInTaskButtonClick}) => {
    let showTaskActivity = true;
    if(Filters.Type !== ''){
        showTaskActivity = Filters.Type === TaskActivity[0].TaskActivity.Type;
    }
    let taskInstancesArray = TaskActivity.map((taskInstance, index)=> {
        return <TaskInstanceComponent TaskInstance={taskInstance}
                                      key={`${WA_ID}-${WI_ID}-${TA_ID}-${index}`}
                                      Filters={Filters}
                                      Strings={Strings}
                                      onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}

                                  />;
    });

    if(showTaskActivity){
        return <div className='task-activity-block'>{taskInstancesArray}</div>;
    }
    else{
        return <div className={'task-instance empty-block-placeholder'}>
        </div>;
    }
};

export default TaskComponent;
