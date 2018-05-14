import React, { Component } from 'react';
import Modal from '../shared/modal';
import apiCall from '../shared/apiCall';

// This component renders a popup message asking for confirmation when a user tries to cancel a task.
// On confirmation, it performs the cancellation.
class CancelTask extends Component {
    constructor(props) {
        super(props);
    }

    cancelTask() {
        // This function calls the backend API for cancelling a task.
        // See the 'Cancel a single task' section of the 'Pool and Reallocation APIs' document
        // for information about this API call.
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;

        const postBody = {
            ti_id: taskInstanceID
        };

        const url = '/task/cancel';
        showMessage('Cancelling the task...');
        apiCall.postAsync(url, postBody)
            .then(() => {
                showMessage('Task successfully cancelled');
                this.props.onCancelTask();
            });
        this.props.onClose();
    }

    render() {
        const title = 'Are you sure you want to cancel this task?';
        const okLabel = 'Cancel this task';
        const cancelLabel = 'Don\'t cancel this task';

        const taskID = this.props.taskInstance.TaskInstanceID;
        const taskName = this.props.taskInstance.TaskActivity.DisplayName;

        const message = 
            <div>
                <p>The following task will be cancelled: </p>
                <ul>
                    <li>
                        {`${taskName} (ID: ${taskID})`}
                    </li>
                </ul>
                <p style={{fontSize: 'smaller'}}>
                    Note: Cancelling this task will stop all or part of the problem thread from continuing.
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
                        onClick={() => this.cancelTask()}
                    >
                        {okLabel}
                    </button>
                </div>
            </Modal>
        );
    }
}

export default CancelTask;
