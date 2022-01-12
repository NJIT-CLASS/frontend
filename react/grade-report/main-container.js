import React from 'react';
import apiCall from '../shared/apiCall';
import AssignmentGradeReport from './AssignmentGradeReport';
import ProblemGradeReport from './ProblemGradeReport';
import ProblemTaskAndTimelinessGradeReport from './ProblemTaskAndTimelinessGradeReport';
import TaskGradeFieldsReport from './TaskGradeFieldsReport';
import ProblemTimelinessGradeDetailsReport from './ProblemTimelinessGradeDetailsReport';
import AssignmentExtraCreditGradesReport from './AssignmentExtraCreditGradesReport';
import AssignmentExtraCreditTasksReport from './AssignmentExtraCreditTasksReport';
import AssignmentExtraCreditTimelinessGradesDetailReport from './AssignmentExtraCreditTimelinessGradesDetailReport';
import SelectAssignment from './SelectAssignment';
import AssignmentExtraCreditTaskGradeFieldsReport from './AssignmentExtraCreditTaskGradeFieldsReport';
import strings from './strings';

class GradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Strings:null,
            assignmentGradereport:null,
            problemGradeReport:null,
            problemTaskAndTimelinessGradeReport:null,
            taskGradeFieldsReport:null,
            problemTimelinessGradeDetailsReport:null,
            assignmentExtraCreditGradesReport: null,
            assignmentExtraCreditTasksReport: null,
            assignmentExtraCreditTimelinessGradesDetailReport:null,
            assignmentExtraCreditTaskGradeFieldsReport:null
        };



        this.undisplayAssignmentGradeReport = this.undisplayAssignmentGradeReport.bind(this);

        this.displayAssignmentGradeReport = this.displayAssignmentGradeReport.bind(this);
        this.displayProblemGradeReport = this.displayProblemGradeReport.bind(this);
        this.displayProblemTaskAndTimelinessGradeReport = this.displayProblemTaskAndTimelinessGradeReport.bind(this);
        this.displayTaskGradeFields = this.displayTaskGradeFields.bind(this);
        this.displayTimelinessGradeDetails = this.displayTimelinessGradeDetails.bind(this);
        this.displayAssignmentExtraCreditGradeReport = this.displayAssignmentExtraCreditGradeReport.bind(this);
        this.displayAsgECTimelinessGradesDetailReport = this.displayAsgECTimelinessGradesDetailReport.bind(this);
        this.displayAssignmentExtraCreditTasksReport = this.displayAssignmentExtraCreditTasksReport.bind(this);
        this.displayExtraCreditTaskGradeFieldsReport = this.displayExtraCreditTaskGradeFieldsReport.bind(this);
    }

    componentDidMount(){
        this.props.__(strings, (newStrings) => {
            this.setState({Strings:newStrings});
        });
    }

    undisplayAssignmentGradeReport(){
        this.setState({
            assignmentGradereport:null, 
            problemGradeReport:null,
            problemTaskAndTimelinessGradeReport:null,
            taskGradeFieldsReport:null,
            problemTimelinessGradeDetailsReport:null,
            assignmentExtraCreditGradesReport: null,
            assignmentExtraCreditTasksReport: null,
            assignmentExtraCreditTimelinessGradesDetailReport:null,
            assignmentExtraCreditTaskGradeFieldsReport:null
        });
    }

    displayAssignmentGradeReport(AI_ID, sectionID, assignmentIdentifier){
        this.setState({
            assignmentGradereport:(
                <AssignmentGradeReport 
                    strings={this.state.Strings} 
                    displayProblemGradeReport={this.displayProblemGradeReport} 
                    displayAssignmentExtraCreditGradeReport={this.displayAssignmentExtraCreditGradeReport}
                    displayAssignmentExtraCreditTasksReport={this.displayAssignmentExtraCreditTasksReport}
                    AI_ID={AI_ID}
                    sectionID={sectionID}
                    assignmentIdentifier={assignmentIdentifier}
                    UserID={this.props.UserID}>
                </AssignmentGradeReport>
            )
        });
    }

    // undisplayAssignmentGradeReport(){
    //     this.setState({assignmentGradereport: (<div></div>)})
    // }


    displayProblemGradeReport(workflowData, user, userGrade){
        console.log("Grade Data for displayProblemGradeReport: ");
        console.log(workflowData);
        console.log("Delete from below pgr");
        this.setState({
            problemTaskAndTimelinessGradeReport:null,
            taskGradeFieldsReport:null,
            problemTimelinessGradeDetailsReport:null,
            problemGradeReport:(
            <ProblemGradeReport 
                strings={this.state.Strings} 
                PGRGradeData={workflowData} 
                name={user}
                userGrade={userGrade}
                displayProblemTaskAndTimelinessGradeReport={this.displayProblemTaskAndTimelinessGradeReport}>
            </ProblemGradeReport>
        )});
        
    }

    displayProblemTaskAndTimelinessGradeReport(gradeData, grade, workflowName){
        this.setState({
            taskGradeFieldsReport:null,
            problemTimelinessGradeDetailsReport:null,
            problemTaskAndTimelinessGradeReport:(
            <ProblemTaskAndTimelinessGradeReport 
                strings={this.state.Strings} 
                PTTGRGradeData={gradeData} 
                workflowGrade = {grade}
                workflowName = {workflowName}
                displayTaskGradeFields={this.displayTaskGradeFields} 
                displayTimelinessGradeDetails={this.displayTimelinessGradeDetails}>
            </ProblemTaskAndTimelinessGradeReport>)
        });
    }

    displayTaskGradeFields(gradeData, numOfTaskGrades, taskID, taskLabel, taskTotalGrade){
        this.setState({
            taskGradeFieldsReport:(
            <TaskGradeFieldsReport 
                strings={this.state.Strings} 
                numOfTaskGrades={numOfTaskGrades}
                taskID={taskID}
                taskLabel={taskLabel}
                taskTotalGrade={taskTotalGrade}
                TGFRGradeData={gradeData}>
            </TaskGradeFieldsReport>)
        });
    }

    displayTimelinessGradeDetails(gradeData, taskWorkflowName){
        this.setState({
            problemTimelinessGradeDetailsReport:(
            <ProblemTimelinessGradeDetailsReport 
                strings={this.state.Strings} 
                taskWorkflowName={taskWorkflowName}
                PTGDRGradeData={gradeData}>
            </ProblemTimelinessGradeDetailsReport>)
        });
    }


    /* extra credit displays */
    displayAssignmentExtraCreditGradeReport(gradeData, username, userGrade){
        this.setState({
            assignmentExtraCreditTimelinessGradesDetailReport: null,
            assignmentExtraCreditTaskGradeFieldsReport: null,
            assignmentExtraCreditGradesReport:(
                <AssignmentExtraCreditGradesReport 
                    strings={this.state.Strings}
                    AECGRData={gradeData}
                    displayAsgECTimelinessGradesDetailReport={this.displayAsgECTimelinessGradesDetailReport}
                    displayExtraCreditTaskGradeFieldsReport={this.displayExtraCreditTaskGradeFieldsReport}
                    name={username}
                    grade={userGrade}>
                </AssignmentExtraCreditGradesReport>
            )
        });
    }

    displayAssignmentExtraCreditTasksReport(gradeData, username, userGrade){
        this.setState({
            assignmentExtraCreditTasksReport:(
                <AssignmentExtraCreditTasksReport
                    strings={this.state.Strings}
                    AECTRData={gradeData}
                    name={username}
                    grade={userGrade}>
                </AssignmentExtraCreditTasksReport>
            )
        })
    }

    displayAsgECTimelinessGradesDetailReport(gradeData){
        this.setState({
            assignmentExtraCreditTimelinessGradesDetailReport:(
                <AssignmentExtraCreditTimelinessGradesDetailReport
                    strings={this.state.Strings}
                    AECTGDRData={gradeData}>
                </AssignmentExtraCreditTimelinessGradesDetailReport>
            )
        });
    }

    displayExtraCreditTaskGradeFieldsReport(gradeData, numOfTaskGrades, taskID){
        this.setState({
            assignmentExtraCreditTaskGradeFieldsReport: (
                <AssignmentExtraCreditTaskGradeFieldsReport
                    strings={this.state.Strings}
                    numOfTaskGrades={numOfTaskGrades}
                    taskID={taskID}
                    ECTGFRData={gradeData}>
                </AssignmentExtraCreditTaskGradeFieldsReport>
            )
        })
    }



    render(){
        let {
            Strings, 
            assignmentGradereport,
            problemGradeReport, 
            problemTaskAndTimelinessGradeReport, 
            taskGradeFieldsReport, 
            problemTimelinessGradeDetailsReport,
            assignmentExtraCreditGradesReport,
            assignmentExtraCreditTasksReport,
            assignmentExtraCreditTimelinessGradesDetailReport,
            assignmentExtraCreditTaskGradeFieldsReport
        } = this.state;

        if(!Strings){
            return (<div></div>);
        }

        //console.log("PAGE under development");
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        return (
            <div>
                <SelectAssignment strings={Strings} UserID={this.props.UserID} 
                undisplayAssignmentGradeReport={this.undisplayAssignmentGradeReport} 
                displayAssignmentGradeReport={this.displayAssignmentGradeReport}></SelectAssignment>
                {assignmentGradereport}
                    {problemGradeReport}
                        {problemTaskAndTimelinessGradeReport}
                            {taskGradeFieldsReport}
                            {problemTimelinessGradeDetailsReport}
                    {assignmentExtraCreditGradesReport}
                        {assignmentExtraCreditTaskGradeFieldsReport}
                        {assignmentExtraCreditTimelinessGradesDetailReport}
                    {assignmentExtraCreditTasksReport}
                
            </div>    
        
        );
    }
}

export default GradeReport;