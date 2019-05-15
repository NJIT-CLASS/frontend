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
            assignmentExtraCreditTimelinessGradesDetailReport:null
        };

        this.displayAssignmentGradeReport = this.displayAssignmentGradeReport.bind(this);
        this.displayProblemGradeReport = this.displayProblemGradeReport.bind(this);
        this.displayProblemTaskAndTimelinessGradeReport = this.displayProblemTaskAndTimelinessGradeReport.bind(this);
        this.displayTaskGradeFields = this.displayTaskGradeFields.bind(this);
        this.displayTimelinessGradeDetails = this.displayTimelinessGradeDetails.bind(this);
    }

    componentDidMount(){
        this.props.__(strings, (newStrings) => {
            this.setState({Strings:newStrings});
        });
    }

    displayAssignmentGradeReport(gradeData){
        console.log(gradeData);
        this.setState({assignmentGradereport:(<AssignmentGradeReport strings={this.state.Strings} displayProblemGradeReport={this.displayProblemGradeReport} AI_ID={gradeData}></AssignmentGradeReport>)})
    }

    displayProblemGradeReport(gradeData){
        this.setState({problemGradeReport:(<ProblemGradeReport strings={this.state.Strings} PGRGradeData={gradeData} displayProblemTaskAndTimelinessGradeReport={this.displayProblemTaskAndTimelinessGradeReport}></ProblemGradeReport>)})
    }

    displayProblemTaskAndTimelinessGradeReport(gradeData){
        this.setState({problemTaskAndTimelinessGradeReport:(<ProblemTaskAndTimelinessGradeReport strings={this.state.Strings} PTTGRGradeData={gradeData} displayTaskGradeFields={this.displayTaskGradeFields} displayTimelinessGradeDetails={this.displayTimelinessGradeDetails}></ProblemTaskAndTimelinessGradeReport>)})
    }

    displayTaskGradeFields(gradeData){
        this.setState({taskGradeFieldsReport:(<TaskGradeFieldsReport strings={this.state.Strings} TGFRGradeData={gradeData}></TaskGradeFieldsReport>)});
    }

    displayTimelinessGradeDetails(gradeData){
        this.setState({problemTimelinessGradeDetailsReport:(<ProblemTimelinessGradeDetailsReport strings={this.state.Strings} PTGDRGradeData={gradeData}></ProblemTimelinessGradeDetailsReport>)});
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
            assignmentExtraCreditTimelinessGradesDetailReport
        } = this.state;

        if(!Strings){
            return (<div></div>);
        }
        console.log(problemGradeReport);
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        return (
            <div>
                <SelectAssignment strings={Strings} UserID={this.props.UserID} displayAssignmentGradeReport={this.displayAssignmentGradeReport}></SelectAssignment>
                {assignmentGradereport}
                {problemGradeReport}
                    {problemTaskAndTimelinessGradeReport}
                        {taskGradeFieldsReport}
                        {problemTimelinessGradeDetailsReport}
                {assignmentExtraCreditGradesReport}
                    {assignmentExtraCreditTimelinessGradesDetailReport}
                {assignmentExtraCreditTasksReport}
            </div>    
        
        );
    }
}

export default GradeReport;