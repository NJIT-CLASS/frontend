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
            currentTaskIndex: 0,
            showAdvancedOptions: false
        };
    }

    showAdvancedOptions() {
        this.setState({showAdvancedOptions: true});
    }

    closeAdvancedOptionsModal() {
        this.setState({showAdvancedOptions: false});
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
                <SubTasksSidebarContainer/>
                <TaskDetails
                    task={this.state.currentTask.subtasks[0]}
                    showAdvancedOptions={this.showAdvancedOptions.bind(this)}
                />
                { advancedOptions }
            </div>
        );
    }
}

export default WorkflowDetailContainer;
