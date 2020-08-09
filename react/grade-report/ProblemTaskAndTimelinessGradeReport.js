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
        let {strings, PTTGRGradeData} = this.props;
        let {loaded} = this.state;

        console.log(PTTGRGradeData);

        let TablePTTGRGradeData = [];
        for(var taskID in PTTGRGradeData){
            let task = PTTGRGradeData[taskID];

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

            TablePTTGRGradeData.push({
                Task: taskName, 
                Problem: taskID === "timelinessGrade" ? task.workflowName : task.workflowInstanceID + ": " + task.workflowName,
                Grade: taskID === "timelinessGrade" ? task.taskSimpleGrade : task.taskGrade,
                WeightWProblem: task.weightInProblem + "%",
                WeightWAssignment: task.weightInAssignment + "%",
                ScaledGradeProblem: (taskID === "timelinessGrade" ? task.taskSimpleGrade : task.taskGrade) * (task.weightInProblem/100),
                ScaledGrade: task.scaledGrade
            });
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
                                    Header: strings.ScaledGrade,
                                    resizable:true,
                                    accessor: 'ScaledGrade'
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