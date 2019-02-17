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

    /**
     *
     * Get all sections that the current user attends or instructs.
     * Then get all assignments for those sections using the function getAssignments
     */
    getSections(userID){
        apiCall.get(`/SectionsByUser/${userID}`,{},(err,status,body)=>{
            //console.log(body);
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

    /**
     *
     * @param {*} section Section data returned from the backend
     * @param {*} numSections Number of sections to keep track of when to call setState
     *
     */
    getAssignments(section,numSections){
        apiCall.get(`/getActiveAssignmentsForSection/${section.SectionID}`,{},(err,status,body)=>{
            if(status.statusCode===200){
                //Add the assignment to the section data
                section["assignments"]=body.Assignments;

                // If the user is an instructor add section to list of instructor sections, otherwise add
                // to student sections.
                // When all sections are accounted for, call setState.
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

    /**
     *
     * @param {*} section Section data
     * @param {*} overviewOnclick onclick function for the overview, can be both student and instructor overview
     * @param {*} assignmentOnclick onclick funciton for assignment, can be both student and instructor assignment
     */
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
        //console.log(section);

        this.state.displayedSection.type="studentassignment";
        this.state.displayedSection.sectionData=section;
        this.state.displayedSection.sectionData["students"]={};
        this.state.displayedSection.sectionData["grades"] = null;
        var user = {};
        user[this.state.userID] = {};
        this.getGrades(user, [assignment]);
    }
    /**
     *
     * @param {*} students array of student data, must at least contain userID
     * @param {*} assignments array of assignments, must at least contain AssignmentInstanceID
     *
     * Formats grade data into a more usable form, a tree structure. Top level being a list of sectionUserID's to user data.
     * Inside that user data is an entry called assignments that contains a dictionary mapping assignment Id's to assignment data.
     * Inside that assignment data is an entry called workflows that maps workflow activity Id to workflow data.
     * Inside workflow data are entries for regular tasks and simple tasks.
     *
     * This way any number of students and any number assignments can be passed and the resulting structure will always be the same
     * when it comes to displaying it
     */
    getGrades(students, assignments){
        var response = {};
        var apiCallCount = 0;

        // Call getAssignmentGrade for each assignment
        assignments.forEach(assignment => {

            apiCall.get(`/getAssignmentGrade/${assignment.AssignmentInstanceID}`,{},(err, status, body) => {

                if( status.statusCode === 200){
                    apiCallCount++;
                    for( var userID in students){
                        var sectionUserID = null;

                        // Retrieve section user ID
                        for(var i in body.SectionUsers){
                            if(userID == body.SectionUsers[i].UserID){
                                sectionUserID = body.SectionUsers[i].SectionUserID;
                            }
                        }

                        //For the first iteration, when the initial entry of the section user ID doesn't exist
                        if(!(sectionUserID in response)){
                            response[sectionUserID] = {
                                user: students[userID],
                                assignments:{}
                            };
                        }

                        // Start a new assignment entry
                        var newAssignmentEntry = {
                            "assignment": body.AssignmentActivity,
                            "workflows":{},
                            "taskActivities":{}
                        }

                        // Add the task activities at the assignment level
                        body.TaskActivity.forEach(taskActivity => {
                            newAssignmentEntry.taskActivities[taskActivity.TaskActivityID] = taskActivity;
                        });

                        //Add in the assignment grade if it exists
                        body.Grades.Assignment.forEach(ag => {
                            if( ag.SectionUserID == sectionUserID ){
                                newAssignmentEntry["assignmentGrade"] = ag;
                            }
                        });

                        // Add in the workflows associated with the assignment, also add in entries for simple and regular tasks
                        body.WorkflowActivity.forEach(workflow => {
                            var workflowCopy = Object.assign({},workflow);
                            workflowCopy["simpleTasks"] = {};
                            workflowCopy["regularTasks"] = {};
                            newAssignmentEntry.workflows[workflow.WorkflowActivityID] = workflowCopy;
                        });

                        // Add in workflow grade if it exists
                        body.Grades.Workflow.forEach(workflowGrade => {
                            if( workflowGrade.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[workflowGrade.WorkflowActivityID]["workflowGrade"] = workflowGrade;
                            }
                        });

                        // Add in all simple tasks to the associated workflow
                        body.Grades.SimpleGrade.forEach(sg => {
                            if( sg.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[sg.WorkflowActivityID]["simpleTasks"][sg.TaskSimpleGradeID] = sg;
                            }
                        });

                        //Add in all regular tasks to the associated workflow
                        body.Grades.Task.forEach(task => {
                            if( task.SectionUserID == sectionUserID ){
                                newAssignmentEntry.workflows[task.WorkflowActivityID]["regularTasks"][task.TaskInstanceID] = task;
                            }
                        });

                        //Add the the asssignment data to the assignment list inside the section user id entry
                        response[sectionUserID].assignments[assignment.AssignmentInstanceID] = newAssignmentEntry;
                    }

                    //Calculate the grades and set it to the grades entry in sectionData
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

    /**
     *
     * @param {*} root result data from getGrades
     *
     * Iterates down through tree structure until it reaches the bottom or finds grade data already calculated by the backend,
     * adds any of the missing grade data, and returns the structure
     */
    calculateGrades(root){

        //console.log(root);

        // Loop through each user
        for( var [sectionUserID, studentData] of Object.entries(root)){

            // Loop through each assignment
            for( var [assignmentID, assignmentData] of Object.entries(studentData["assignments"])){

                // If the backend hasn't calculated the grade up to assignment level, continue deeper.
                // Otherwise continue interating through the structure
                if(!("assignmentGrade" in assignmentData)){
                    // Add entry for assignment grade and get the grade distribution
                    assignmentData["assignmentGrade"] = { Grade: null};
                    var assignmentGrade = 0;
                    var assignmentGradeDistribution = JSON.parse(assignmentData.assignment.GradeDistribution);

                    // assignmentGradeAvailable flag notifies when assignment grade can be added
                    var assignmentGradeAvailable = false;
                    // Loop through each workflow
                    for( var [workflowID, workflowData] of Object.entries(assignmentData["workflows"])){

                        // If workflow grade doesn't exist, continue deeper
                        if(!("workflowGrade" in workflowData)){
                            workflowData["workflowGrade"] = {Grade:null};
                            var workflowGrade = 0;
                            var workflowGradeDistribution = JSON.parse(workflowData["GradeDistribution"]);
                            var correctGradeDistribution = {};

                            // Since the grading task gets the grade instead of the task thats being graded,
                            // the assignment distribution must be shifted using refersToWhich task
                            for(var [taskAcivityID, gradePercentage] of Object.entries(workflowGradeDistribution)){
                                if(taskAcivityID === "simple"){
                                    correctGradeDistribution["simple"] = gradePercentage;
                                } else {
                                    correctGradeDistribution[ assignmentData.taskActivities[taskAcivityID].RefersToWhichTask ] = gradePercentage;
                                }

                            }

                            workflowData["correctGradeDistribution"] = correctGradeDistribution;

                            //Calculate and add in regular tasks
                            for( var [taskID, taskData] of Object.entries(workflowData["regularTasks"])){
                                workflowGrade += correctGradeDistribution[taskData.TaskActivityID] * (taskData.Grade / taskData.MaxGrade);
                            }

                            //Calculate and add in simple tasks
                            var totalSimpleScore = 0;
                            for( var [taskID, taskData] of Object.entries(workflowData["simpleTasks"])){
                                totalSimpleScore += taskData.Grade/taskData;
                            }
                            workflowGrade += correctGradeDistribution["simple"] * (totalSimpleScore / workflowData.length);


                            if( Object.keys(workflowData["regularTasks"]).length === 0 && Object.keys(workflowData["simpleTasks"]).length === 0 ) continue;
                            workflowData["workflowGrade"]["Grade"] = workflowGrade;
                        }

                        if( !workflowData["workflowGrade"]["Grade"] ) continue;
                        assignmentGradeAvailable = true;
                        assignmentGrade += assignmentGradeDistribution[workflowID] * (workflowData["workflowGrade"]["Grade"] / 100);
                    }
                    if(assignmentGradeAvailable){
                        assignmentData["assignmentGrade"]["Grade"] = assignmentGrade;
                    }
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
            //console.log(error);
        }

        if(displayType==="instructorOverview"){
            //console.log(sectionData);
            let overviewEntries = [];
            let nestedTables = [];
            for(var studentID in sectionData.grades){
                //console.log(sectionData.grades[studentID]);
                overviewEntries.push({ firstName: sectionData.grades[studentID].user.User.FirstName, lastName: sectionData.grades[studentID].user.User.LastName});

                var nestedTableRows = [];

                for( var [assignmentID, assignmentData] of Object.entries(sectionData.grades[studentID].assignments)){
                    let grade = assignmentData.assignmentGrade.Grade ?assignmentData.assignmentGrade.Grade :"-";
                    nestedTableRows.push((<tr><td>{assignmentData.assignment.DisplayName}</td><td>{grade}</td></tr>));
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
            //console.log(sectionData);
            var nestedTables = [];
            var tableEntries = [];
            var tableData = [];

            for( var [studentID, studentData] of Object.entries(sectionData.grades)){
                //console.log(studentData);
                var fn = studentData.user.User.FirstName ? studentData.user.User.FirstName : "N/A";
                var ln = studentData.user.User.LastName ? studentData.user.User.LastName : "N/A";

                for( var [assignmentID, assignment] of Object.entries(studentData.assignments)){
                    console.log(assignment);
                    var grade = assignment.assignmentGrade.Grade ? assignment.assignmentGrade.Grade : "-";
                    tableData.push({
                        firstName: fn,
                        lastName: ln,
                        email:"N\A",
                        grade:grade
                    })

                    var assignmentGradeDistribution = JSON.parse(assignment.assignment.GradeDistribution);

                    for(var [workflowID, workflow] of Object.entries(assignment.workflows)){
                        var workflowGradeDistribution = JSON.parse(workflow.GradeDistribution);
                        //console.log(workflow);
                        var regularGrades = [];
                        var simpleGrades = [];
                        var workflowGradesTable = [];
                        regularGrades.push(<tr><th>Regular Tasks</th><th>Weight</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        simpleGrades.push(<tr><th>Simple Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        for(var [regularTaskID, regularTask] of Object.entries(workflow.regularTasks)){
                            let isExtraCredit = regularTask.IsExtraCredit ? "Yes" : "No";
                            regularGrades.push(<tr>
                                <td>{assignment.taskActivities[regularTask.TaskActivityID].DisplayName}</td><td>{workflowGradeDistribution[regularTaskID] }</td><td>{regularTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }

                        /*for(var [simpleTaskID, simpleTask] of Object.entries(workflow.simpleTasks)){
                            let isExtraCredit = simpleTask.IsExtraCredit ? "Yes" : "No";
                            console.log(simpleTask  );
                            simpleGrades.push(<tr>
                                <td>{assignment.taskActivities[simpleTask.TaskActivityID].DisplayName}}</td><td>{simpleTask.Grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }*/

                        var threadGrade = workflow.workflowGrade.Grade ? workflow.workflowGrade.Grade : "-";

                        workflowGradesTable.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr><th colSpan="4">Problem Thread {(workflowGradesTable.length + 1).toString()} | Weight: {assignmentGradeDistribution[workflowID]}% | Grade: {threadGrade}</th></tr>
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
                        {Header: "Grade",accessor: 'grade'}
                    ]}
                    noDataText="Please choose an assignment or overview"
                    SubComponent={(row) => { return nestedTables[row.index]; }}
                    />);
        }
        else if(displayType==="studentoverview"){
            //console.log(sectionData);

            const tableData = [];
            for( var [sectionUserID, sectionUser] of Object.entries(sectionData.grades)){
                for( var [assignmentID, assignment] of Object.entries(sectionUser.assignments)){
                    console.log(assignment);
                    let grade = assignment.assignmentGrade.Grade? assignment.assignmentGrade.Grade :"-";
                    tableData.push({
                        name:assignment.assignment.DisplayName,
                        grade:grade
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
                //(studentData);

                for( var [assignmentID, assignment] of Object.entries(studentData.assignments)){
                    //console.log(assignment);
                    assignmentGrade = assignment.assignmentGrade.Grade;


                    for(var [workflowID, workflow] of Object.entries(assignment.workflows)){
                        tableData.push({
                            workflow:"Problem thread "+(nestedTables.length+1).toString()
                        })
                        console.log(workflow);
                        var regularGrades = [];
                        var simpleGrades = [];
                        var workflowGradesTable = [];
                        regularGrades.push(<tr><th>Regular Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        simpleGrades.push(<tr><th>Simple Tasks</th><th>Grade</th><th>Is Extra Credit</th></tr>);
                        for(var [regularTaskID, regularTask] of Object.entries(workflow.regularTasks)){
                            let isExtraCredit = regularTask.IsExtraCredit ? "Yes" : "No";
                            let grade = regularTask.Grade ? regularTask.Grade : "-";
                            regularGrades.push(<tr>
                                <td>{assignment.taskActivities[regularTask.TaskActivityID].DisplayName}</td><td>{grade}</td><td>{isExtraCredit}</td>
                            </tr>);
                        }
                        let grade = workflow.workflowGrade.Grade ? workflow.workflowGrade.Grade : "-";
                        workflowGradesTable.push(<table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                        <thead>
                            <tr><th colSpan="4">Problem Thread {(nestedTables.length + 1).toString()} | Grade: {grade}</th></tr>
                        </thead>
                        <tbody>
                        {regularGrades}
                        {simpleGrades}
                        </tbody>
                        </table>);
                        nestedTables.push(workflowGradesTable);
                    }
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
