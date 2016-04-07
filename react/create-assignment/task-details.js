import React from 'react';
import { TASK_TYPES } from '../shared/constants';

class TaskDetails extends React.Component {
    createTask(){
        let task = {
            type: TASK_TYPES.CREATE_PROBLEM,
            parent: this.props.task,
            subtasks: [],
            depth:parseInt(this.props.task.depth)+1
        };
        this.props.addTask(task);
    }

	render(){

		return (
			<div className="container">
            	<div className="section">
                    <h3 className="title">{this.props.task.name}</h3>
            		<div className="section-content">
                        <label>Task Name</label>
                        <div>
                            <input type="text"></input>
                        </div>

                        <a className="link" onClick={this.props.showAdvancedOptions}>Advanced Options</a>
                        <div className="row" >
                            <button onClick={this.createTask.bind(this)}>Create Task</button>
                        </div>
                     </div>
            	</div>
            </div>
		)
	}
}

export default TaskDetails;
