import React, { Component } from 'react';
import Modal from '../shared/modal';
import apiCall from '../shared/apiCall';

// This component renders a popup message asking for confirmation when a user tries to bypass a task.
// On confirmation, it performs the bypass.
class BypassTask extends Component {
    constructor(props) {
        super(props);
    }

    bypassTask() {
        // This function calls the backend API for bypassing a task.
        // See the 'Bypass a single task' section of the 'Pool and Reallocation APIs' document
        // for information about this API call.
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;

        const postBody = {
            ti_id: taskInstanceID
        };

        const url = '/task/bypass';
        showMessage('Bypassing the task...');
        apiCall.postAsync(url, postBody)
            .then(() => {
                this.props.onBypassTask();
                showMessage('Task successfully bypassed');
            });
        this.props.onClose();
    }

    render() {
        const title = 'Are you sure you want to bypass this task?';
        const okLabel = 'Bypass this task';
        const cancelLabel = 'Don\'t bypass this task';

        const taskID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;

        const message = 
            <div>
                <p>The following task will be bypassed: </p>
                <ul>
                    <li>
                        {`${taskName} (ID: ${taskID})`}
                    </li>
                </ul>
                <p style={{fontSize: 'smaller'}}>
                    Note: Bypassing this task will trigger the next part of the problem thread, but results <br />
                    may be unpredictable since this task may only contain default content.
                </p>
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
                        onClick={() => this.bypassTask()}
                    >
                        {okLabel}
                    </button>
                </div>
            </Modal>
        );
    }
}

export default BypassTask;
