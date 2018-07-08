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
            console.log(body);
            if(status.statusCode === 200){
                if(body["Sections"].length == 0){
                    this.setState({loaded:true});
                } else {
                    body.Sections.forEach(section=>{this.getAssignments(section,body.Sections.length)});
                }
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
        //console.log(section);
        let sectionName = section.Section.Course.Number + "  "+ section.Section.Name+"  " + section.Section.Course.Name;
        let sectionID = section.SectionID;

        let nestedOverview = (<li className="select-class-element"><a href="#" onClick={overviewOnclick}>Student Overview</a></li>);
        var nestedAssignments = section.assignments.map(assignment=>{
            return(<li className="select-class-element"><a href="#" onClick={assignmentOnclick.bind(this,assignment,section)}>{assignment.Assignment.DisplayName}</a></li>);
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
        this.state.displayedSection.sectionData["grades"] = null;

        apiCall.get(`/course/getsection/${section.SectionID}`,{},(err,status,body)=>{

            body.UserSection.forEach(user=>{
                if(user.Role === "Student"){
                    this.state.displayedSection.sectionData.students[user.UserID]=user;
                }
            });

            this.getGrades(this.state.displayedSection.sectionData.students, this.state.displayedSection.sectionData.assignments);
        });
    }

    /*getAssignmentsByStudent(){
        this.state.displayedSection.sectionData.assignments.forEach(assignment => {
            apiCall.post(`/getAssignmentGrades/${assignment.AssignmentInstanceID}`,{},(err,status,body)=>{
                console.log(body);
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
    }*/

    instructorAssignmentOnClick(assignment, section){
        this.state.displayedSection.type="instructorAssignment";
        this.state.displayedSection.sectionData=section;
        this.state.displayedSection.sectionData["students"]={};
        this.state.displayedSection.sectionData["grades"] = null;

        apiCall.get(`/course/getsection/${section.SectionID}`,{},(err,status,body)=>{

            body.UserSection.forEach(user=>{
                if(user.Role === "Student"){
                    this.state.displayedSection.sectionData.students[user.UserID]=user;
                }
            });

            this.getGrades(this.state.displayedSection.sectionData.students, [assignment]);
        });
    }

    studentOverViewOnClick(section){
        console.log(section);
        this.state.displayedSection.type="studentoverview";
        this.state.displayedSection.sectionData=section;
        this.state.displayedSection.sectionData["students"]={};
        this.state.displayedSection.sectionData["grades"] = null;
        var user = {};
        user[this.state.userID] = {};
        this.getGrades( user ,section.assignments);
    }

    studentAssignmentOnClick(assignment,section){
        console.log(section);

        this.state.displayedSection.type="studentassignment";
        this.state.displayedSection.sectionData=section;
        this.state.displayedSection.sectionData["students"]={};
        this.state.displayedSection.sectionData["grades"] = null;
        var user = {};
        user[this.state.userID] = {};
        this.getGrades(user, [assignment]);
    }

    getGrades(students, assignments){
        console.log(students);
        console.log(assignments);
        var response = {};
        var apiCallCount = 0;

        assignments.forEach(assignment => {
            //console.log(assignment);
            apiCall.get(`/getAssignmentGrade/${assignment.AssignmentInstanceID}`,{},(err, status, body) => {
                console.log(body);
                if( status.statusCode === 200){
                    apiCallCount++;
                    for( var userID in students){
                        var sectionUserID = null;
                        //console.log(student);
                        //console.log(students[userID]);
                            
                        for(var i in body.SectionUsers){
                            if(userID == body.SectionUsers[i].UserID){
                                sectionUserID = body.SectionUsers[i].SectionUserID;
                            }
                        }

                        //console.log(sectionUserID);

                        if(!(sectionUserID in response)){
                            response[sectionUserID] = {
                                user: students[userID],
                                assignments:{}
                            };
                        }

                        var newAssignmentEntry = {
                            "assignment": body.AssignmentActivity,
                            "workflows":{},
                            "taskActivities":{}
                        }

                        body.TaskActivity.forEach(taskActivity => {
                            newAssignmentEntry.taskActivities[taskActivity.TaskActivityID] = taskActivity;
                        });

                        body.Grades.Assignment.forEach(ag => {
                            if( ag.SectionUserID == sectionUserID ){
                                newAssignmentEntry["assignmentGrade"] = ag;
                            }
                        });

                        body.WorkflowActivity.forEach(workflow => {
                            var workflowCopy = Object.assign({},workflow);
                            workflowCopy["simpleTasks"] = {};
                            workflowCopy["regularTasks"] = {};
                            newAssignmentEntry.workflows[workflow.WorkflowActivityID] = workflowCopy;
                        });


                        body.Grades.Workflow.forEach(workflowGrade => {
                            if( workflowGrade.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[workflowGrade.WorkflowActivityID]["workflowGrade"] = workflowGrade;
                            }
                        });

                        body.Grades.SimpleGrade.forEach(sg => {
                            if( sg.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[sg.WorkflowActivityID]["simpleTasks"][sg.TaskSimpleGradeID] = sg;
                            }
                        });

                        body.Grades.Task.forEach(task => {
                            if( task.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[task.WorkflowActivityID]["regularTasks"][task.TaskInstanceID] = task;
                            }
                        });

                        response[sectionUserID].assignments[assignment.AssignmentInstanceID] = newAssignmentEntry;
                    }

                    if(apiCallCount == assignments.length){
                        //console.log(response);
                        this.calculateGrades(response);
                        this.state.displayedSection.sectionData["grades"] = response;
                        this.setState({loaded:true});
                    }
                }
            });
        });
    }

    calculateGrades(root){
        console.log(root);
        // User Level
        for( var [sectionUserID, studentData] of Object.entries(root)){
            //console.log(studentData);

            // Assignment Level
            for( var [assignmentID, assignmentData] of Object.entries(studentData["assignments"])){
                //console.log(assignmentData);

                if(!("assignmentGrade" in assignmentData)){
                    assignmentData["assignmentGrade"] = { Grade: null};
                    var assignmentGrade = 0;
                    var assignmentGradeDistribution = JSON.parse(assignmentData.assignment.GradeDistribution);

                    // Workflow level
                    for( var [workflowID, workflowData] of Object.entries(assignmentData["workflows"])){

                        if(!("workflowGrade" in workflowData)){
                            workflowData["workflowGrade"] = {Grade:null};
                            var workflowGrade = 0;
                            var workflowGradeDistribution = JSON.parse(workflowData["GradeDistribution"]);
                            var correctGradeDistribution = {};
                            for(var [taskAcivityID, gradePercentage] of Object.entries(workflowGradeDistribution)){
                                if(taskAcivityID === "simple"){
                                    correctGradeDistribution["simple"] = gradePercentage;
                                } else {
                                    correctGradeDistribution[ assignmentData.taskActivities[taskAcivityID].RefersToWhichTask ] = gradePercentage;
                                }

                            }

                            workflowData["correctGradeDistribution"] = correctGradeDistribution;

                            for( var [taskID, taskData] of Object.entries(workflowData["regularTasks"])){
                                workflowGrade += correctGradeDistribution[taskData.TaskActivityID] * (taskData.Grade / taskData.MaxGrade);
                            }

                            var totalSimpleScore = 0;
                            for( var [taskID, taskData] of Object.entries(workflowData["simpleTasks"])){
                                totalSimpleScore += taskData.Grade;
                            }
                            workflowGrade += correctGradeDistribution["simple"] * (totalSimpleScore / workflowData.length);


                            if( Object.keys(workflowData["regularTasks"]).length === 0 ) continue;
                            workflowData["workflowGrade"]["Grade"] = workflowGrade;
                        }

                        if( !workflowData["workflowGrade"]["Grade"] ) continue;
                        assignmentGrade += assignmentGradeDistribution[workflowID] * (workflowData["workflowGrade"]["Grade"] / 100);
                    }
                    assignmentData["assignmentGrade"]["Grade"] = assignmentGrade;
                }
            }
        }
    }

    render(){
        var sectionsPlaceholder = null;
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
            console.log(sectionData);
            let overviewEntries = [];
            let nestedTables = [];
            for(var studentID in sectionData.grades){
                console.log(sectionData.grades[studentID]);
                overviewEntries.push({ firstName: sectionData.grades[studentID].user.User.FirstName, lastName: sectionData.grades[studentID].user.User.LastName});

                var nestedTableRows = [];

                for( var [assignmentID, assignmentData] of Object.entries(sectionData.grades[studentID].assignments)){

                    nestedTableRows.push((<tr><td>{assignmentData.assignment.DisplayName}</td><td>{assignmentData.assignmentGrade.Grade}</td></tr>));
                }

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
                /*
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
            </Workbook>);*/
            //tableHeader = (<div><h2 className="title">{sectionName}<br/>Student Overview</h2><br/>{exportGrades}</div>);            
            tableHeader = (<div><h2 className="title">{sectionName}<br/>Student Overview</h2><br/></div>);

        }
        else if(displayType==="instructorAssignment"){
            console.log(sectionData);
            var nestedTables = [];
            var tableEntries = [];
            var tableData = [];

            for( var [studentID, studentData] of Object.entries(sectionData.grades)){
                console.log(studentData);
                var fn = studentData.user.User.FirstName ? studentData.user.User.FirstName : "N/A";
                var ln = studentData.user.User.LastName ? studentData.user.User.LastName : "N/A";

                for( var [assignmentID, assignment] of Object.entries(studentData.assignments)){
                    console.log(assignment);
                    var grade = assignment.assignmentGrade.Grade;
                    tableData.push({
                        firstName: fn,
                        lastName: ln,
                        email:"N\A",
                        grade:grade
                    })

                    for(var [workflowID, workflow] of Object.entries(assignment.workflows)){
                        console.log(workflow);
                        var regularGrades = [];
                        var simpleGrades = [];
                        var workflowGradesTable = [];
                        regularGrades.push(<tr><th>Regular Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        simpleGrades.push(<tr><th>Simple Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        for(var [regularTaskID, regularTask] of Object.entries(workflow.regularTasks)){
                            let isExtraCredit = regularTask.IsExtraCredit ? "Yes" : "No";
                            regularGrades.push(<tr>
                                <td>{assignment.taskActivities[regularTask.TaskActivityID].DisplayName}</td><td>{regularTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }

                        for(var [simpleTaskID, simpleTask] of Object.entries(workflow.simpleTasks)){
                            let isExtraCredit = simpleTask.IsExtraCredit ? "Yes" : "No";
                            simpleGrades.push(<tr>
                                <td>{assignment.taskActivities[simpleTask.TaskActivityID].DisplayName}}</td><td>{simpleTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }

                        workflowGradesTable.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr><th colSpan="4">Problem Thread {(workflowGradesTable.length + 1).toString()} | Grade: {workflow.workflowGrade.Grade}</th></tr>
                        </thead>
                        <tbody>
                        {regularGrades}
                        {simpleGrades}
                        </tbody>
                        </table>);
                    }

                    nestedTables.push(workflowGradesTable);
                }
            }
            
            let assignmentName = sectionData.assignments[0].Assignment.DisplayName;
            let section = sectionData.Section.Course.Number + " " + sectionData.Section.Course.Name + " " + sectionData.Section.Name;
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

            const tableData = [];
            for( var [sectionUserID, sectionUser] of Object.entries(sectionData.grades)){
                for( var [assignmentID, assignment] of Object.entries(sectionUser.assignments)){
                    console.log(assignment);
                    tableData.push({
                        name:assignment.assignment.DisplayName,
                        grade:assignment.assignmentGrade.Grade
                    });
                }
            }

            let section = sectionData.Section.Course.Number + " " + sectionData.Section.Course.Name + " " + sectionData.Section.Name;
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

            var nestedTables = [];
            var tableEntries = [];
            var tableData = [];
            var assignmentGrade = null;
            for( var [studentID, studentData] of Object.entries(sectionData.grades)){
                console.log(studentData);

                for( var [assignmentID, assignment] of Object.entries(studentData.assignments)){
                    console.log(assignment);
                    assignmentGrade = assignment.assignmentGrade.Grade;
                    tableData.push({
                        workflow:"Problem thread "+(nestedTables.length+1).toString()
                    })

                    for(var [workflowID, workflow] of Object.entries(assignment.workflows)){
                        console.log(workflow);
                        var regularGrades = [];
                        var simpleGrades = [];
                        var workflowGradesTable = [];
                        regularGrades.push(<tr><th>Regular Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        simpleGrades.push(<tr><th>Simple Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        for(var [regularTaskID, regularTask] of Object.entries(workflow.regularTasks)){
                            let isExtraCredit = regularTask.IsExtraCredit ? "Yes" : "No";

                            regularGrades.push(<tr>
                                <td>{assignment.taskActivities[regularTask.TaskActivityID].DisplayName}</td><td>{regularTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }

                        /*for(var [simpleTaskID, simpleTask] of Object.entries(workflow.simpleTasks)){
                            let isExtraCredit = simpleTask.IsExtraCredit ? "Yes" : "No";
                            console.log(simpleTask.TaskActivityID);
                            simpleGrades.push(<tr>
                                <td>{assignment.taskActivities[simpleTask.TaskActivityID].DisplayName}}</td><td>{simpleTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }*/

                        workflowGradesTable.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr><th colSpan="4">Problem Thread {(workflowGradesTable.length + 1).toString()} | Grade: {workflow.workflowGrade.Grade}</th></tr>
                        </thead>
                        <tbody>
                        {regularGrades}
                        {simpleGrades}
                        </tbody>
                        </table>);
                    }

                    nestedTables.push(workflowGradesTable);
                }
            }
            
            let assignmentName = sectionData.assignments[0].Assignment.DisplayName;
            let section = sectionData.Section.Course.Number + " " + sectionData.Section.Course.Name + " " + sectionData.Section.Name;

            tableHeader = (<div><h2 className="title">{section} <br/> Assignment: {assignmentName} <br /> Grade: {assignmentGrade}</h2></div>);
            tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true} data={tableData}
                    columns={[
                        {Header: "Problem Thread",accessor: 'workflow'}
                    ]} 
                    noDataText="Please choose an assignment or overview"
                    SubComponent={(row) => { return nestedTables[row.index]; }}
                    />);


            /*let nestedTables = [];
            let tableData = null;
            let grade = "No grade data";
            if(sectionData.userAssignmentGrades.assignmentGrade){ 
                tableData = sectionData.userAssignmentGrades.assignmentGrade.WorkflowActivityGrades.map( waGrade => {
                    var regularGrades = [];
                    var extraCreditGrades = [];
                    regularGrades.push(<tr><th>Regular Tasks</th><th>Quality Grade</th><th>Task Completed On Time Grade</th></tr>);
                    extraCreditGrades.push(<tr><th>Extra Credit Tasks</th><th>Quality Grade</th><th>Task Completed On Time Grade</th></tr>);

                    waGrade.WorkflowActivity.users_WA_Tasks.forEach( task => {
                        let taskSimpleGrade = task.taskSimpleGrade ? task.taskSimpleGrade.Grade : "-";
                        let taskGrade = task.taskGrade ? task.taskGrade.Grade : "-";
                        if(task.IsExtraCredit){
                            extraCreditGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{taskGrade}</td><td>{taskSimpleGrade}</td>
                            </tr>);
                        } else {
                            regularGrades.push(<tr>
                                <td>{task.taskActivity.Name}</td><td>{taskGrade}</td><td>{taskSimpleGrade}</td>
                            </tr>);
                        }
                    });


                    if(regularGrades.length <= 1){regularGrades = null;}
                    if(extraCreditGrades.length <=1){extraCreditGrades = null;}

                    nestedTables.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                    <tbody>
                    {regularGrades}
                    {extraCreditGrades}
                    </tbody>
                </table>);
                    return {workflow: (nestedTables.length).toString()};
                });
                grade = sectionData.userAssignmentGrades.assignmentGrade.Grade;
                grade = "N/A";
                tableView = (<ReactTable defaultPageSize={10} className="-striped -highlight" resizable={true}  data={tableData}
                columns={[
                    {Header: "Problem Thread",accessor: 'workflow'}
                ]} 
                noDataText="No grade data"
                SubComponent={(row) => { return nestedTables[row.index]; }}
                />);
            }

            tableHeader = (<div><h2 className="title">{sectionData.AssignmentInstance.Section.Course.Number +" "
            + sectionData.AssignmentInstance.Section.Course.Name}<br/>{sectionData.AssignmentInstance.Assignment.Name}<br/>Grade: {grade}</h2></div>);  */
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

        if(instructorSections.length == 0 && studentSections.length == 0){
            sectionsPlaceholder = (<div className="section"><h2 className="title">You are currently not attending or teaching any sections</h2></div>);
        }

        return(
                <form name="grade_report" role="form" className="section" method="post">
                    <div className="section-content">
                        {sectionsPlaceholder}
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
