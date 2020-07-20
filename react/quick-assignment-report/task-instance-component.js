import React, { Component } from 'react';

// This component renders a task instance. It also renders a tooltip (which displays when you hover 
// over the task) containing buttons for replacing the assigned user, cancelling the task, etc.
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
    // console.log(TaskInstance)
    const taskStatuses = JSON.parse(TaskInstance.Status);

    // We only show this task instance if it matches the status filter
    // (ie the task instance must have one of the statuses selected in the filter).
    let showTaskInstance = true;
    if (Filters.Status.length > 0) {
        showTaskInstance = taskStatuses.some(aStatus => Filters.Status.includes(aStatus));
    }
    // We only show task instances that match the users filter (ie the task instance must be assigned 
    // to one of the users selected in the filter).
    if (Filters.Users.length > 0) {
        showTaskInstance = showTaskInstance &&
            Filters.Users.some(filterUserID => filterUserID === TaskInstance.User.UserID);
    }

    // Hide according to the filters.
    if (!showTaskInstance) {
        return <div className={'task-instance empty-block-placeholder'} />;
    }

    const User = TaskInstance.User;
    const UserContact = TaskInstance.User.UserContact;
    const TaskActivity = TaskInstance.TaskActivity;
    const DisplayName = TaskActivity.DisplayName;
    const statusSymbols = getStatusSymbolsString(taskStatuses);

    // Automatic tasks show the task name and the status symbols.
    // If the currently signed in user has instructor privileges (and the page is not in anonymous mode),
    // then the task ID and the execution status ('automatic') are also shown.
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
        // Non-automatic tasks show the task name and the status symbols.
        // If the currently signed in user has instructor privileges (and the page is not in anonymous mode),
        // then the task ID and info about the user assigned to the task are also shown.
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
                {/* We indicate if this task is allocated to the currently signed in user
                (unless the page is in anonymous mode). */}
                {!showAnonymousVersion && currentUserID == TaskInstance.User.UserID ? (
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}> ***My Task*** </div>
                ) : null}
            </div>
        );
    }


    // This table indicates whether the 'replace user,' 'bypass task,' 'cancel task,' 
    // and 'restart task' buttons should show based on the task status.
    const showButton = {
        'replace': {
            'automatic': false,
            'started': true,
            'complete': false,
            'bypassed': false,
            'not_yet_started': true,
            'cancelled': false
        },
        'bypass': {
            'automatic': true,
            'started': true,
            'complete': false,
            'bypassed': false,
            'not_yet_started': false,
            'cancelled': false
        },
        'cancel': {
            'automatic': false,
            'started': true,
            'complete': false,
            'bypassed': true,
            'not_yet_started': true,
            'cancelled': false
        },
        'restart': {
            'automatic': true,
            'started': true,
            'complete': true,
            'bypassed': true,
            'not_yet_started': false,
            'cancelled': true
        },
    };

    // The 'Cancelled' status has highest priority. Otherwise, we use the execution status (the first status).
    const status = taskStatuses.includes('cancelled') ? 'cancelled' : taskStatuses[0];

    const taskInstanceTooltip = (
        <div className="task-instance-tooltip">
            <a href={`/task/${TaskInstance.TaskInstanceID}`}>Go to task page</a>
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
                                onClick={() => onRestartTaskButtonClick(TaskInstance)}
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
    // Returns a string containing the symbols for all of statuses.
    const symbols = {
        viewed: '(O)',
        complete: '(C)',
        late: '(L)',
        cancelled: '(X)',
        not_yet_started: '(NP)',
        started: '(P)',
        bypassed: '(B)',
        automatic: '(A)'
    };

    let statusSymbolsString = symbols[taskStatuses[0]]; // Include the first status (the Execution status, e.g. "Complete," "Started," etc.).
    if (taskStatuses.includes('viewed')) {
        statusSymbolsString += symbols.viewed;
    }
    if (taskStatuses.includes('late')) {
        statusSymbolsString += symbols.late;
    }
    if (taskStatuses.includes('cancelled')) {
        statusSymbolsString += symbols.cancelled;
    }

    return statusSymbolsString;
}

function getBackgroundColor(taskStatuses) {
    // Returns the status whose color will be shown on the task instance.
    const statuses = {
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
     * The color of a task instance will be the color associated with its status that 
     * has the highest priority using the hierarchy below:
     * 1. Cancelled (highest)
     * 2. Bypassed
     * 3. Complete
     * 4. Late
     * 5. Viewed
     * 6. Started, Not Yet Started, Automatic (lowest)
     * E.g. a cancelled, late, and viewed task will have the 'cancelled'
     * color because 'cancelled' has higher priority than the other two statuses.
     */

    let backgroundColor = statuses[taskStatuses[0]]; // We use the first status (Execution status) by default.
    if (taskStatuses.includes('viewed')) {
        backgroundColor = statuses.viewed;
    }
    if (taskStatuses.includes('late')) {
        backgroundColor = statuses.late;
    }
    if (taskStatuses.includes('complete')) {
        backgroundColor = statuses.complete;
    }
    if (taskStatuses.includes('bypassed')) {
        backgroundColor = statuses.bypassed;
    }
    if (taskStatuses.includes('cancelled')) {
        backgroundColor = statuses.cancelled;
    }

    return backgroundColor;
}

export default TaskInstanceComponent;
