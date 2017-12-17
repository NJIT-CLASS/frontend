import React from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import ReactTable from 'react-table';
import Collapsible from 'react-collapsible';

class InstructorGradeReport extends React.Component {

    constructor(props) {
        super(props);

        var componentData = {
            userID: props.UserID,
            sectionID: null,
            sections:[],
            assignments:{},
            assignmentDetails:{},
            enrolledStudents:{}
        };

        this.state = {
            loadedOverviewDetails:false,
            loadedAssignmentDetails:false,
            loaded: false,
            error:null
        };
    }

    componentDidMount() {
        this.getSections(this.componentData.userID);
    }

    getSections(userID){
        apiCall.get(`/SectionsByUser/${this.componentData.userID}`,{},(err,status,body)=>{
        //apiCall.get(`/sections/instructor/${this.componentData.userID}`,{},(err,status,body)=>{

            if(status.statusCode === 200){
                if(Object.keys(body.Sections).length === 0){
                    this.setState({loaded:true});
                } else {
                    componentData.sections = body.Sections;
                    this.getAssignmentsBySection(body.Sections);
                }
            } else {
                this.setState({error:notification("error form-error","Unable to retrieve sections, please wait and try again.")})
            }
        });
    }

    getAssignmentsBySection(sections){
        var numSections = Object.keys(sections).length;

        sections.forEach(section=>{
            var sectionID = section.SectionID;
            apiCall.get(`/getActiveAssignmentsForSection/${sectionID}`,{},(err,status,body)=>{

                if(status.statusCode == 200){
                    this.componentData.assignments[sectionID]=body.Assignments;
                    // Calling setState on the last iteration through sections, preventing unecessary re-rendering
                    if(Object.keys(this.componentData.assignments).length === numSections){
                        this.setState({loaded:true});
                    }
                } else {
                    this.setState({error:notification("error form-error","Unable to retrieve assignments, please wait and try again.")})
                }
            });
        });        
    }

    getAssignmentsByStudent(sectionID){

        if(this.componentData.assignments[sectionID].length === 0){
            this.setState({loadedOverviewDetails:true,loadedAssignmentDetails:false});
            return;
        }

        this.componentData.assignments[sectionID].forEach(assignment => {
            apiCall.post(`/getAssignmentGrades/${assignment.AssignmentInstanceID}`,{},(err,status,body)=>{
                body.SectionUsers.forEach(user => {
                    this.componentData.enrolledStudents[user.UserID].gradedAssignments.push({assignmentName:body.AssignmentInstance.Assignment.DisplayName,assignmentGrade:user.assignmentGrade.Grade});
                });
                this.setState({loadedOverviewDetails:true,loadedAssignmentDetails:false});
            });
        });
    }

    overviewOnClick(sectionID){
        this.componentData.sectionID = sectionID;

        apiCall.get(`/course/getsection/${sectionID}`,{},(err,status,body)=>{
            this.componentData.enrolledStudents = {};

            body.UserSection.forEach(user=>{
                if(user.Role === "Student"){
                    user["gradedAssignments"] = [];
                    this.componentData.enrolledStudents[user.UserID]=user;
                }
            });

            this.getAssignmentsByStudent(sectionID);
        });
    }

    assignmentOnClick(AssignmentInstanceID){
        apiCall.post(`/getAssignmentGrades/${AssignmentInstanceID}`,{},(err,status,body)=>{
            this.componentData.assignmentDetails = body;
            this.setState({loadedAssignmentDetails:true,loadedOverviewDetails:false});
        });
    }

    notification(classType, message){
        return (
            <div className={classType} role="alert">
                <i className="fa fa-exclamation-circle"></i>
                {message}
            </div>
        );
    }

    render(){

        let sections = this.componentData.sections;
        let assignments = this.componentData.assignments;
        let assignmentDetails = this.componentData.assignmentDetails;
        let loaded = this.state.loaded;
        let loadedAssignmentDetails = this.state.loadedAssignmentDetails;
        let loadedOverviewDetails = this.state.loadedOverviewDetails;
        let error = this.state.error;
        let tableHeader = (<h2 className="title">Assignment Details</h2>);
        let tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight"resizable={true}
                            columns={[
                            {Header: "",accessor: 'Assignment'},
                            {Header: "",accessor: 'Type'},
                            {Header: "",accessor: 'Course',},
                            {Header: "",accessor: 'Date',}
                        ]} noDataText="Please choose an assignment or overview"/>);

        //Make sure component has loaded
        if(!loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        //Build table for assignment Details
        if(loadedAssignmentDetails){
            var nestedTables = [];
            
            //Begin mapping users for this section
            const tableData = assignmentDetails.SectionUsers.map( user => {

                if(!user.assignmentGrade){
                    return null;
                }

                var regularGrades = [];
                var extraCreditGrades = [];
                const workflowActivityGradesView = user.assignmentGrade.WorkflowActivityGrades.map( waGrade => {

                    waGrade.WorkflowActivity.users_WA_Tasks.forEach( task => {
                        
                        if(task.IsExtraCredit){
                            extraCreditGrades.push(<tr>
                                <td>{task.taskActivity.DisplayName}</td><td></td><td></td><td></td><td></td><td>{task.Grade}</td><td>{task.Comments}</td>
                            </tr>);
                        } else {
                            regularGrades.push(<tr>
                                <td>{task.taskActivity.DisplayName}</td><td></td><td></td><td></td><td></td><td>{task.Grade}</td><td>{task.Comments}</td>
                            </tr>);
                        }
                    });
                });

                if(regularGrades.length == 0){
                    regularGrades.push(<tr><td>No tasks completed</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>);
                }

                if(extraCreditGrades.length == 0){
                    extraCreditGrades.push(<tr><td>No extra credit tasks</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>);
                }

                nestedTables.push( 
                    <table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr><th>Regular Tasks</th><th>Completeness Grade</th><th>Completeness Weight</th><th>Quality Grade</th><th>Quality Weight</th><th>Weighted Grade</th><th>Comments</th></tr>
                        </thead>
                        <tbody>
                            {regularGrades}
                        </tbody>
                        <thead>
                            <tr><th>Extra Credit Tasks</th><th>Completeness Grade</th><th>Completeness Weight</th><th>Quality Grade</th><th>Quality Weight</th><th>Weighted Grade</th><th>Comments</th></tr>
                        </thead>
                        <tbody>
                            {extraCreditGrades}
                        </tbody>
                    </table>);

                return {
                    firstName: user.User.FirstName,
                    lastName: user.User.LastName,
                    email:user.User.UserContact.Email,
                    grade:user.assignmentGrade.Grade
                };
            });

            let assignmentName = assignmentDetails.AssignmentInstance.Assignment.DisplayName;
            let section = assignmentDetails.AssignmentInstance.Section.Course.Number + " " + assignmentDetails.AssignmentInstance.Section.Course.Name + " " + assignmentDetails.AssignmentInstance.Section.Name;
            tableHeader = (<div><h2 className="title">{section} <br/> Assignment: {assignmentName}</h2></div>);
            tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true} data={tableData}
                    columns={[
                        {Header: "First Name",accessor: 'firstName'},
                        {Header: "Last Name",accessor: 'lastName'},
                        {Header: "Email",accessor: 'email'},
                        {Header: "Final Grade",accessor: 'grade'}
                    ]} 
                    noDataText="Please choose an assignment or overview"
                    SubComponent={(row) => { console.log(row); return nestedTables[row.index]; }}
                    />);

        } //Build table for overview details
        else if(loadedOverviewDetails){
            
            let overviewEntries = [];
            let nestedTables = [];
            for(var studentID in this.componentData.enrolledStudents){
                 overviewEntries.push({firstName:this.componentData.enrolledStudents[studentID].User.FirstName,lastName:this.componentData.enrolledStudents[studentID].User.LastName});

                 var nestedTableRows = [];
                 this.componentData.enrolledStudents[studentID].gradedAssignments.forEach(assignment=>{
                     nestedTableRows.push((<tr><td>{assignment.assignmentName}</td><td></td><td>{assignment.assignmentGrade}</td></tr>));
                 });

                nestedTables.push( 
                    <table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr>
                                <th>Assignment</th><th>Weight</th><th>Final Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nestedTableRows}
                        </tbody>
                    </table>);

            }

            var sectionName = "";
            sections.forEach(section=>{
                if(section.SectionID === this.componentData.sectionID){
                    sectionName = section.Section.Course.Number + " " + section.Section.Course.Name + " " + section.Section.Name;
                }
            });

            tableHeader = (<div><h2 className="title">{sectionName}<br/>Student Overview</h2></div>);

            tableView = (<ReactTable
            defaultPageSize={10}
            className="-striped -highlight"
            resizable={true}
            data={overviewEntries}
            columns={[
                {
                    Header: "First Name",
                    accessor: 'firstName',
                },
                {
                    Header: "Last Name",
                    accessor: 'lastName'
                }
            ]} 
            noDataText="Please choose an assignment or overview"
            SubComponent={(row) => {return nestedTables[row.index]; }}
            />);
        }


        // Sections listing in the top portion of the page, nested contents are created here too
        let sectionList = null;

        if(sections.length === 0){
            sectionList = (<h3>No sections available</h3>);
        } else {

            sectionList = sections.map(section=>{
                
                let sectionName = section.Section.Course.Number + "  "+ section.Section.Name+"  " + section.Section.Course.Name;
                let sectionID = section.SectionID;
                let sectionAssignments = assignments[sectionID];

                let nestedOverview = (<li className="select-class-element"><a href="#" onClick={this.overviewOnClick.bind(this,sectionID)}>Student Overview</a></li>);
                let nestedAssignments = sectionAssignments.map(assignment => {
                    return(<li className="select-class-element"><a href="#" onClick={this.assignmentOnClick.bind(this,assignment.AssignmentInstanceID)}>{assignment.Assignment.DisplayName}</a></li>);
                });

                return(<Collapsible trigger={sectionName} transitionTime="200" className="select-class" openedClassName="select-class">
                        {nestedOverview}
                        {nestedAssignments}
                    </Collapsible>
                )
            });
        }

        //Actual Content returned
        return(
                <form name="grade_report" role="form" className="section" method="post">
                    <div className="section-content">
                        <div className="section">
                            <h2 className="title">Select a Section:</h2>
                                {error}
                            <div className="section-content">
                                {sectionList}
                            </div>
                        </div>
                        <div className="section card-2 sectionTable">
                            {tableHeader}
                            <div className="section-content">
                                {tableView}
                            </div>
                        </div>
                    </div>
                </form>
        );
    }
}

export default InstructorGradeReport;
