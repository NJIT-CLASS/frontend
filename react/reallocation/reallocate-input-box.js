import React from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';
import Select from 'react-select';

let parse = require('csv-parse/lib/sync');

export default class Reallocate extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mode: 'list',
            selected: 'task',
            reallocateOptions: 'volunteers',
            selectedStudents: [],
            students: []
        };
    }

    componentWillMount(){
        this.fetchStudents();
    }

    fetchStudents(props = null){
        if (!props) {
            props = this.props;
        }

        apiCall.get(`/course/getsection/${props.SectionID}`, (err, res, body) => {
            console.log(body);
            let students = [];

            body.UserSection.map((student) => {
                if(student.Active){
                    students.push({
                        'label':`${student.User.FirstName} ${student.User.LastName}`,
                        'value': student.UserID
                    });
                }
            });

            this.setState({
                students: students
            });
        });
    }

    handleChange(e){
        this.setState({
            selected: e.target.name
        });
    }

    handleSelect(val){
        this.setState({
            selectedStudents: val //val is array
        });
    }

    changeToList(){
        this.setState({
            mode: 'list'
        });

        this.reallocate();
    }

    changeToOptions(){
        this.setState({
            mode: 'options'
        });

        this.reallocate();
    }

    changeReallocateOptions(e){
        this.setState({
            reallocateOptions: e.target.name
        });
    }

    onCSVInput(event) {
        this.setState({
            csv: event.target.value
        });
    }

    parseCSV(){
        let tasks = parse(this.state.csv, {
            trim: true,
            skip_empty_lines: true,
            relax_column_count: true
        });
        return tasks;
    }


    

    reallocate(){
        if(this.state.selected === 'task'){
            let tasks = this.parseCSV();
            this.reallocate_tasks(tasks);
        } else if(this.state.selected === 'user'){
            this.reallocate_users();
        } else {

        }
    }

    reallocate_tasks(tasks){
        let options;
        if (this.state.mode === 'options'){
            options = {
                tasks: tasks,
                users: [],
                sectionID: this.props.SectionID,
                option: this.state.reallocateOptions
            };
        } else {
            options = {
                tasks: tasks,
                users: this.selectedStudents,
                sectionID: this.props.SectionID,
                option: null
            };
        }

        apiCall.post('/reallocate/tasks', options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                console.log('error', body.Error);
                console.log('message', body.Message);
            } else {
                console.log('Submit failed');
            }
        });
    }

    reallocate_users(){

    }

    renderInputBoxOrSelect(){

        if(this.state.selected === 'task'){
            return (
                <div>
                    <br/><br/>
                    <h5 className='list-faded-subheader'>Reallocate tasks with Task IDs</h5>
                    <textarea rows={10} onChange={this.onCSVInput.bind(this)} placeholder='Enter a list of task IDs to reallocate...'/>
                    <br/><br/><br/>
                    {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

                    <h5 className='list-faded-subheader'>List of students to replace tasks</h5>
                    <Select multi joinValues options={this.state.students} value={this.state.selectedStudents} placeholder="Selected" onChange={this.handleSelect.bind(this)} resetValue={''} clearable={true} searchable={true}/>
                    <br/><br/>

                    <button type="button" onClick={this.changeToList.bind(this)}>Submit</button>  

                    {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

                    <h5 className='list-faded-subheader'>Or select one of the following to reallocate</h5>
                    <div>
                        <input style={{display: 'inline-block', float:'left'}} type="radio" name="volunteers" checked={this.state.reallocateOptions === 'volunteers'} onChange={this.changeReallocateOptions.bind(this)}/>
                        <label>Volunteers</label>
                    </div>

                    <div>
                        <input style={{display: 'inline-block', float:'left'}} type="radio" name="students" checked={this.state.reallocateOptions === 'students'} onChange={this.changeReallocateOptions.bind(this)}/>  
                        <label>Students</label>       
                    </div>

                    <div>
                        <input style={{display: 'inline-block', float:'left'}} type="radio" name="instructor" checked={this.state.reallocateOptions === 'instructor'} onChange={this.changeReallocateOptions.bind(this)}/>  
                        <label>Instructor</label>       
                    </div>
                    <br/><br/>

                    <button type="button" onClick={this.changeToOptions.bind(this)}>Submit</button>                
                </div>
            );
        } else {
            return (
                <div>
                    <br/><br/>
                    <h5 className='list-faded-subheader'>Students</h5>
                    <Select multi joinValues options={this.state.students} value={this.state.selectedStudents} placeholder="Selected" onChange={this.handleSelect.bind(this)} resetValue={''} clearable={true} searchable={true}/> 
                    <br/><br/>
                    <button type="button" onClick={this.reallocate.bind(this)}>Submit</button>   
                </div>
            );
        }
    }

    render(){
        return (
            <div >
                <h2 className='title'>Re-assign Task</h2>
                <br/>
                <div>
                    <input style={{display: 'inline-block', float:'left'}} type="radio" name="task" checked={this.state.selected === 'task'} onChange={this.handleChange.bind(this)}/>
                    <label>Select By Task</label>
                </div>

                <div>
                    <input style={{display: 'inline-block', float:'left'}} type="radio" name="user" checked={this.state.selected === 'user'} onChange={this.handleChange.bind(this)}/>  
                    <label>Select By User</label>       
                </div>
                
                {this.renderInputBoxOrSelect()}
                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}