import React from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export default class Reallocate extends React.Component{
    constructor(props){
        super(props);
        this.state={
            ExtraCredit: false,
            RemoveStudent: false
        };
    }

    selectStudent(val){
        this.setState({
            selected:val
        });
    }

    setExtraCredit(){
        this.setState({
            ExtraCredit: !this.state.ExtraCredit
        });
    }

    setRemoveStudent(){
        this.setState({
            RemoveStudent: !this.state.RemoveStudent
        });
    }

    getOptions() {
        let students = [];
        this.props.students.map((student) => {
            if(student.UserID !== this.state.selected){
                students.push({
                    'label': `${student.User.FirstName} ${student.User.LastName}`,
                    'value': student.UserID
                });
            }
        });

        return students;
    }

    reallocateStudent(){
        let options = {
            ti_id: this.props.selected.TaskInstanceID,
            user_id: this.state.selected.value,
            isExtraCredit: this.state.ExtraCredit
        };

        apiCall.post('/reallocate/task_to_user', options, (err, res, body) => {
            console.log(body);
            if(body.Error){
                alert(body.Message);
            }
        });

        this.props.change();
    }


    render(){
        let options = this.getOptions();
        return (
            <div>
                <Select options={options} value={this.state.selected} onChange={this.selectStudent.bind(this)} placeholder="Selected"/>
                <br/><br/><br/>
                <button type="button" onClick={this.reallocateStudent.bind(this)}>Reallocate</button>
                <input id="checkBox" type="checkbox" name="extra_credit" onChange={this.setExtraCredit.bind(this)}/> Extra Credit <br/>
                <input id="checkBox" type="checkbox" name="remove_student_from_assignment" onChange={this.setRemoveStudent.bind(this)}/> Remove Student From Assignment <br/>   
                <br/><br/>             
            </div>
        );
    }
}