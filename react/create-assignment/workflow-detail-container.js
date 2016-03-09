import React from 'react';
import TaskForm from './task-form';

class WorkflowDetailContainer extends React.Component {
    render() {
        return (
            <div className="assignment-workflow-details">
                <TaskForm/>
            </div>
        );
    }
}

export default WorkflowDetailContainer;
