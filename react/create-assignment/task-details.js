import React from 'react';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import request from 'request';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            type:this.props.type,
            currentTask:null,
            dpChecked:false,
            showCreateSemesterModal: false,
            options:[
                {value: 'Student', label: 'Student'},
                {value: 'Instructor', label: 'Instructor'},
                {value: 'TA', label: 'TA'}
            ]
        };
    }

    
    updateCTA(data,inputType){
        let task = {
            name:null,
            desc:null,
            dueDate:null,
            taskAssignee:null,
        }
        if(inputType === 'name'){
            task.name = data;
        }else if(inputType === 'desc'){
            task.desc = data;
        }else if(inputType === 'dueDate'){
            task.dueDate = data;
        }else if(inputType === 'taskAssignee'){
            task.taskAssignee = data;
        }


    }
    nextTask(){
        this.props.nextTask();
    }
    

	render(){
        let content = null;

        switch(this.state.type) {
            case TASK_TYPES.CREATE_PROBLEM:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPE_TEXT.create_problem}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" name="name" onChange={this.textUpdate.bind(this)} required>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.textUpdate.bind(this)} required>
                                </textarea>
                            </div>                            
                           


                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>
                                <div>
                                    <div>
                                        <p>Default: 3 days</p>
                                        <input type='radio' name='dueDate' required/>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label col-sm-2" for="field_startDate">Start Date</label>
                                        <div class="col-sm-10">
                                            <input class="form-control" name="field_startDate" ref="field_startDate" id="field_startDate" type="date" required></input>
                                        </div>
                                    </div>
                                </div>

                                </div>
                                </div>
                    </div>
                    <div className="section">
                        <h3 className="title">Who can complete this task?</h3>
                        <div className="section-content">
                        <Select
                        options={this.state.options}
                        clearable={false}
                        searchable={false}
                        onChange={this.selectUpdate.bind(this)}
                        name="assign"
                        required
                        />
                         <div className="row">
                                <button onClick={this.nextTask.bind(this)}>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
            case TASK_TYPES.Grade_PROBLEM:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPE_TEXT.grade_problem}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" name="name" onChange={this.textUpdate.bind(this)}>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.textUpdate.bind(this)}>
                                </textarea>
                            </div>                            
                           


                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>
                                <div>
                                    <div>
                                        <p>Default: 3 days</p>
                                        <input type='radio' onChange={this.rmDP} name='dueDate'/>
                                    </div>
                                    <div>
                                        <p>Specific Date</p>
                                        <input type='radio' onChange={this.showDP} name='dueDate'/>
                                    </div>
                                </div>

                                </div>
                                </div>
                    </div>
                    <div className="section">
                        <h3 className="title">Who can complete this task?</h3>
                        <div className="section-content">
                        <Select
                        options={this.state.options}
                        clearable={false}
                        searchable={false}
                        onChange={this.selectUpdate.bind(this)}
                        name="assign"
                        />
                         <div className="row">
                                <button>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPE_TEXT.solve_problem}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" name="name" onChange={this.textUpdate.bind(this)}>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.textUpdate.bind(this)}>
                                </textarea>
                            </div>                            
                           


                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>
                                <div>
                                    <div>
                                        <p>Default: 3 days</p>
                                        <input type='radio' onChange={this.rmDP} name='dueDate'/>
                                    </div>
                                    <div>
                                        <p>Specific Date</p>
                                        <input type='radio' onChange={this.showDP} name='dueDate'/>
                                    </div>
                                </div>

                                </div>
                                </div>
                    </div>
                    <div className="section">
                        <h3 className="title">Who can complete this task?</h3>
                        <div className="section-content">
                        <Select
                        options={this.state.options}
                        clearable={false}
                        searchable={false}
                        onChange={this.selectUpdate.bind(this)}
                        name="assign"
                        />
                         <div className="row">
                                <button>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
            case TASK_TYPES.EDIT:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPE_TEXT.edit}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" name="name" onChange={this.textUpdate.bind(this)}>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.textUpdate.bind(this)}>
                                </textarea>
                            </div>                            
                           


                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>
                                <div>
                                    <div>
                                        <p>Default: 3 days</p>
                                        <input type='radio' onChange={this.rmDP} name='dueDate'/>
                                    </div>
                                    <div>
                                        <p>Specific Date</p>
                                        <input type='radio' onChange={this.showDP} name='dueDate'/>
                                    </div>
                                </div>

                                </div>
                                </div>
                    </div>
                    <div className="section">
                        <h3 className="title">Who can complete this task?</h3>
                        <div className="section-content">
                        <Select
                        options={this.state.options}
                        clearable={false}
                        searchable={false}
                        onChange={this.selectUpdate.bind(this)}
                        name="assign"
                        />
                         <div className="row">
                                <button>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break; 
        }


		return (
			<div className="container">
                    {content}
            </div>
		)
	}
}

export default TaskDetails;
