import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as ECG from './ExtraCreditGradeCalculation';


class AssignmentExtraCreditGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayAsgECTimelinessGradesDetailReport(data){
        this.props.displayAsgECTimelinessGradesDetailReport(data);
    }

    displayExtraCreditTaskGradeFieldsReport(data, numOfTaskGrades, taskID){
        this.props.displayExtraCreditTaskGradeFieldsReport(data, numOfTaskGrades, taskID);
    }



    



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, AECGRData, name, grade} = this.props;
        let {loaded} = this.state;
        let TableAECGRData = [];
        console.log("Assignment Extra Credit Grade Report (AECGRData)");
        console.log(AECGRData);

        for (var TIID in AECGRData){
            let TI = AECGRData[TIID];
            let curGrade = () => {
                if (TI.taskGrade === "not yet complete"){
                    return "(in progress)";
                } else {
                    return TI.taskGradeInProgress + ": " + TI.taskGrade;
                }
            };
            if (TI.workflowName === "Entire Assignment" && TI.timelinessGradeDetails != null){
                TableAECGRData.push({
                    Problem: TI.workflowName,
                    Task: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.timelinessGradeDetails)}> 
                        {strings.TimelinessGrade} </a>,
                    CurrentGrade: TI.grade + (TI.totalTaskCount == 0 ? " (none assigned)" : " (" + TI.reachedTaskCount + " out of " + TI.totalTaskCount + " reached, " + TI.completedTaskCount + " complete)"),
                    WeightWProblem: "n/a",
                    ScaledGradeProblem: "n/a",
                    WeightWAssignment: "n/a",
                    ScaledGradeAssignment: "n/a"

                });
            } else if (!isNaN(TIID)){
                TableAECGRData.push({
                    Problem:  TI.workflowName + " (" + TI.workflowInstanceID + ")",
                    Task: <a href="#" onClick={this.displayExtraCreditTaskGradeFieldsReport.bind(this, TI.taskGradeFields, TI.countOfTaskGrades, TI.taskInstanceID)}>
                                {TI.name + " (" + TI.taskInstanceID + ")"} </a>,
                    CurrentGrade: curGrade(),
                    WeightWProblem: TI.adjustedWeightInProblem + "%", 
                    ScaledGradeProblem: curGrade() === "(in progress)" ? "(in progress)" : TI.scaledWIGrade + ": " + TI.taskGradeInProgress,
                    WeightWAssignment: TI.problemWeightInAssignment + "%",
                    ScaledGradeAssignment: curGrade() === "(in progress)" ? "(in progress)" : TI.scaledGrade + ": " + TI.taskGradeInProgress
    
                });
            }
            
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AECGRHeader + ": " +  this.props.name}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECGRData}
                            columns={[
                                {
                                    Header: strings.Problem,
                                    accessor: 'Problem',
                                    resizable:true      
                                },
                                {
                                    Header: strings.Task,
                                    accessor: 'Task',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Grade,
                                    accessor: 'CurrentGrade',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.WeightWithinProblem,
                                    resizable:true,
                                    accessor: 'WeightWProblem'
                                },
                                {
                                    Header: strings.ScaledGradeProblem,
                                    accessor: 'ScaledGradeProblem',
                                    resizable: true
                                },
                                {
                                    Header: strings.WeightWithinAssignment,
                                    resizable:true,
                                    accessor: 'WeightWAssignment'
                                },
                                {
                                    Header: strings.ScaledGradeAssignment,
                                    resizable:true,
                                    accessor: 'ScaledGradeAssignment'
                                }
                            ]}
                            noDataText={strings.TaskGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditGradesReport;