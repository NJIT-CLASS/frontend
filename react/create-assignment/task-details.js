import React from 'react';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import Select from 'react-select';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type:this.props.task.type
        };
    }
    createTask(){
        if(this.props.task.type == null){
            let newStuff = {
            name: this.refs.name.value,
            type: this.state.newType
            };
            this.props.updateTask(newStuff)

        }else{
            let task = {
                name: this.refs.name.value,
                type: this.refs.selectTool.refs.value,
                parent: this.props.task,
                subtasks: [],
                depth:parseInt(this.props.task.depth)+1
            };
            this.props.addTask(task);
        }
        
    }

    getType(e){
        console.log(e);
        this.setState({
            newType:e
        });
    }

    taskOption(prevT){
        switch(prevT){
            case null:
                return [
                    {value:TASK_TYPES.CREATE_PROBLEM, label:TASK_TYPE_TEXT.create_problem},
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.REVISE_AND_RESUBMIT, label:TASK_TYPE_TEXT.revise_and_resubmit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                    {value:TASK_TYPES.DISPUTE, label:TASK_TYPE_TEXT.dispute},
                    {value:TASK_TYPES.CONSOLIDATION, label:TASK_TYPE_TEXT.consolidation},
                    {value:TASK_TYPES.RESOLVE_DISPUTE, label:TASK_TYPE_TEXT.resolve_dispute}
                ];
                break;
            case TASK_TYPES.CREATE_PROBLEM: 
                return [
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                ];
                break;
            case TASK_TYPES.Grade_PROBLEM: 
                return [
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.REVISE_AND_RESUBMIT, label:TASK_TYPE_TEXT.revise_and_resubmit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                    {value:TASK_TYPES.DISPUTE, label:TASK_TYPE_TEXT.dispute},
                    {value:TASK_TYPES.RESOLVE_DISPUTE, label:TASK_TYPE_TEXT.resolve_dispute}
                    ]

                break;
            case TASK_TYPES.SOLVE_PROBLEM: 
                return [
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                    ]
                break;
            case TASK_TYPES.EDIT: 
                return[
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.REVISE_AND_RESUBMIT, label:TASK_TYPE_TEXT.revise_and_resubmit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                    ]                
                break;
            case TASK_TYPES.REVISE_AND_RESUBMIT: 
                return [
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.REVISE_AND_RESUBMIT, label:TASK_TYPE_TEXT.revise_and_resubmit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                ];
                break;
            case TASK_TYPES.CRITIQUE:
                return [
                    {value:TASK_TYPES.Grade_PROBLEM, label:TASK_TYPE_TEXT.grade_problem},
                    {value:TASK_TYPES.SOLVE_PROBLEM, label:TASK_TYPE_TEXT.solve_problem},
                    {value:TASK_TYPES.EDIT, label:TASK_TYPE_TEXT.edit},
                    {value:TASK_TYPES.REVISE_AND_RESUBMIT, label:TASK_TYPE_TEXT.revise_and_resubmit},
                    {value:TASK_TYPES.CRITIQUE, label:TASK_TYPE_TEXT.critique},
                    {value:TASK_TYPES.DISPUTE, label:TASK_TYPE_TEXT.dispute},
                    {value:TASK_TYPES.CONSOLIDATION, label:TASK_TYPE_TEXT.consolidation},
                    {value:TASK_TYPES.RESOLVE_DISPUTE, label:TASK_TYPE_TEXT.resolve_dispute}
                ];
                break;
        }
    }

	render(){
        const tasks = this.taskOption(this.props.task.type);
        let content = null;

        switch(this.state.type) {
            case null :
                content = (
                        <div>
                            <h3 className="title">{this.props.task.name}</h3>
                            <div className="section-content">
                                <label>Task Name</label>
                                <div>
                                    <input ref="name" type="text"/>
                                </div>
                                <div>
                                <Select
                                    ref = 'selectTool'
                                    name='Task Type'
                                    options={tasks}
                                    clearable={false}
                                    searchable={false}
                                    onChange = {this.getType.bind(this)}
                                    value = "Select ..."
                                />
                                </div>

                                <a className="link" onClick={this.props.showAdvancedOptions}>Advanced Options</a>
                                <div className="row" >
                                    <button onClick={this.createTask.bind(this)}>Create Task</button>
                                </div>
                            </div>
                        </div>
                        );
                break;
            case TASK_TYPES.CREATE_PROBLEM:
                content =(<div>
                        <h3 className="title">{this.props.task.type}</h3>
                        <div className="section-content">
                                <label> Name</label>
                                <div>
                                    <input ref="name" type="text"/>
                                </div>
                                <div>
                                <Select
                                    ref = 'selectTool'
                                    name='Task Type'
                                    options={tasks}
                                    clearable={false}
                                    searchable={false}
                                    onChange = {this.getType.bind(this)}
                                    value = "Select ..."
                                />
                                </div>

                                <a className="link" onClick={this.props.showAdvancedOptions}>Advanced Options</a>
                                <div className="row" >
                                    <button onClick={this.createTask.bind(this)}>Create Task</button>
                                </div>
                            </div>
                    </div>);
                break;
            case TASK_TYPES.Grade_PROBLEM:
                content =(<div>Grade_PROBLEM</div>);
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                content =(<div>SOLVE PROBLEM</div>);
                break;
            case TASK_TYPES.EDIT:
                content =(<div>EDIT</div>);
                break;
            case TASK_TYPES.REVISE_AND_RESUBMIT:
                content =(<div>REVISE AND RESUBMIT</div>);
                break; 
            case TASK_TYPES.CRITIQUE:
                content =(<div>CRITIQUE</div>);
                break; 
            case TASK_TYPES.DISPUTE:
                content =(<div>DISPUTE</div>);
                break;
            case TASK_TYPES.CONSOLIDATION:
                content =(<div>CONSOLIDATION</div>);
                break;
            case TASK_TYPES.RESOLVE_DISPUTE:
                content =(<div>RESOLVE_DISPUTE</div>);
                break;
        }


		return (
			<div className="container">
            	<div className="section">
                    {content}
            	</div>
            </div>
		)
	}
}

export default TaskDetails;
