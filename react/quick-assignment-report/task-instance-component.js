import React, { Component } from 'react';

const TaskInstanceComponent = ({
    currentUserID,
    hasInstructorPrivilege,
    showAnonymousVersion,
    TaskInstance,
    Filters,
    Strings,
    onReplaceUserInTaskButtonClick,
    onMoreInformationButtonClick,
    onBypassTaskButtonClick,
    onCancelTaskButtonClick,
    onRestartTaskButtonClick
}) => {
    let showTaskInstance = true;
    const taskStatuses = JSON.parse(TaskInstance.Status);
    if (Filters.Status.length > 0) {
        showTaskInstance = taskStatuses.some(v => Filters.Status.includes(v));
    }
    if (Filters.Users.length > 0) {
        showTaskInstance =
            showTaskInstance &&
            Filters.Users.some(
                filterUserID => filterUserID === TaskInstance.User.UserID
            );
    }

    //hide according to status filter
    if (!showTaskInstance) {
        return <div className={'task-instance empty-block-placeholder'} />;
    }

    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    const DisplayName = TaskActivity.DisplayName;

    const statusSymbols = getStatusSymbolsString(taskStatuses);

    const link = `/task/${TaskInstance.TaskInstanceID}`;

    //hide details if Automatic task
    let taskInformation = null;
    if (taskStatuses[0] === 'automatic') {
        taskInformation = (
            <div>
                <div className="task-type">{DisplayName}</div>
                {hasInstructorPrivilege && !showAnonymousVersion ? (
                    <div>
                        <div>{taskStatuses[0]}</div>
                        <div>TaskID: {TaskInstance.TaskInstanceID}</div>
                        <div>{statusSymbols}</div>
                        <br />
                    </div>
                ) : (
                    <div>{statusSymbols}</div>
                )}
            </div>
        );
    } else {
        taskInformation = (
            <div>
                <div className="task-type">{DisplayName}</div>
                {hasInstructorPrivilege && !showAnonymousVersion ? (
                    <div>
                        <div> {UserContact.Email} </div>
                        <div>TaskID: {TaskInstance.TaskInstanceID}</div>
                        <div> UserID: {User.UserID} </div>
                    </div>
                ) : null}
                <div>{statusSymbols}</div>
                {!showAnonymousVersion && currentUserID == TaskInstance.User.UserID ? (
                    <div style={{ fontWeight: 'bold' }}> My Task </div>
                ) : null}
            </div>
        );
    }


    // showButton is a table that indicates whether the 
    // 'replace user,' 'bypass task,' 'cancel task,' and 'restart task'
    // buttons should show based on the task status
    const showButton = {
        "replace": {
            "automatic": false,
            "started": true,
            "complete": false,
            "bypassed": false,
            "cancelled": false,
            "not_yet_started": true
        },
        "bypass": {
            "automatic": true,
            "started": true,
            "complete": false,
            "bypassed": false,
            "cancelled": false,
            "not_yet_started": false
        },
        "cancel": {
            "automatic": false,
            "started": true,
            "complete": false,
            "bypassed": true,
            "cancelled": false,
            "not_yet_started": true
        },
        "restart": {
            "automatic": true,
            "started": true,
            "complete": true,
            "bypassed": true,
            "cancelled": true,
            "not_yet_started": false
        },
    }

    const status = taskStatuses.includes('cancelled') ? 'cancelled' : taskStatuses[0];

    const taskInstanceTooltip = (
        <div className="task-instance-tooltip">
            <a href={`/task/${TaskInstance.TaskInstanceID}`}>Go to task page</a>
            <br />
            {hasInstructorPrivilege ? (
                <div>
                    <div>
                        <span
                            style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={() => onMoreInformationButtonClick(TaskInstance)}
                        >
                            More Information
                        </span>
                    </div>

                    {showButton['replace'][status] ? (
                        <div>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => onReplaceUserInTaskButtonClick(TaskInstance)}
                            >
                                Replace this user
                            </span>
                        </div>
                    ) : null}

                    {showButton['bypass'][status] ? (
                        <div>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => onBypassTaskButtonClick(TaskInstance)}
                            >
                                Bypass this task
                            </span>
                        </div>
                    ) : null}

                    {showButton['cancel'][status] ? (
                        <div>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => onCancelTaskButtonClick(TaskInstance)}
                            >
                                Cancel this task
                            </span>
                        </div>
                    ) : null}

                    {showButton['restart'][status] ? (
                        <div>
                            <span
                                style={{ color: 'blue', cursor: 'pointer' }}
                                onClick={() => {}}
                            >
                                Restart this task
                            </span>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );

    return (
        <div className={`task-instance ${getBackgroundColor(taskStatuses)}`}>
            {taskInformation}
            {taskInstanceTooltip}
        </div>
    );
};

function getStatusSymbolsString(taskStatuses) {
    const letters = {
        viewed: '(O)',
        complete: '(C)',
        late: '(L)',
        cancelled: '(X)',
        not_yet_started: '(NP)',
        started: '(P)',
        bypassed: '(B)',
        automatic: '(A)'
    };

    let statusSymbols = letters[taskStatuses[0]];
    if (taskStatuses.includes('viewed')) {
        statusSymbols += letters.viewed;
    }
    if (taskStatuses.includes('late')) {
        statusSymbols += letters.late;
    }
    if (taskStatuses.includes('cancelled')) {
        statusSymbols += letters.cancelled;
    }

    return statusSymbols;
}

function getBackgroundColor(taskStatuses) {
    const colors = {
        viewed: 'viewed',
        complete: 'complete',
        late: 'late',
        cancelled: 'cancelled',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed: 'bypassed',
        automatic: 'automatic'
    };

    /* 
     * The color of a task instance will be the color of its status
     * with the highest priority using the hierarchy below:
     * 1. Cancelled
     * 2. Bypassed
     * 3. Complete
     * 4. Late
     * 5. Viewed
     * 6. Started, Not Yet Started, Automatic
     * E.g. a cancelled, late, and viewed task will have the 'cancelled'
     * color because 'cancelled' has higher priority than the other two statuses.
     */

    let backgroundColor = colors[taskStatuses[0]];
    if (taskStatuses.includes('viewed')) {
        backgroundColor = colors.viewed;
    }
    if (taskStatuses.includes('late')) {
        backgroundColor = colors.late;
    }
    if (taskStatuses.includes('complete')) {
        backgroundColor = colors.complete;
    }
    if (taskStatuses.includes('bypassed')) {
        backgroundColor = colors.bypassed;
    }
    if (taskStatuses.includes('cancelled')) {
        backgroundColor = colors.cancelled;
    }

    return backgroundColor;
}

export default TaskInstanceComponent;
