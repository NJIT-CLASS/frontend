import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class AssignmentGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            GradeReportRoot:null
        };
    }

    componentDidMount(){
        apiCall.post(`/gradeReport`,{ai_id:this.props.AI_ID},(err,status,body)=>{
            if(status.statusCode === 200){
                console.log(body);
                this.setState({GradeReportRoot:body.assignmentGradeReport, loaded:true});
            }
        });
    }

    displayProblemGradeReport(data){
        console.log("Problem/Workflow Grade Report:");
        console.log("data");
        console.log(data);
        this.props.displayProblemGradeReport(data);
    }

    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings} = this.props;
        let {loaded, GradeReportRoot} = this.state;


        if(!loaded){
            return (<div></div>);
        }
        
        let AGRData = [];
        for(var userID in GradeReportRoot){
            let userReport = GradeReportRoot[userID];
            console.log(userReport);
            var PGRGradeData = userReport.workflowGradeReport;
            var sumProblemGrades = 0;
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
    
                console.log("Sum of problem grades");
                if (!isNaN(taskGradesSum))
                    sumProblemGrades+=taskGradesSum; 
                console.log(sumProblemGrades);
            
            }

            sumProblemGrades = sumProblemGrades.toFixed(2);
            var assignmentGrade = (statusLabel == "in progress") ? ("(" + statusLabel +  ": " + sumProblemGrades + ")") : sumProblemGrades; 
            console.log("Assignment Grade"); 
            console.log(assignmentGrade);

            AGRData.push({
                LastName:userReport.lastName,
                FirstName:userReport.firstName,
                Email:userReport.email,
                AssignmentGrade: <a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport)}>{assignmentGrade}</a>,    
                NumXCreditTasks: userReport.numOfExtraCredit ? Object.keys(userReport.numOfExtraCredit).length : "0"
            });
        }


        console.log("AGR Data");
        console.log(AGRData);
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AGRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={AGRData}
                            columns={[
                                {
                                    Header: strings.LastName,
                                    accessor: 'LastName',
                                    resizable:true      
                                },
                                {
                                    Header: strings.FirstName,
                                    accessor: 'FirstName',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Email,
                                    accessor: 'Email',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.AssignmentGrade,
                                    resizable:true,
                                    accessor: 'AssignmentGrade'
                                },
                                {
                                    Header: strings.CurrXCreditGrade,
                                    resizable:true,
                                    accessor: 'CurrXCreditGrade'
                                },
                                {
                                    Header: strings.NumXCreditTasks,
                                    resizable:true,
                                    accessor: 'NumXCreditTasks'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'LastName',
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

export default AssignmentGradeReport;