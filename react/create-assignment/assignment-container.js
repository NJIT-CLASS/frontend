import React from 'react';

import PageHeader from './page-header';
import DetailsContainer from './details-container';
import WorkflowDetailContainer from './workflow-detail-container';

class AssignmentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assignmentDetails: {},
            workflows: [],
            visibleWorkflowIndex: null
        };
    }
    createWorkflow(workflow){
        let workflows = this.state.workflows;
        const len = workflows.length
        workflows.push(workflow);
        this.setState({
            workflows : workflows,
            visibleWorkflowIndex: len            
        })
    }
    addTask(task){
        this.setState
    }

    changeWorkflow(index,workflow){
        let workflows = this.state.workflows;
        workflows[index] = workflow;
        this.setState({
            workflows:workflows
        });
    }
    // selectWorkflow(index=null) {
    //     this.setState({
    //         visibleWorkflowIndex: index,
    //         newWorkflowShowing: true
    //     });
    // }

    // createWorkflow(index, workflow) {
    //     let workflows = this.state.workflows;

    //     let newWorkflowIndex = index;

    //     if (index !== null) {
    //         workflows[index] = workflow;
    //     }
    //     else {
    //         let newLength = workflows.push(workflow);
    //         newWorkflowIndex = newLength - 1;
    //     }

    //     this.setState({
    //         workflows: workflows,
    //         visibleWorkflowIndex: null,
    //         newWorkflowShowing: false
    //     });

    //     return newWorkflowIndex;
    // }

    updateAssignmentDetails(name, description) {
        let newAssignmentDetails = this.state.assignmentDetails;

        if (name !== null) {
            newAssignmentDetails.name = name;
        }

        if (description !== null) {
            newAssignmentDetails.description = description;
        }

        this.setState({assignmentDetails: newAssignmentDetails});
    }

    render() {
        let content = null;

        if (this.state.visibleWorkflowIndex === null) {
            content = (
                <DetailsContainer
                    assignmentDetails={this.state.assignmentDetails}
                    workflows={this.state.workflows}
                    //selectWorkflow={this.selectWorkflow.bind(this)}
                    createWorkflow={this.createWorkflow.bind(this)}
                    updateAssignmentDetails={this.updateAssignmentDetails.bind(this)}
                />
            );
        }
        else {
            content = (
                <WorkflowDetailContainer
                    workflow={this.state.workflows[this.state.visibleWorkflowIndex]}
                    createWorkflow={this.createWorkflow.bind(this, this.state.visibleWorkflowIndex)}
                    changeWorkflow = {this.changeWorkflow.bind(this,this.state.visibleWorkflowIndex)}
                />
            );
        }

        return (
            <div className="assignment-container">
                <PageHeader/>
                {content}
            </div>
        );
    }
}

export default AssignmentContainer;
