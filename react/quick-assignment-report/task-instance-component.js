import React, { Component } from 'react';

const TaskInstanceComponent = ({ TaskInstance }) => {
    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    console.log(TaskInstance);
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

    return (<div className={`task-instance ${colors[JSON.parse(TaskInstance.Status)[0]]}`}>
      <a href={link}>
          <div className="task-type">{TaskActivity.Type}</div>
          <div> {UserContact.Email} </div>
          <div>TaskID: {TaskInstance.TaskInstanceID}</div>
          <div> UserID: {User.UserID} </div>
          <div>{JSON.parse(TaskInstance.Status)[0]}</div>
        </a>
      </div>
    );
};

export default TaskInstanceComponent;
