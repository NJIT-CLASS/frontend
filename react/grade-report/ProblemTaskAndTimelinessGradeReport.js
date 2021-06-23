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

    displayTaskGradeFields(data, numOfTaskGrades, taskID){
        this.props.displayTaskGradeFields(data, numOfTaskGrades, taskID);
    }

    displayTimelinessGradeDetails(data){
        this.props.displayTimelinessGradeDetails(data);
    }

    


    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, PTTGRGradeData, workflowGrade, workflowName} = this.props;
        let {loaded} = this.state;
        console.log("PTTRGradeData");
        console.log(PTTGRGradeData);

        let TablePTTGRGradeData = [];
        for(var taskID in PTTGRGradeData){
            let task = PTTGRGradeData[taskID];
            let taskName = null;
            if(taskID === "timelinessGrade"){
                taskName = (<a href="#" onClick={this.displayTimelinessGradeDetails.bind(this, task.timelinessGradeDetails)}>{strings.TimelinessGrade}</a>);
            } else {
                taskName = (
                    <a href="#" onClick={this.displayTaskGradeFields.bind(this, task.taskGradeFields, task.countOfTaskGrades, taskID)}>
                        {task.taskInstanceID + ": " + task.name}
                        </a>
                    );
            }

            
            if (!isNaN(taskID)){
                TablePTTGRGradeData.push({
                    Task: taskName, 
                    Problem: task.workflowInstanceID + ": " + task.workflowName,
                    Grade: task.taskGradeInProgress + ": " + task.taskGrade,
                    WeightWProblem: isNaN(task.adjustedWeightInProblem) ? "-" : task.adjustedWeightInProblem + "%",
                    ScaledGradeProblem: isNaN(task.scaledWIGrade) ? "-" : task.taskGradeInProgress + ": " + task.scaledWIGrade, 
                    WeightWAssignment: isNaN(task.problemWeightInAssignment) ? "-" : task.problemWeightInAssignment + "%",
                    ScaledGradeAssignment: task.taskGradeInProgress + ": " + task.scaledGrade
                });
                
            }
            else if (taskID === "timelinessGrade"){
                TablePTTGRGradeData.push({
                    Task: taskName,
                    Problem: task.workflowName,
                    Grade: task.adjustedTimelinessGradeFromPTGDR + " (" + task.reachedTaskCount + " out of " + task.totalTaskCount + " reached, " + task.completedTaskCount + " complete)",
                    WeightWProblem: isNaN(task.simpleGradeWeightInProblem) ? "-" : task.simpleGradeWeightInProblem + "%",
                    ScaledGradeProblem: task.scaledGradeInWA + " (" + task.completedTaskCount + " out of " + task.totalTaskCount + " complete)",
                    WeightWAssignment: isNaN(task.problemWeightInAssignment) ? "-" :  task.problemWeightInAssignment + "%",
                    ScaledGradeAssignment: task.scaledGrade
                });
            }
        }
        


        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PTTGRHeader + ": " + workflowName}</h2>
                <h4 className="title">{"Total: " + workflowGrade}</h4>
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