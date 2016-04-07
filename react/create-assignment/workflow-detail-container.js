import React from 'react';

import TaskDetails from './task-details';
import SubTasksSidebarContainer from './sub-tasks-sidebar-container';
import Modal from '../shared/modal';

import Select from 'react-select';

class WorkflowDetailContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previousTask: null,
            currentTask: this.props.workflow.task,
            showAdvancedOptions: false,
            depth:this.props.workflow.task.depth,
            subtaskIndex: 0
        };
    }

    showAdvancedOptions() {
        this.setState({showAdvancedOptions: true});
    }

    closeAdvancedOptionsModal() {
        this.setState({showAdvancedOptions: false});
    }

    addTask(task){
        debugger
        let depth = 0;
        let index = 0;
        let workflow = this.props.workflow;
        if(workflow.task.depth === this.state.depth){
            workflow.task.subtasks.push(task);
            depth=1;
        }else{
            let parentTask = workflow.task;
            let currentTask = workflow.task.subtasks[0];
            while(currentTask.depth != this.state.depth){
                parentTask = currentTask;
                currentTask = currentTask.subtasks[0];
            }
            depth = currentTask.depth;
            index = parentTask.subtasks[this.state.subtaskIndex].subtasks.length
            parentTask.subtasks[this.state.subtaskIndex].subtasks.push(task);
        }
        this.props.changeWorkflow(workflow);
        debugger
        this.setState({
            currentTask:task,
            depth : depth,
            subtaskIndex : index
        });
    }

    render() {
        let previousTaskSidebar = null;
        let advancedOptions = null;

        let taskCompleters = [
            {value: 'Student', label: 'Student'},
            {value: 'Instructor', label: 'Instructor'}
        ];

        if (this.state.showAdvancedOptions) {
            advancedOptions = (
                <Modal
                    title="Advanced Options"
                    close={this.closeAdvancedOptionsModal.bind(this)}
                >
                    <label>Who Does this task</label>
                    <Select
                        options={taskCompleters}
                        clearable={false}
                        searchable={false}
                    />
                    <div>
                        <label>Instructions</label>
                    </div>
                    <textarea></textarea>
                    <div className="row">
                        <button type="button">Save</button>
                    </div>
                </Modal>
            );
        }

        if (this.state.previousTask) {
            previousTaskSidebar = (
                <SubTasksSidebarContainer
                    task={this.state.currentTask}
                    currentTaskIndex={this.state.currentTaskIndex}
                />
            );
        }

        return (
            <div className="assignment-workflow-details">
                { previousTaskSidebar }
                
                <TaskDetails
                    task={this.state.currentTask}
                    showAdvancedOptions={this.showAdvancedOptions.bind(this)}
                    addTask = {this.addTask.bind(this)}
                />
                { advancedOptions }
            </div>
        );
    }
}

export default WorkflowDetailContainer;
