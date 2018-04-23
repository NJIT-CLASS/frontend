import React, { Component } from 'react';

const TaskInstanceComponent = ({ TaskInstance, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick }) => {
    let showTaskInstance = true;
    const taskStatus = JSON.parse(TaskInstance.Status);
    if(Filters.Status.length > 0) {
        showTaskInstance = taskStatus.some(v => Filters.Status.includes(v));
    }

    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    const DisplayName = TaskActivity.DisplayName;

    let theStatus = taskStatus[0];
    if (taskStatus.includes('late') && !taskStatus.includes('complete')) {
        theStatus = 'late';
    }
    if (taskStatus.includes('cancelled')) {
        theStatus = 'cancelled';
    }

    const colors = { 
        viewed: 'viewed',
        complete: 'complete',
        late: 'late',
        cancelled: 'cancelled',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed:'bypassed',
        automatic: 'automatic',
    };

    const letters = {
        viewed: '(O)',
        complete: '(C)',
        late: '(L)',
        cancelled: '(X)',
        not_yet_started: '(NP)',
        started: '(P)',
        bypassed: '(B)',
        automatic: '(A)',
    };


    const link = `/task/${TaskInstance.TaskInstanceID}`;

    //hide according to status filter
    if(!showTaskInstance){
        return <div className={'task-instance empty-block-placeholder'}>
        </div>;
    }

    //hide details if Automatic task
    let taskInformation = null;
    if (theStatus === 'automatic') {
        taskInformation = 
            <div>
                <div className="task-type">{DisplayName}</div>
                <div>{theStatus}</div>
                <div>TaskID: {TaskInstance.TaskInstanceID}</div>
                <br />
                <br />
            </div>;
    } else {
        taskInformation =
            <div>
                <div className="task-type">{DisplayName}</div>
            	<div> {UserContact.Email} </div>
            	<div>TaskID: {TaskInstance.TaskInstanceID}</div>
            	<div> UserID: {User.UserID} </div>
            	<div>{letters[theStatus]}</div>
            </div>;
    }

    const isTaskReallocatable = [
        letters.opened,
        letters.late,
        letters.not_yet_started,
        letters.started
    ].includes(letters[theStatus]);

    const taskInstanceTooltip =
        <div className="task-instance-tooltip">
            <a href={`/task/${TaskInstance.TaskInstanceID}`}>
                Go to task page
            </a> <br />
            <span style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => onMoreInformationButtonClick(TaskInstance)} >
                More Information
            </span> <br />
            {isTaskReallocatable ? (
                <span style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => onReplaceUserInTaskButtonClick(TaskInstance)} >
                    Replace this user
                </span>
            ) : null}
        </div>;


    return (
        <div className={`task-instance ${colors[theStatus]}`}>
            {taskInformation}
            {taskInstanceTooltip}
        </div>
    );
};

export default TaskInstanceComponent;
