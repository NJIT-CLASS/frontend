import React from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import ReactTable from 'react-table';
import Collapsible from 'react-collapsible';
import TableComponent from '../shared/tableComponent';
import Workbook from 'react-excel-workbook';


class UpdatedGradeReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            userID: props.UserID,
            instructorSections:[],
            studentSections:[],
            displayedSection:{
                type:null,
                sectionData:null
            }
        };
    }

    componentDidMount() {
        this.getSections(this.state.userID);
    }

    getSections(userID){
        apiCall.get(`/SectionsByUser/${userID}`,{},(err,status,body)=>{
            if(status.statusCode === 200){
                body.Sections.forEach(section=>{this.getAssignments(section,body.Sections.length)});
            }
        });
    }

    getAssignments(section,numSections){
        apiCall.get(`/getActiveAssignmentsForSection/${section.SectionID}`,{},(err,status,body)=>{
            if(status.statusCode===200){
                section["assignments"]=body.Assignments;
                if(section.Role==="Instructor"){
                    this.state.instructorSections.push(section);
                }
                else if(section.Role==="Student"){
                    this.state.studentSections.push(section);
                }
                if(numSections===this.state.instructorSections.length + this.state.studentSections.length){
                    this.setState({loaded:true});
                }
            }
        });     
    }

    createCollapsableMenu(section, overviewOnclick, assignmentOnclick){
        let sectionName = section.Section.Course.Number + "  "+ section.Section.Name+"  " + section.Section.Course.Name;
        let sectionID = section.SectionID;

        let nestedOverview = (<li className="select-class-element"><a href="#" onClick={overviewOnclick}>Student Overview</a></li>);
        var nestedAssignments = section.assignments.map(assignment=>{
            return(<li className="select-class-element"><a href="#" onClick={assignmentOnclick.bind(this,assignment.AssignmentInstanceID)}>{assignment.Assignment.DisplayName}</a></li>);
        });

        return(<Collapsible trigger={sectionName} transitionTime={200} className="select-class" openedClassName="select-class">
                    {nestedOverview}
                    {nestedAssignments}
                </Collapsible>
        )

    }

    instructorOverViewOnClick(section){
        this.state.displayedSection.type="instructorOverview";
        this.state.displayedSection.sectionData=section;
        this.state.displayedSection.sectionData["students"]={};

        apiCall.get(`/course/getsection/${section.SectionID}`,{},(err,status,body)=>{

            body.UserSection.forEach(user=>{
                if(user.Role === "Student"){
                    user["gradedAssignments"] = [];
                    this.state.displayedSection.sectionData.students[user.UserID]=user;
                }
            });

            this.getAssignmentsByStudent();
        });
    }

    getAssignmentsByStudent(){
        this.state.displayedSection.sectionData.assignments.forEach(assignment => {
            apiCall.post(`/getAssignmentGrades/${assignment.AssignmentInstanceID}`,{},(err,status,body)=>{
                body.SectionUsers.forEach(user => {
                    if(user.Role === "Student"){
                        var ag = "-";
                        if(user.assignmentGrade){
                            ag = user.assignmentGrade.Grade;
                        }
                        this.state.displayedSection.sectionData.students[user.UserID].gradedAssignments.push({assignmentName:body.AssignmentInstance.Assignment.DisplayName,assignmentGrade:ag});
                    }
                });
                this.setState({loaded:true});
            });
        });
    }

    instructorAssignmentOnClick(assignmentInstanceID){
        this.state.displayedSection.type="instructorAssignment";
        apiCall.post(`/getAssignmentGrades/${assignmentInstanceID}`,{},(err,status,body)=>{

            body.SecionUsers = body.SectionUsers.filter(user => {
                if(user.Role === "Student"){
                    return true;
                } else {
                    return false;
                }
            });

            this.state.displayedSection.sectionData=body;
            this.setState({loaded:true});
        });
    }

    studentOverViewOnClick(section){
        this.state.displayedSection.type="studentoverview";
        apiCall.post('/getUserAssignmentGrades',{userID:this.state.userID,sectionID:section.SectionID},(err,status,body)=>{
            body["Section"]=section;
            this.state.displayedSection.sectionData=body;
            this.setState({loaded:true});
        });
    }

    studentAssignmentOnClick(assignmentInstanceID){
        this.state.displayedSection.type="studentassignment";
        apiCall.post(`/getAssignmentGrades/${assignmentInstanceID}`,{},(err,status,body)=>{
            this.state.displayedSection.sectionData=body;
            this.setState({loaded:true});
        });
    }

    render(){
        var tableHeader=null;
        var instructorSections = this.state.instructorSections;
        var studentSections = this.state.studentSections;
        var displayType = this.state.displayedSection.type;
        var sectionData = this.state.displayedSection.sectionData;
        var instructorSectionsCollapsible=(<h3>No sections taught</h3>);
        var studentSectionsCollapsible=(<h3>No sections attending</h3>);
        let tableView = (<ReactTable 
                        defaultPageSize={10}
                        className="-striped -highlight"
                        resizable={true}
                        columns={[
                        {
                            Header: "",
                            accessor: 'Assignment',
                        },
                        {
                            Header: "",
                            accessor: 'Type'
                        },
                        {         
                            Header: "",
                            accessor: 'Course',
                        },{
                            Header: "",
                            accessor: 'Date',
                        }
                    ]} noDataText="Please choose an assignment or overview"/>);

        //Make sure component has loaded
        if(!this.state.loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        if(displayType==="instructorOverview"){

            let overviewEntries = [];
            let nestedTables = [];
            for(var studentID in sectionData.students){
                 overviewEntries.push({firstName:sectionData.students[studentID].User.FirstName,lastName:sectionData.students[studentID].User.LastName});

                 var nestedTableRows = [];
                 sectionData.students[studentID].gradedAssignments.forEach(assignment=>{
                     nestedTableRows.push((<tr><td>{assignment.assignmentName}</td><td>{assignment.assignmentGrade}</td></tr>));
                 });

                nestedTables.push( 
                    <table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr>
                                <th>Assignment</th><th>Final Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nestedTableRows}
                        </tbody>
                    </table>);

            }

            var exportFileName = sectionData.Section.Course.Number+"_"+sectionData.Section.Name;            
            var sectionName = sectionData.Section.Course.Name+" "+sectionData.Section.Course.Number+"_"+sectionData.Section.Name;
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

            var collumns = [];
            collumns = sectionData.assignments.map(assignment =>{
                return (<Workbook.Column label={assignment.Assignment.DisplayName} value={assignment.Assignment.DisplayName}/>);
            });
            collumns.unshift(<Workbook.Column label="Name" value="Name"/>);

            var excelData = [];
            for(var key in sectionData.students){
                var row = {Name:sectionData.students[key].User.FirstName+" "+sectionData.students[key].User.LastName};
                sectionData.students[key].gradedAssignments.forEach(assignment=>{
                    row[assignment.assignmentName]=assignment.assignmentGrade;
                });
                excelData.push(row);
            }
            var exportGrades = (<Workbook filename={exportFileName+".xlsx"} element={<button type="button">Export Grades</button>}>
                <Workbook.Sheet data={excelData} name={exportFileName}>
                    {collumns}
                </Workbook.Sheet>
            </Workbook>);

            tableHeader = (<div><h2 className="title">{sectionName}<br/>Student Overview</h2><br/>{exportGrades}</div>);

        }
        else if(displayType==="instructorAssignment"){
            var nestedTables = [];
            
            //Begin mapping users for this section
            const tableData = sectionData.SectionUsers.map( user => {

                console.log(user);
                if(!user.assignmentGrade){
                    nestedTables.push(<div><h3>No grade data</h3></div>);
                    return {
                        firstName: user.User.FirstName,
                        lastName: user.User.LastName,
                        //email:user.User.UserContact.Email,
                        email:"example@example.com",
                        grade:"-"
                    };
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
                    regularGrades.push(<tr><td rowSpan="6">No tasks completed</td></tr>);
                }

                if(extraCreditGrades.length == 0){
                    extraCreditGrades.push(<tr><td rowSpan="6">No extra credit tasks</td></tr>);
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
                    //email:user.User.UserContact.Email,
                    email:"example@example.com",
                    grade:user.assignmentGrade.Grade
                };
            });

            let assignmentName = sectionData.AssignmentInstance.Assignment.DisplayName;
            let section = sectionData.AssignmentInstance.Section.Course.Number + " " + sectionData.AssignmentInstance.Section.Course.Name + " " + sectionData.AssignmentInstance.Section.Name;
            tableHeader = (<div><h2 className="title">{section} <br/> Assignment: {assignmentName}</h2></div>);
            tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true} data={tableData}
                    columns={[
                        {Header: "First Name",accessor: 'firstName'},
                        {Header: "Last Name",accessor: 'lastName'},
                        {Header: "Email",accessor: 'email'},
                        {Header: "Final Grade",accessor: 'grade'}
                    ]} 
                    noDataText="Please choose an assignment or overview"
                    SubComponent={(row) => { return nestedTables[row.index]; }}
                    />);

        }
        else if(displayType==="studentoverview"){

            const tableData = sectionData.grades.map(grade => {
                return {
                    name:grade.AssignmentDetails.DisplayName,
                    grade:grade.Grade
                }
            });

            let section = sectionData.Section.Section.Course.Number + " " + sectionData.Section.Section.Course.Name + " " + sectionData.Section.Name;

            tableHeader = (<div><h2 className="title">{section}</h2></div>);
            tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true} data={tableData}
            columns={[
                {Header: "Assignment Name",accessor: 'name'},
                {Header: "Grade",accessor: 'grade'},
            ]} 
            noDataText="No grade data"
            />);



        }
        else if(displayType==="studentassignment"){
            console.log(sectionData);
        }

        instructorSectionsCollapsible = instructorSections.map(section=>{
            return this.createCollapsableMenu(section,this.instructorOverViewOnClick.bind(this,section),this.instructorAssignmentOnClick.bind(this));
        });

        studentSectionsCollapsible = studentSections.map(section=>{
            return this.createCollapsableMenu(section,this.studentOverViewOnClick.bind(this,section),this.studentAssignmentOnClick.bind(this));
        });

        return(
                <form name="grade_report" role="form" className="section" method="post">
                    <div className="section-content">
                        <div className="section">
                            <h2 className="title">Classes Instructing:</h2>
                            <div className="section-content">
                                {instructorSectionsCollapsible}
                            </div>
                        </div>
                        <div className="section">
                            <h2 className="title">Classes attending:</h2>
                            <div className="section-content">
                                {studentSectionsCollapsible}
                            </div>
                        </div>
                        <div className="section card-2 sectionTable">
                            <h2 className="title">Assignment Details</h2>
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

export default UpdatedGradeReport;
