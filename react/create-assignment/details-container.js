import React from 'react';

import { TASK_TYPES } from '../shared/constants';

import Modal from '../shared/modal';

class DetailsContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newWorkFlowName: '',
            showNewWorkflowModal: false
        };
    }

    // createWorkflow() {
    //     let task = {
    //         type: TASK_TYPES.CREATE_PROBLEM,
    //         parent: null,
    //         subtasks: []
    //     };

    //     let newWorkflowIndex = this.props.createWorkflow({
    //         name: this.state.newWorkFlowName,
    //         task: task
    //     });
    //     this.props.selectWorkflow(newWorkflowIndex);
    // }

    addWorkflow() {
        this.setState({
            showNewWorkflowModal: true
        });
    }

    updateWorkflowName(e) {
        this.setState({
            newWorkFlowName: e.target.value
        });
    }

    // closeModal() {
    //     this.setState({
    //         showNewWorkflowModal: false,
    //         newWorkFlowName: ''
    //     });
    // }

    createWorkflow(){
        let task = {
            type: TASK_TYPES.CREATE_PROBLEM,
            parent: null,
            subtasks: [],
            depth:0
        };
        this.props.createWorkflow({task:task});
    }

    updateAssignmentName(e) {
        this.props.updateAssignmentDetails(e.target.value);
    }

    updateAssignmentDescription(e) {
        this.props.updateAssignmentDetails(null, e.target.value);
    }

    render() {
        //let modal = null;

        // if (this.state.showNewWorkflowModal) {
        //     modal = (
        //         <Modal
        //             title="Create New Workflow"
        //             close={this.closeModal.bind(this)}
        //         >
        //             <div>
        //                 <label>Workflow Name</label>
        //             </div>
        //             <input
        //                 type="text"
        //                 autoFocus={true}
        //                 value={this.state.newWorkFlowName}
        //                 onChange={this.updateWorkflowName.bind(this)}
        //             >
        //             </input>
        //             <div className="row">
        //                 <button onClick={this.createWorkflow.bind(this)}>Create</button>
        //             </div>
        //         </Modal>
        //     );
        // }

        // let workflows = this.props.workflows.map((workflow, index) => {
        //     return <li key={index}>{workflow.name}</li>;
        // });

        return (
            <div className="container">
                <div className="section">
                    <h3 className="title">Details</h3>
                    <div className="section-content">
                        <label>Name</label>
                        <div>
                            <input
                                type="text"
                                value={this.props.assignmentDetails.name}
                                onChange={this.updateAssignmentName.bind(this)}
                            >
                            </input>
                        </div>

                        <label>Description</label>
                        <div>
                            <textarea
                                value={this.props.assignmentDetails.description}
                                onChange={this.updateAssignmentDescription.bind(this)}
                            >
                            </textarea>
                        </div>
                        <div className="row">
                            <button
                            onClick={this.createWorkflow.bind(this)}
                            >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailsContainer;
