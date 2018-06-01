import React, { Component } from 'react';
import Modal from '../shared/modal';
import apiCall from '../shared/apiCall';

// This component renders a popup message asking for confirmation when a user tries to restart a task.
// On confirmation, it should perform the restart.
// TODO: This still must be implemented.
class RestartTask extends Component {
    constructor(props) {
        super(props);
    }

    restartTask() {
        /* TODO: Implement this when the backend API is ready.*/
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;
        const postBody = {
            ti_id: taskInstanceID,
            keep_content: false,
            duration: []
        };

        const url = '/task/reset';

        apiCall.postAsync(url, postBody)
            .then(() => {
                showMessage('Task successfully restarted');
                this.props.onRestartTask();
            });

        this.props.onClose();
    }

    render() {
        const title = 'Are you sure you want to restart this task?';
        const okLabel = 'Restart this task';
        const cancelLabel = 'Don\'t restart this task';

        const taskID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;

        const message = 
            <div>
                {/* TODO: remove this message when implemented */}
                <p>The following task will be restarted: </p>
                <ul>
                    <li>
                        {`${taskName} (ID: ${taskID})`}
                    </li>
                </ul>
            </div>;

        return (
            <Modal
                close={this.props.onClose}
                title={title}
            >
                <div id="modal-text">{message}</div>
                <div id="modal-footer">
                    <button
                        className="button"
                        id="cancel-button"
                        onClick={this.props.onClose}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="button"
                        id="confirm-button"
                        onClick={() => this.restartTask()}
                    >
                        {okLabel}
                    </button>
                </div>
            </Modal>
        );
    }
}

export default RestartTask;
