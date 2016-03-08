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
            visibleWorkflowIndex: null,
            newWorkflowShowing: false
        };
    }

    selectWorkflow(index=null) {
        this.setState({
            visibleWorkflowIndex: index,
            newWorkflowShowing: true
        });
    }

    createWorkflow(index, workflow) {
        this.setState((previousState) => {
            let workflows = previousState.workflows;

            if (index !== null) {
                workflows[index] = workflow;
            }
            else {
                workflows.push(workflow);
            }

            return {
                workflows: workflows,
                visibleWorkflowIndex: null,
                newWorkflowShowing: false
            };
        });
    }

    render() {
        let content = null;

        if (this.state.visibleWorkflowIndex === null && !this.state.newWorkflowShowing) {
            content = (
                <DetailsContainer
                    assignmentDetails={this.state.assignmentDetails}
                    workflows={this.state.workflows}
                    selectWorkflow={this.selectWorkflow.bind(this)}
                />
            );
        }
        else {
            content = (
                <WorkflowDetailContainer
                    workflow={this.state.workflows[this.state.visibleWorkflowIndex]}
                    createWorkflow={this.createWorkflow.bind(this, this.state.visibleWorkflowIndex)}
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