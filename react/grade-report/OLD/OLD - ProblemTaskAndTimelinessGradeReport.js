import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class ProblemTaskAndTimelinessGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayTaskGradeFields(data){
        this.props.displayTaskGradeFields(data);
    }

    displayTimelinessGradeDetails(data){
        this.props.displayTimelinessGradeDetails(data);
    }

    


    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, PTTGRGradeData, workflowGrade} = this.props;
        let {loaded} = this.state;
        console.log("PTTRGradeData");
        console.log(PTTGRGradeData);

        let TablePTTGRGradeData = [];
        for(var taskID in PTTGRGradeData){
            let task = PTTGRGradeData[taskID];

            //generating a tag for task name--includes the task instance ID followed by the name
            var taskName = null;
            if(taskID === "timelinessGrade"){
                taskName = (<a href="#" onClick={this.displayTimelinessGradeDetails.bind(this, task.timelinessGradeDetails)}>{strings.TimelinessGrade}</a>);
            } else {
                taskName = (
                    <a href="#" onClick={this.displayTaskGradeFields.bind(this, task.taskGradeFields)}>
                        {task.taskInstanceID + ": " + task.name}
                        </a>
                    );
            }

            
            //generating timeliness grade
            var sumTimelinessGrade = 0;
            var completedTIs = 0;
            var allTIs = 0;
            if (taskID === "timelinessGrade"){
                console.log(task.timelinessGradeDetails);
                var TGD = task.timelinessGradeDetails
                for (var ID in TGD){
                    console.log(ID)
                    if (TGD[ID].totalPenalty != undefined && TGD[ID].penalty != undefined && TGD[ID].grade != undefined){
                        sumTimelinessGrade += (TGD[ID].grade * (1 - TGD[ID].totalPenalty/100));
                    }
                        
                    if (TGD[ID].status === "complete"){
                        completedTIs++;
                    }
                    allTIs++;
                }
                console.log("sumoftimelinessgrade: " + sumTimelinessGrade); 
                sumTimelinessGrade = sumTimelinessGrade.toFixed(2)
            }

            //the current timeliness grade string: # (A out of B Complete)
            var currentTimelinessGrade = sumTimelinessGrade + " (" + completedTIs + " out of " + allTIs + " complete)";

            //generating task grade for non-completely graded tasks
            
            if (taskID !== "timelinessGrade" && task.taskGrade === "not yet complete"){
                var calculatedTaskGrade = Number.NEGATIVE_INFINITY;
                var calculatedTaskGradeString = "";
                //iterating over task instances present in taskGradeFields
                if (Object.keys(task.taskGradeFields).length === 0) calculatedTaskGrade = "-";
                else {
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
                        
                    }
                }                
                
            }
            else if (taskID !== "timelinessGrade" && task.taskGrade !== "not yet complete"){
                if (!isNaN(task.taskGrade)){
                    calculatedTaskGrade = task.taskGrade;
                    //if workflowGrade==null, then include "in progress"
                    if (workflowGrade === "not yet complete"){
                        calculatedTaskGradeString = "(in progress: " + calculatedTaskGrade.toFixed(2) + ")";
                    }
                }
                else calculatedTaskGrade = "-";
                
                
            }
            
            var scaledGrade = (taskID === "timelinessGrade" ? sumTimelinessGrade * task.weightInProblem/100 : 
                                    (isNaN(calculatedTaskGrade)  ? "-" : calculatedTaskGrade * task.weightInProblem/100))
            if (!isNaN(scaledGrade)) scaledGrade = scaledGrade.toFixed(2);
            
            if (task.weightInProblem !== "n/a"){
                TablePTTGRGradeData.push({
                    Task: taskName, 
                    Problem: taskID === "timelinessGrade" ? task.workflowName : task.workflowInstanceID + ": " + task.workflowName,
                    Grade: taskID === "timelinessGrade" ? currentTimelinessGrade : calculatedTaskGradeString,
                    WeightWProblem: isNaN(task.weightInProblem) ? "-" : task.weightInProblem + "%",
                    WeightWAssignment: isNaN(task.weightInProblem) ? "-" : task.weightInProblem + "%",
                    //WeightWAssignment: task.weightInAssignment + "%", ==> TEMPORARILY weight in problem = weight in assignment
                    ScaledGradeProblem: isNaN(scaledGrade) ? "-" : scaledGrade, 
                    //ScaledGradeAssignment: task.scaledGrade
                    ScaledGradeAssignment: isNaN(scaledGrade) ? "-" : scaledGrade
                });
                
            }
        }
        


        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PTTGRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TablePTTGRGradeData}
                            columns={[
                                {
                                    Header: strings.Task,
                                    accessor: 'Task',
                                    resizable:true      
                                },
                                {
                                    Header: strings.Problem,
                                    accessor: 'Problem',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Grade,
                                    accessor: 'Grade',
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
                            noDataText={strings.ProblemGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default ProblemTaskAndTimelinessGradeReport;