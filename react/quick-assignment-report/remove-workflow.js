import React, { Component } from 'react';
import Modal from '../shared/modal';
import apiCall from '../shared/apiCall';

class RemoveWorkflow extends Component {
    constructor(props) {
        super(props);
    }

    cancelWorkflows() {

        // The API requires the IDs to be Numbers to work properly so we have to convert them from String to Number
        const assignmentID = parseInt(this.props.assignmentID, 10);
        const workflowIDs = this.props.workflowIDs.map(id => parseInt(id, 10));

        const cancelWorkflowPostBody = {
            ai_id: assignmentID,
            wi_ids: workflowIDs
        };

        // See 'To Cancel Workflows' section of the 'Pool and Reallocation APIs' document
        // for information about this API call
        // (https://drive.google.com/open?id=1IID3sbmgdTUW2X5E7Buve18UnDR3cM-k)
        const cancelWorkflowURL = '/reallocate/cancel_workflows';
        apiCall.postAsync(cancelWorkflowURL, cancelWorkflowPostBody)
            .then(response => {
                const confirmCancelURL = '/reallocate/confirm_cancellation';
                const data = response.data;
                if (data.confirmation_required) {
                    const confirmCancelPostBody = { 
                        data: data.data
                    };
                    return apiCall.postAsync(confirmCancelURL, confirmCancelPostBody);
                }
            })
            .then(() => {
                showMessage('Problem threads successfully cancelled');
                this.props.onWorkflowCancel();
            });
        this.props.onClose();
    }

    render() {
        const title = 'Are you sure you want to remove these problem threads?';
        const okLabel = 'Remove problem threads';
        const cancelLabel = 'Don\'t remove problem threads';

        const workflowsToRemoveList = this.props.workflowIDs.length > 0 ?
            <ul>
                {this.props.workflowIDs.map(
                    workflowID => <li key={workflowID}>{`Problem thread: ${workflowID}`}</li>
                )}
            </ul>
             : <p>No problem threads selected</p>;

        const message = 
            <div>
                <p>The following problem threads will be removed: </p>
                {workflowsToRemoveList}
                <p style={{fontSize: 'smaller'}}>
                    Note: Only problem threads that have not already started will be removed.
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
                        onClick={() => this.cancelWorkflows()}
                    >
                        {okLabel}
                    </button>
                </div>
            </Modal>
        );
    }
}

export default RemoveWorkflow;
