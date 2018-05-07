import React, { Component } from 'react';
import Modal from '../shared/modal';
import apiCall from '../shared/apiCall';

class BypassTask extends Component {
    constructor(props) {
        super(props);
    }

    bypassTask() {
        const taskInstanceID = this.props.taskInstance.TaskInstanceID;

        const postBody = {
            ti_id: taskInstanceID
        };

        // See 'Bypass a single task' section of the 'Pool and Reallocation APIs' document
        // for information about this API call
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)
        const url = '/task/bypass';
        apiCall.postAsync(url, postBody)
            .then(() => {
                showMessage('Task successfully bypassed');
                this.props.onBypassTask();
            });
        this.props.onClose();
    }

    render() {
        const title = 'Are you sure you want to bypass this task?';
        const okLabel = 'Bypass this task';
        const cancelLabel = 'Don\'t bypass this task';

        const taskID = this.props.taskInstance.TaskInstanceID;

        const message = 
            <div>
                <p>The following task will be bypassed: </p>
                <ul>
                    <li>
                        {taskID}
                    </li>
                </ul>
                <p style={{fontSize: 'smaller'}}>
                    Note: Bypassing this task will trigger the next part of the problem thread, but results may be unpredictable since this task may only contain default content.
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
