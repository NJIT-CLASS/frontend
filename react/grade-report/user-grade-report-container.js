import React from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import ReactTable from 'react-table';
import Collapsible from 'react-collapsible';
import TableComponent from '../shared/tableComponent';
import Workbook from 'react-excel-workbook';


class GradeReport extends React.Component {

    constructor(props) {
        super(props);
        console.log("Loaded");

        this.state = {
            loaded: false,
            error:"",
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
            } else {
                this.setState({loaded:true,error:body});
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
            } else {
                this.setState({loaded:true,error:body});
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
            console.log(body);
            body["Section"]=section;
            this.state.displayedSection.sectionData=body;
            this.setState({loaded:true});
        });
    }

    studentAssignmentOnClick(assignmentInstanceID){
        this.state.displayedSection.type="studentassignment";
        apiCall.post(`/getAssignmentGrades/${assignmentInstanceID}`,{},(err,status,body)=>{
            console.log(body);
            body.SectionUsers.forEach(user =>{
                if(user.UserID == this.state.userID){
                    body["userAssignmentGrades"] = user;
                }
            });
            delete body.SectionUsers;
            this.state.displayedSection.sectionData=body;
            this.setState({loaded:true});
        });
    }

    render(){
        console.log("Render");
        var tableHeader=null;
        var error = this.state.error;
        var instructorSections = this.state.instructorSections;
        var studentSections = this.state.studentSections;
        var displayType = this.state.displayedSection.type;
        var sectionData = this.state.displayedSection.sectionData;
        var instructorSectionsCollapsible=(<h3>No sections taught</h3>);
        var studentSectionsCollapsible=(<h3>No sections attending</h3>);
        var instructorSectionsView = null;
        var studentSectionsView = null;
        var tableView = (<ReactTable 
                        defaultPageSize={10}
                        className="-striped -highlight"
                        resizable={true}
                        columns={[
                        {Header: "",accessor: 'Assignment',},
                        {Header: "",accessor: 'Type'},
                        {Header: "",accessor: 'Course',
                        },{Header: "",accessor: 'Date',}
                    ]} noDataText="Please choose an assignment or overview"/>);

        //Make sure component has loaded
        if(!this.state.loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        if(error){
            console.log(error);
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
                var fn = user.User.FirstName ? user.User.FirstName : "N/A";
                var ln = user.User.LastName ? user.User.LastName : "N/A";
                var eml = user.User.UserContact.Email ? user.User.UserContact.Email : "N/A";
                console.log(user);
                if(!user.assignmentGrade || user.assignmentGrade.WorkflowActivityGrades.length ==0){
                    nestedTables.push(<div><h3>No grade data</h3></div>);
                    return {
                        firstName: fn,
                        lastName: ln,
                        email:eml,
                        grade:"-"
                    };
                }

                let workflowGradesTable = [];
                const workflowActivityGradesView = user.assignmentGrade.WorkflowActivityGrades.map( waGrade => {
                    var regularGrades = [];
                    var extraCreditGrades = [];
                    regularGrades.push(<tr><th>Regular Tasks</th><th>Task Grade</th><th>Task Simple Grade</th><th>Comments</th></tr>);
                    extraCreditGrades.push(<tr><th>Extra Credit Tasks</th><th>Task Grade</th><th>Task Simple Grade</th><th>Comments</th></tr>);

                    waGrade.WorkflowActivity.users_WA_Tasks.forEach( task => {
                        
                        if(task.IsExtraCredit){
                            extraCreditGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{task.taskGrade.Grade}</td><td>{task.taskSimpleGrade.Grade}</td><td>{task.Comments}</td>
                            </tr>);
                        } else {
                            regularGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{task.taskGrade.Grade}</td><td>{task.taskSimpleGrade.Grade}</td><td>{task.Comments}</td>
                            </tr>);
                        }
                    });


                    if(regularGrades.length <= 1){regularGrades = null;}
                    if(extraCreditGrades.length <=1){extraCreditGrades = null;}

                    workflowGradesTable.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                    <thead>
                        <tr><th colSpan="4">Workflow {(workflowGradesTable.length + 1).toString()} | Grade: {waGrade.Grade}</th></tr>
                    </thead>
                    {regularGrades}
                    {extraCreditGrades}
                </table>);

                });

                nestedTables.push(workflowGradesTable);

                return {
                    firstName: user.User.FirstName,
                    lastName: user.User.LastName,
                    email:user.User.UserContact.Email,
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
            console.log(sectionData);
            const tableData = sectionData.grades.map(grade => {
                return {
                    name:grade.AssignmentDetails.DisplayName,
                    grade:grade.Grade
                }
            });
            let section = sectionData.Section.Section.Course.Number + " " + sectionData.Section.Section.Course.Name + " " + sectionData.Section.Section.Name;
            tableHeader = (<div><h2 className="title">{section}</h2></div>);
            tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true} data={tableData}
            columns={[
                {Header: "Assignment Name",accessor: 'name'},
                {Header: "Grade",accessor: 'grade'},
            ]} 
            noDataText="No grade data"
            SubComponent={null}
            />);
        }
        else if(displayType==="studentassignment"){
            console.log(sectionData);
            let nestedTables = [];
            let tableData = null;
            let grade = "No grade data";
            if(sectionData.userAssignmentGrades.assignmentGrade){ 
                console.log("test");
                tableData = sectionData.userAssignmentGrades.assignmentGrade.WorkflowActivityGrades.map( waGrade => {
                    var regularGrades = [];
                    var extraCreditGrades = [];
                    regularGrades.push(<tr><th>Regular Tasks</th><th>Task Grade</th><th>Task Simple Grade</th><th>Comments</th></tr>);
                    extraCreditGrades.push(<tr><th>Extra Credit Tasks</th><th>Task Grade</th><th>Task Simple Grade</th><th>Comments</th></tr>);

                    waGrade.WorkflowActivity.users_WA_Tasks.forEach( task => {
                        let taskSimpleGrade = task.taskSimpleGrade ? task.taskSimpleGrade.Grade : "-";
                        let taskGrade = task.taskGrade ? task.taskGrade.Grade : "-";
                        if(task.IsExtraCredit){
                            extraCreditGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{taskGrade}</td><td>{taskSimpleGrade}</td><td>{task.Comments}</td>
                            </tr>);
                        } else {
                            regularGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{taskGrade}</td><td>{taskSimpleGrade}</td><td>{task.Comments}</td>
                            </tr>);
                        }
                    });


                    if(regularGrades.length <= 1){regularGrades = null;}
                    if(extraCreditGrades.length <=1){extraCreditGrades = null;}

                    nestedTables.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                    {regularGrades}
                    {extraCreditGrades}
                </table>);
                    return {workflow: (nestedTables.length).toString()};
                });
                grade = sectionData.userAssignmentGrades.assignmentGrade.Grade;
                tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true}  data={tableData}
                columns={[
                    {Header: "Work Flow",accessor: 'workflow'}
                ]} 
                noDataText="No grade data"
                SubComponent={(row) => { return nestedTables[row.index]; }}
                />);
            }

            tableHeader = (<div><h2 className="title">{sectionData.AssignmentInstance.Section.Course.Number +" "
            + sectionData.AssignmentInstance.Section.Course.Name}<br/>{sectionData.AssignmentInstance.Assignment.Name}<br/>Grade: {grade}</h2></div>);  
        }

        instructorSectionsCollapsible = instructorSections.map(section=>{
            return this.createCollapsableMenu(section,this.instructorOverViewOnClick.bind(this,section),this.instructorAssignmentOnClick.bind(this));
        });

        studentSectionsCollapsible = studentSections.map(section=>{
            return this.createCollapsableMenu(section,this.studentOverViewOnClick.bind(this,section),this.studentAssignmentOnClick.bind(this));
        });

        if(instructorSections.length > 0){
            instructorSectionsView = (<div className="section">
            <h2 className="title">Classes Instructing:</h2>
            <div className="section-content">
                {instructorSectionsCollapsible}
            </div>
        </div>);
        }
        if(studentSections.length > 0){
            studentSectionsView = (<div className="section">
            <h2 className="title">Classes attending:</h2>
            <div className="section-content">
                {studentSectionsCollapsible}
            </div>
        </div>);
        }

        return(
                <form name="grade_report" role="form" className="section" method="post">
                    <div className="section-content">
                        {instructorSectionsView}
                        {studentSectionsView}
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

export default GradeReport;
