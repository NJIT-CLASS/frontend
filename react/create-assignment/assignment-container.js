import React from 'react';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
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
    createWorkflow(){
        let createProbTask = {
            type:TASK_TYPES.CREATE_PROBLEM,
            name:null,            
            taDue:null,
            taStart:null,
            taEnd:'late',
            taDesc:null,
            taAssign:null,
            taInstruction:null,
            taID:null,
            waID:null,
        };
        let solveProbTask = {
            type:TASK_TYPES.SOLVE_PROBLEM,
            name:null,            
            taDue:null,
            taStart:null,
            taEnd:'late',
            taDesc:null,
            taAssign:null,
            taInstruction:null,
            taID:null,
            waID:null,
        };
        let editProbTask = {
            type:TASK_TYPES.EDIT,
            name:null,            
            taDue:null,
            taStart:null,
            taEnd:'late',
            taDesc:null,
            taAssign:null,
            taInstruction:null,
            taID:null,
            waID:null,
        };
        let gradeProbTask = {
            type:TASK_TYPES.GRADE_PROBLEM,
            name:null,            
            taDue:null,
            taStart:null,
            taEnd:'late',
            taDesc:null,
            taAssign:null,
            taInstruction:null,
            taID:null,
            waID:null,
        };
        let workflows = [createProbTask,solveProbTask,editProbTask,gradeProbTask];
        this.setState({
            workflows : workflows,
            visibleWorkflowIndex: 0            
        })
    }

    changeWorkflow(){
        let oldIndex = this.state.visibleWorkflowIndex;
        this.setState({
            visibleWorkflowIndex: oldIndex + 1
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
                    changeWorkflow = {this.changeWorkflow.bind(this)}
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
