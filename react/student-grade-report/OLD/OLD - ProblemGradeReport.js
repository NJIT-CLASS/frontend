import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class ProblemGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayProblemTaskAndTimelinessGradeReport(data, workflowGrade){
        this.props.displayProblemTaskAndTimelinessGradeReport(data, workflowGrade);
    }



    render(){
        let {strings, PGRGradeData} = this.props;
        let {loaded} = this.state;
        console.log("PGR Grade Data");
        console.log(PGRGradeData);
        let TablePGRGradeData = [];
        for(var workflowID in PGRGradeData){
            let workflowData = PGRGradeData[workflowID];
            var taskGradesSum = 0;
            var statusLabel = "";
            for(var taskID in workflowData.problemAndTimelinessGrade){
                let task = workflowData.problemAndTimelinessGrade[taskID];
                
                //generating timeliness grade
                var sumTimelinessGrade = 0;
                var completedTIs = 0;
                var allTIs = 0;
                if (taskID === "timelinessGrade"){
                    
                    var TGD = task.timelinessGradeDetails
                    for (var ID in TGD){
                        
                        if (TGD[ID].totalPenalty != undefined && TGD[ID].penalty != undefined && TGD[ID].grade != undefined){
                            sumTimelinessGrade += (TGD[ID].grade * (1 - TGD[ID].totalPenalty/100));
                        }
                        if (TGD[ID].status === "complete"){
                            completedTIs++;
                        }
                        allTIs++;
                    }
                    if (completedTIs != allTIs)
                        statusLabel = "in progress";

                    if (task.weightInProblem !== "n/a")
                        taskGradesSum+=sumTimelinessGrade * task.weightInProblem/100;
                    
                }

                
                //generating task grade for non-completely graded tasks
                else if (taskID !== "timelinessGrade" && task.taskGrade === "not yet complete"){
                    var calculatedTaskGrade = Number.NEGATIVE_INFINITY;
                    if (Object.keys(task.taskGradeFields).length === 0) calculatedTaskGrade = "-";
                    else {
                        //iterating over task instances present in taskGradeFields
                        for (var TI in task.taskGradeFields){
                            var taskInstance = task.taskGradeFields[TI]; 
                            var sumOfScaledGrades = 0;
                            var convNumGrade = 0;
                            //calculating the sum of the scaled grades from each task instance
                            for (var f in taskInstance){
                                var field = taskInstance[f];
                                if (field.type === "Label")
                                    convNumGrade = 100;
                                else if (field.type === "Pass/Fail")
                                    convNumGrade = field.value == "pass" ? 100 : 0;
                                else 
                                    convNumGrade = ((field.value/field.max) * 100).toFixed(2); 
                                sumOfScaledGrades+=convNumGrade*field.weight;
                            }
                            //storing the grade of the task instance with the highest grade in calculatedTaskGrade
                            if (sumOfScaledGrades > calculatedTaskGrade)
                                calculatedTaskGrade = sumOfScaledGrades;
                            
                            if (!isNaN(task.weightInProblem))
                                taskGradesSum+=calculatedTaskGrade * task.weightInProblem/100;
                            
                            statusLabel = "in progress";
                            
                        }
                    }
                    
                    
                }
                else if (taskID !== "timelinessGrade" && task.taskGrade !== "not yet complete"){
                    calculatedTaskGrade = task.taskGrade;
                    //if workflowGrade==null, then include "in progress"
                    if (workflowData.workflowGrade === "not yet complete"){
                        statusLabel = "in progress";
                    }
                    
                    if (!isNaN(task.weightInProblem) && !isNaN(calculatedTaskGrade))
                        taskGradesSum+=calculatedTaskGrade * task.weightInProblem/100;
                }
            }

            var problemGrade = taskGradesSum;
            var problemGradeString = (statusLabel == "in progress") ? ("(" + statusLabel +  ": " + taskGradesSum.toFixed(2) + ")") : taskGradesSum; 
            var scaledGrade = (problemGrade * (workflowData.weight/100))/(workflowData.numberOfSets).toFixed(2);

            TablePGRGradeData.push({
                Problem: (<a href="#" onClick={this.displayProblemTaskAndTimelinessGradeReport.bind(this, workflowData.problemAndTimelinessGrade, workflowData.workflowGrade)}>{workflowData.name}</a>),
                ProblemGrade: isNaN(problemGrade) ? "-" : problemGradeString,
                ProblemsPerStudent: workflowData.numberOfSets,
                Weight: workflowData.weight + "%",
                ScaledGrade: isNaN(scaledGrade) ? "-" : scaledGrade 
                //ScaledGrade: workflowData.scaledGrade
                //scaled grade within assignment = current grade *weight within assignment/ original number of problems per student
            });
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PGRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TablePGRGradeData}
                            columns={[
                                {
                                    Header: strings.Problem,
                                    accessor: 'Problem',
                                    resizable:true      
                                },
                                {
                                    Header: strings.ProblemGrade,
                                    accessor: 'ProblemGrade',
                                    resizable:true
                                },
                                {         
                                    Header: strings.ProblemsPerStudent,
                                    accessor: 'ProblemsPerStudent',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.WeightWithinAssignment,
                                    resizable:true,
                                    accessor: 'Weight'
                                },
                                {
                                    Header: strings.ScaledGradeAssignment,
                                    resizable:true,
                                    accessor: 'ScaledGrade'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'Problem',
                                    desc: true
                                }
                            ]}
                            noDataText={strings.AssignmentGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default ProblemGradesReport;