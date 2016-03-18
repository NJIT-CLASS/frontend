import React from 'react';
import TaskDetails from './task-details';
import SubTasksSidebarContainer from './sub-tasks-sidebar-container';
import Modal from './modal';

class WorkflowDetailContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previousTask: null,
            currentTask: this.props.workflow.task
            currentTaskIndex: 0
        };
    }

    switchTask() {

    }

    render() {
        let previousTaskSidebar = null;

        if (this.state.currentTask) {
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
                    task={this.state.currentTask.subtasks[0]}
                />
            </div>
        );
    }
}

export default WorkflowDetailContainer;
