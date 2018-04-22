import React, { Component } from 'react';

const TaskInstanceComponent = ({onReallocate, TaskInstance, Filters, Strings}) => {
    let showTaskInstance = true;
    const taskStatus = JSON.parse(TaskInstance.Status);
    if(Filters.Status.length > 0 && Filters.Status[0] !== ''){
        showTaskInstance = taskStatus.some(v => Filters.Status.includes(v));
    }
    let modal = null;
    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    const DisplayName = TaskActivity.DisplayName;

    //from old task status table
    let isLate = taskStatus.includes('late') ? (taskStatus.includes('complete' ) ? false : true) : false ;

    const colors = { Incomplete: 'incomplete',
        complete: 'complete',
        Late: 'late',
        'Not Needed': 'not-needed',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed:'bypassed',
        automatic: 'automatic',
    };

    const letters = {
        Incomplete: '(O)',
        complete: '(C)',
        Late: '(L)',
        'Not Needed': '(X)',
        not_yet_started: '(NP)',
        started: '(P)',
        automatic: '(A)',
        bypassed: '(B)',
    };


    const link = `/task/${TaskInstance.TaskInstanceID}`;

    //hide according to status filter
    if(!showTaskInstance){
        return <div className={'task-instance empty-block-placeholder'}>
        </div>;
    }

    //hide details if Automatic task
    let taskInformation = null;
    if(isLate){
        taskInformation = <div className="dropdown">
            <div className="task-type">{TaskActivity.Type}</div>
            <div> {UserContact.Email} </div>
            <div>TaskID: {TaskInstance.TaskInstanceID}</div>
            <div> UserID: {User.UserID} </div>
            <div>{letters.Late}</div>
            <div className="dropdown-content"><ul><li><a href={link}>View Task</a></li><li><a href="#" onClick={onReallocate.bind(this,User.UserID,TaskInstance.TaskInstanceID)}>Reallocate Task</a></li></ul></div>
        </div>;
    }
    else if(taskStatus[0] === 'automatic'){
        taskInformation = <div>
          <div className="task-type">{DisplayName}</div>
          <div>{taskStatus[0]}</div>
          <div>TaskID: {TaskInstance.TaskInstanceID}</div>
          <br />
          <br />



        </div>;
    } else {



        taskInformation = <div className="dropdown">
          <div className="task-type">{DisplayName}</div>
          <div> {UserContact.Email} </div>
          <div>TaskID: {TaskInstance.TaskInstanceID}</div>
          <div> UserID: {User.UserID} </div>
          <div>{letters[taskStatus[0]]}</div>
          <div className="dropdown-content"><ul><li><a href={link}>View Task</a></li><li><a href="#" onClick={onReallocate.bind(this,User.UserID,TaskInstance.TaskInstanceID)}>Reallocate Task</a></li></ul></div>
        </div>;
    }


    return (<div className={`task-instance ${isLate ? 'late' : colors[taskStatus[0]]}`}>
        {taskInformation}
    </div>
    );
};

export default TaskInstanceComponent;
