import React from 'react';
import UpdatedGradeReport from './student-grade-report';
import InstructorGradeReport from './instructor-grade-report';
import apiCall from '../shared/apiCall';


class GradeReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userID: props.UserID,
            instructor: false,
            student: false,
            loaded: false
        };
    }

    componentDidMount() {
        this.determineRole(this.state.userID);
    }

    determineRole(userID){
        apiCall.get(`/generalUser/${userID}`,{},(err,status,body)=>{
            let isInstructor = body.User.Instructor;
            let isAdmin = body.User.Admin;
            if(isInstructor){
                this.setState({instructor:true, loaded:true});
            }
            else{
                this.setState({student:true, loaded:true});
            }
        });
    }

    render(){
        let gradeReport;

        if(!this.state.loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        if(this.state.instructor){
            gradeReport = (<InstructorGradeReport UserID={this.state.userID}/>);
        }

        gradeReport = (<UpdatedGradeReport UserID={this.state.userID}/>);      
        

        return(
            <div>
                {gradeReport}
            </div>
        );
    }
}

export default GradeReport;
