import React, { Component } from 'react';
import Modal from '../shared/modal';
import Select from 'react-select';
import apiCall from '../shared/apiCall';

export default class ReallocationModal extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            loaded:false,
            sectionID:null,
            close:this.props.close,
            title:props.title,
            reallocationMethod:null,
            showStudentsSelect:null,
            students:null,
            studentSelected:null,
            isExtraCredit:false
        };
    }

    componentWillMount() {
        apiCall.post('/getSectionByAssignmentInstance',{assignmentInstanceID:this.props.AssignmentID},(err, status, body)=>{
            console.log(body);
            this.setState({sectionID:body.SectionID, loaded:true});
        });
    }

    reallcationSelectChange(newVal){
        var val = newVal.value;
        if(val==="byUser"){
            this.getStudents(val);
        }
        else if(val === "byVolunteer"){
            this.setState({reallocationMethod:val});
        }
    }

    getStudents(val){
        apiCall.get(`/course/getsection/${this.state.sectionID}`,{},(err,status,body)=>{
            this.setState({students:body.UserSection.filter( user => !user.active),reallocationMethod:val})
        });
    }

    studentSelectOnchange(newVal){
        this.setState({studentSelected:newVal.value});
    }

    extraCreditOnlick(){
        this.setState({isExtraCredit:!this.state.isExtraCredit});
    }

    submit(){
        if(this.state.reallocationMethod === "byUser"){
            console.log(this.props.taskInstanceID);
            console.log(this.state.studentSelected);
            console.log(this.state.isExtraCredit);
            apiCall.post('/reallocate/task_to_user/',{ti_id:this.props.taskInstanceID, user_id:this.state.studentSelected,isExtraCredit:this.state.isExtraCredit},(err, status, body)=>{
                console.log(body);
            });
        }
        else if(this.state.reallocationMethod === "byVolunteer"){
            apiCall.post(`/volunteerpool/section/${this.state.sectionID}`,{},(err, status, body)=>{
                console.log(body);
            });
        }

    }

    render(){
        let title = this.state.title;
        var studentSelect=null;
        let modalContent = null;

        if(!this.state.Loaded){
            modalContent = (<div></div>);
        }

        if(this.state.reallocationMethod === "byUser"){

            var options = this.state.students.map(student =>{
                return {
                    value:student.UserID,
                    label:student.User.FirstName+" "+student.User.LastName
                }
            });

            studentSelect = (<li><p>Select user</p><Select clearable={false} options={options} onChange={this.studentSelectOnchange.bind(this)} value={this.state.studentSelected}/></li>)

            console.log(this.state.students);
        }

        modalContent = (<form role="form" className="section">
        <ul>
            <li><p>Reallocate using: </p><Select onChange={this.reallcationSelectChange.bind(this)} value={this.state.reallocationMethod} clearable={false} options={[{value:"byUser",label:"Select student"},{value:"byVolunteer",label:"Use volunteeer pool"}]} /></li>
            {studentSelect}
            <li><p>Mark as extra credit: </p><input type="checkbox" checked={this.state.isExtraCredit} onClick={this.extraCreditOnlick.bind(this)}></input></li>
            <li><button type="button" onClick={this.submit.bind(this)}>Submit</button></li>
        </ul>
        </form>)
        return (<Modal title={title} close={this.state.close.bind(this)} children={modalContent}></Modal>);
    }
}