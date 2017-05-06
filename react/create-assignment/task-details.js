import React from 'react';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../../server/utils/constants';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import request from 'request';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            assignmentDetail:[],
            type:this.props.task,
            currentTask: {
            name:null,
            desc:null,
            dueDate:null,
            taskAssignee:null,
            },
            dpChecked:false,
            showCreateSemesterModal: false,
            options:[
                {value: 'Student', label: 'Student'},
                {value: 'Instructor', label: 'Instructor'},
                {value: 'TA', label: 'TA'}
            ]
        };

    }
    reset(){
        window.location('/dashboard') ;
    }

createAssingment() {
    let Assingment = this.state.currentTask;
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/assignment/create',
            body: {
                Name: Assingment.name,
                Description: Assingment.desc,
                dueDate: Assingment.dueDate,
                taskAssignee: Assingment.taskAssignee
            },
            json: true
        };

        request(options, (err, res, body) => {
            // TODO: add error handling
            console.log("Result status code:", res.status);

        });
    }


    updateCTA(data,inputType){
        let task =this.state.currentTask;
        if(inputType === 'name'){
            task.name = data;
        }else if(inputType === 'desc'){
            task.desc = data;
        }else if(inputType === 'dueDate'){
            task.dueDate = data;
        }else if(inputType === 'taskAssignee'){
            task.taskAssignee = data;
        }

        this.setState({
            currentTask:task
        });
    }

    nextTask(){
        let assignmentDetail = this.state.assignmentDetail;
        assignmentDetail.push(this.state.currentTask);
        console.log(this.state.assignmentDetail);
        this.props.nextTask();

    }

    lastTask(){
        let assignmentDetail = this.state.assignmentDetail;
        assignmentDetail.push(this.state.currentTask);
        console.log(this.state.assignmentDetail);
        this.props.nextTask();

    }

    addThree(){
        let date = new Date();
        let newDate = date.getDate()+3;
        let correctMonth = date.getMonth()+1;
        if(newDate <10){
            newDate = '0'+newDate;
        }
        if(correctMonth < 10){
            correctMonth = '0'+correctMonth
        }
        let final = date.getFullYear()+"-"+correctMonth+"-"+newDate;
        this.updateCTA(final,'dueDate');
    }
    spDate(e){
        this.updateCTA(e.target.value,'dueDate');
    }
    getStud(e){
        this.updateCTA(e,'taskAssignee');
    }
    getName(e){
        this.updateCTA(e.target.value,'name');
    }
    getDesc(e){
        this.updateCTA(e.target.value,'desc');
    }


	render(){
        let content = null;

        switch(this.props.task) {
            case TASK_TYPES.CREATE_PROBLEM:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPES_TEXT.CREATE_PROBLEM}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" onChange={this.getName.bind(this)} name="name"  required>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.getDesc.bind(this)}  required>
                                </textarea>
                            </div>



                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>

                               <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Default : 3 Days</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.addThree.bind(this)} name="dueDate" type="radio"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Specific Date</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.spDate.bind(this)} name="field_startDate" id="field_startDate" type="date"></input>
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
                        name="taskAssignee"
                        onChange={this.getStud.bind(this)}
                        value=''
                        required
                        />
                         <div className="row">
                                <button onClick={this.nextTask.bind(this)}>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
                //this is what it shoiuld be ***TASK_TYPES.Grade_PROBLEM *** but because of time we had to just leave like this
            case "grade_problem":
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPES_TEXT.GRADE_PROBLEM}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" onChange={this.getName.bind(this)} name="name"  required>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.getDesc.bind(this)}  required>
                                </textarea>
                            </div>



                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>

                               <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Default : 3 Days</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.addThree.bind(this)} name="dueDate" type="radio"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Specific Date</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.spDate.bind(this)} name="field_startDate" id="field_startDate" type="date"></input>
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
                        name="taskAssignee"
                        onChange={this.getStud.bind(this)}
                        value=''
                        required
                        />
                         <div className="row">
                                <button onClick={this.nextTask.bind(this)}>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPES_TEXT.SOLVE_PROBLEM}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" onChange={this.getName.bind(this)} name="name"  required>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.getDesc.bind(this)}  required>
                                </textarea>
                            </div>



                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>

                               <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Default : 3 Days</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.addThree.bind(this)} name="dueDate" type="radio"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Specific Date</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.spDate.bind(this)} name="field_startDate" id="field_startDate" type="date"></input>
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
                        name="taskAssignee"
                        onChange={this.getStud.bind(this)}
                        value=''
                        required
                        />
                         <div className="row">
                                <button onClick={this.nextTask.bind(this)}>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
            case TASK_TYPES.EDIT:
                content =(<div>
                    <div className="section">
                        <h3 className="title">{TASK_TYPES_TEXT.EDIT}</h3>
                        <div className="section-content">
                            <label>Name</label>
                            <div>
                                <input type="text" onChange={this.getName.bind(this)} name="name"  required>
                                </input>
                            </div>

                            <label>Description</label>
                            <div>
                                <textarea name="desc" onChange={this.getDesc.bind(this)}  required>
                                </textarea>
                            </div>



                            </div>
                    </div>
                    <div className="section">
                        <h3 className="title">When is this task due ?</h3>
                        <div className="section-content">
                        <div>

                               <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Default : 3 Days</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.addThree.bind(this)} name="dueDate" type="radio"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="field_startDate">Specific Date</label>
                                        <div className="col-sm-10">
                                            <input className="form-control" onChange={this.spDate.bind(this)} name="field_startDate" id="field_startDate" type="date"></input>
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
                        name="taskAssignee"
                        onChange={this.getStud.bind(this)}
                        value=''
                        required
                        />
                         <div className="row">
                                <button onClick={this.lastTask.bind(this)}>Next</button>
                            </div>
                        </div>
                    </div>

                    </div>);
                break;
                case "done":
                    window.location.href = '/dashboard';
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
