import React, { Component } from 'react';

const TaskInstanceComponent = ({ TaskInstance, Filters }) => {
    let showTaskInstance = true;
    const taskStatus = JSON.parse(TaskInstance.Status);
    if(Filters.Status.length > 0 && Filters.Status[0] !== ''){
        showTaskInstance = taskStatus.some(v => Filters.Status.includes(v));
    }

    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;

    const colors = { Incomplete: 'incomplete',
        complete: 'complete',
        Late: 'late',
        'Not Needed': 'not-needed',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed:'bypassed',
        automatic: 'automatic',
    };
    const link = `/task/${TaskInstance.TaskInstanceID}`;

    if(!showTaskInstance){
        return null;
    }

    return (<div className={`task-instance ${colors[taskStatus[0]]}`}>
      <a href={link}>
          <div className="task-type">{TaskActivity.Type}</div>
          <div> {UserContact.Email} </div>
          <div>TaskID: {TaskInstance.TaskInstanceID}</div>
          <div> UserID: {User.UserID} </div>
          <div>{taskStatus[0]}</div>
        </a>
      </div>
    );
};

export default TaskInstanceComponent;
