import React, { Component } from 'react';

const TaskInstanceComponent = ({ currentUserID, hasInstructorPrivilege, TaskInstance, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick }) => {
    let showTaskInstance = true;
    const taskStatus = JSON.parse(TaskInstance.Status);
    if (Filters.Status.length > 0) {
        showTaskInstance = taskStatus.some(v => Filters.Status.includes(v));
    }
    if (Filters.Users.length > 0) {
        showTaskInstance = showTaskInstance && Filters.Users.some(filterUserID => filterUserID === TaskInstance.User.UserID);
    }

    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    const DisplayName = TaskActivity.DisplayName;

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
                {
                    hasInstructorPrivilege ?
                        <div>
                            <div>{taskStatus[0]}</div>
                            <div>TaskID: {TaskInstance.TaskInstanceID}</div>
                            <div>{statusSymbols}</div>
                            <br />
                        </div>
                        : <div>{statusSymbols}</div>
                }
            </div>;
    } else {
        
        taskInformation =
            <div>
                <div className="task-type">{DisplayName}</div>
                {
                    hasInstructorPrivilege ?
                        <div>
                            <div> {UserContact.Email} </div>
                            <div>TaskID: {TaskInstance.TaskInstanceID}</div>
                            <div> UserID: {User.UserID} </div>
                        </div>
                        : null
                }
            	<div>{statusSymbols}</div>
                {
                    !hasInstructorPrivilege && currentUserID == TaskInstance.User.UserID ?
                        <div style={{fontWeight: 'bold'}}> My Task </div>
                        : null
                }
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
            {
                hasInstructorPrivilege ?
                    <div>
                        <span style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={() => onMoreInformationButtonClick(TaskInstance)} >
                            More Information
                        </span> <br />
                        {
                            isTaskReallocatable ?
                                <span style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={() => onReplaceUserInTaskButtonClick(TaskInstance)} >
                                    Replace this user
                                </span>
                                : null
                        }
                    </div>
                    : null
            }
        </div>;


    return (
        <div className={`task-instance ${bgColor}`}>
            {taskInformation}
            {taskInstanceTooltip}
        </div>
    );
};

export default TaskInstanceComponent;
