import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Utility from './MiscFuncs';


class ProblemTaskAndTimelinessGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayTaskGradeFields(data, numOfTaskGrades, taskID, taskLabel, taskTotalGrade) {
        this.props.displayTaskGradeFields(data, numOfTaskGrades, taskID, taskLabel, taskTotalGrade);
    }

    displayTimelinessGradeDetails(data, taskWorkflowName) {
        this.props.displayTimelinessGradeDetails(data, taskWorkflowName);
    }




    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, PTTGRGradeData, workflowGrade, workflowName, tableSubheader } = this.props;
        let { loaded } = this.state;

        let TablePTTGRGradeData = [];
        let onlyOneTask = PTTGRGradeData.oneTaskNoTimelinessGrade.oneTaskNoTimelinessGrade;
        console.log(onlyOneTask);
        console.log('PTTRGradeData');
        console.log(PTTGRGradeData);
        for (var taskID in PTTGRGradeData) {
            let task = PTTGRGradeData[taskID];
            let taskName = null;
            let drillDownLink = null;

            if (taskID === 'timelinessGrade') {
                drillDownLink = this.displayTimelinessGradeDetails.bind(this, task.timelinessGradeDetails, task.workflowName);
                taskName = (<a href="#" onClick={drillDownLink}>{strings.TimelinessGrade}</a>);
            } else {
                drillDownLink = this.displayTaskGradeFields.bind(this, task.taskGradeFields, task.countOfTaskGrades, taskID, task.name, task.taskGrade);
                taskName = (
                    <a href="#" onClick={drillDownLink}>
                        {task.name + ' (#' + task.taskInstanceID + ')'}
                    </a>
                );
            }

            if (onlyOneTask) {
                drillDownLink = this.displayTaskGradeFields.bind(this, task.taskGradeFields, task.countOfTaskGrades, taskID, task.name, task.taskGrade);
                taskName = (
                    <a href="#" onClick={drillDownLink}>
                        {task.name + ' (#' + task.taskInstanceID + ')'}
                    </a>
                );
                if (!isNaN(taskID)) {
                    TablePTTGRGradeData.push({
                        Task: taskName,
                        Problem: task.workflowName + ' (#' + task.workflowInstanceID + ')',
                        Grade: <a href="#" onClick={drillDownLink}>{task.taskGradeInProgress + ': ' + task.taskGrade}</a>,
                        WeightWProblem: isNaN(task.adjustedWeightInProblem) ? '-' : task.adjustedWeightInProblem + '%',
                        ScaledGradeProblem: isNaN(task.scaledWIGrade) ? '-' : task.taskGradeInProgress + ': ' + task.scaledWIGrade
                    });
                } else if (taskID === 'timelinessGrade') {
                    TablePTTGRGradeData.push({
                        Task: taskName,
                        Problem: task.workflowName,
                        Grade: <a href="#" onClick={drillDownLink}>{task.adjustedTimelinessGradeFromPTGDR + ' (' + task.reachedTaskCount + ' out of ' + task.totalTaskCount + ' reached, ' + task.completedTaskCount + ' complete)'}</a>,
                        WeightWProblem: isNaN(task.simpleGradeWeightInProblem) ? '-' : task.simpleGradeWeightInProblem + '%',
                        ScaledGradeProblem: task.scaledGradeInWA + ' (' + task.completedTaskCount + ' out of ' + task.totalTaskCount + ' complete)',
                    });
                }
            } else {
                if (!isNaN(taskID)) {
                    TablePTTGRGradeData.push({
                        Task: taskName,
                        Problem: task.workflowName + ' (#' + task.workflowInstanceID + ')',
                        Grade: <a href="#" onClick={drillDownLink}>{task.taskGradeInProgress + ': ' + task.taskGrade}</a>,
                        WeightWProblem: isNaN(task.adjustedWeightInProblem) ? '-' : task.adjustedWeightInProblem + '%',
                        ScaledGradeProblem: isNaN(task.scaledWIGrade) ? '-' : task.taskGradeInProgress + ': ' + task.scaledWIGrade,
                        WeightWAssignment: isNaN(task.problemWeightInAssignment) ? '-' : task.problemWeightInAssignment + '%',
                        ScaledGradeAssignment: task.taskGradeInProgress + ': ' + task.scaledGrade
                    });
                }
                else if (taskID === 'timelinessGrade') {
                    TablePTTGRGradeData.push({
                        Task: taskName,
                        Problem: task.workflowName,
                        Grade: <a href="#" onClick={drillDownLink}>{task.adjustedTimelinessGradeFromPTGDR + ' (' + task.reachedTaskCount + ' out of ' + task.totalTaskCount + ' reached, ' + task.completedTaskCount + ' complete)'}</a>,
                        WeightWProblem: isNaN(task.simpleGradeWeightInProblem) ? '-' : task.simpleGradeWeightInProblem + '%',
                        ScaledGradeProblem: task.scaledGradeInWA + ' (' + task.completedTaskCount + ' out of ' + task.totalTaskCount + ' complete)',
                        WeightWAssignment: isNaN(task.problemWeightInAssignment) ? '-' : task.problemWeightInAssignment + '%',
                        ScaledGradeAssignment: task.scaledGrade
                    });
                }
            }
        }

        let cols = onlyOneTask ?
            [{
                Header: Utility.headerWithTooltip(strings.Task, strings.PTTGRTooltips_TaskTT),
                accessor: 'Task',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Problem, strings.PTTGRTooltips_ProblemTT),
                accessor: 'Problem',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Grade, strings.PTTGRTooltips_CurrentGradeTT),
                accessor: 'Grade',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Weight, strings.PTTGRTooltips_WeightWithinProblemTT),
                resizable: true,
                accessor: 'WeightWProblem'
            },
            {
                Header: Utility.headerWithTooltip(strings.ScaledGrade, strings.PTTGRTooltips_CurrentScaledGradeWithinProblemTT),
                accessor: 'ScaledGradeProblem',
                resizable: true
            }] : [{
                Header: Utility.headerWithTooltip(strings.Task, strings.PTTGRTooltips_TaskTT),
                accessor: 'Task',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Problem, strings.PTTGRTooltips_ProblemTT),
                accessor: 'Problem',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Grade, strings.PTTGRTooltips_CurrentGradeTT),
                accessor: 'Grade',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Weight, strings.PTTGRTooltips_WeightWithinProblemTT),
                resizable: true,
                accessor: 'WeightWProblem'
            },
            {
                Header: Utility.headerWithTooltip(strings.ScaledGrade, strings.PTTGRTooltips_CurrentScaledGradeWithinProblemTT),
                accessor: 'ScaledGradeProblem',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.WeightWithinAssignment, strings.PTTGRTooltips_WeightWithinAssignmentTT),
                resizable: true,
                accessor: 'WeightWAssignment'
            },
            {
                Header: Utility.headerWithTooltip(strings.ScaledGradeAssignment, strings.PTTGRTooltips_CurrentScaledGradeWithinAssignmentTT),
                resizable: true,
                accessor: 'ScaledGradeAssignment'
            }];


        TablePTTGRGradeData.push({
            Task: <h2 className="total">{strings.Total}</h2>,
            ScaledGradeProblem: <h2 className="total">{workflowGrade}</h2>
        });



        return (
            <div className="section card-2 sectionTable">
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.PTTGRHeader + ': ' + workflowName, strings.PTTGRTooltip)}
                <h2 className="subtitle">{'Total (Current Scaled Grade Within Problem): ' + workflowGrade}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TablePTTGRGradeData}
                            columns={cols}
                            noDataText={strings.ProblemGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );

    }
}

export default ProblemTaskAndTimelinessGradeReport;