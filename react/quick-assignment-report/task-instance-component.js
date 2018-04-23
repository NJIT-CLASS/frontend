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

    /*
    if (taskStatus.includes('late') && !taskStatus.includes('complete')) {
        taskStatus[0] = 'late';
    }
    if (taskStatus.includes('cancelled')) {
        taskStatus[0] = 'cancelled';
    }
    */

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

    let statusSymbols = letters[taskStatus[0]];
    if (taskStatus.includes('viewed')) {
        statusSymbols += letters.viewed;
    }
    if (taskStatus.includes('late')) {
        statusSymbols += letters.late;
    }
    if (taskStatus.includes('cancelled')) {
        statusSymbols += letters.cancelled;
    }

    let bgColor = colors[taskStatus[0]];
    if (taskStatus.includes('viewed') && !taskStatus.includes('complete')) {
        bgColor = colors.viewed;
    }
    if (taskStatus.includes('late') && !taskStatus.includes('complete')) {
        bgColor = colors.late;
    }
    if (taskStatus.includes('cancelled')) {
        bgColor = colors.cancelled;
    }


    const link = `/task/${TaskInstance.TaskInstanceID}`;

    //hide according to status filter
    if(!showTaskInstance){
        return <div className={'task-instance empty-block-placeholder'}>
        </div>;
    }

    //hide details if Automatic task
    let taskInformation = null;
    if (taskStatus[0] === 'automatic') {
        taskInformation = 
            <div>
                <div className="task-type">{DisplayName}</div>
                <div>{taskStatus[0]}</div>
                <div>TaskID: {TaskInstance.TaskInstanceID}</div>
            	<div>{statusSymbols}</div>
                <br />
            </div>;
    } else {
        taskInformation =
            <div>
                <div className="task-type">{DisplayName}</div>
            	<div> {UserContact.Email} </div>
            	<div>TaskID: {TaskInstance.TaskInstanceID}</div>
            	<div> UserID: {User.UserID} </div>
            	<div>{statusSymbols}</div>
            </div>;
    }

    const isTaskReallocatable = [
        letters.opened,
        letters.late,
        letters.not_yet_started,
        letters.started
    ].includes(letters[taskStatus[0]]);

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
        <div className={`task-instance ${bgColor}`}>
            {taskInformation}
            {taskInstanceTooltip}
        </div>
    );
};

export default TaskInstanceComponent;
