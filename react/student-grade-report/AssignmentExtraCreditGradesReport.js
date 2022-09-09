import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
// import * as ECG from './ExtraCreditGradeCalculation';
import * as Utility from './MiscFuncs';


class AssignmentExtraCreditGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayAsgECTimelinessGradesDetailReport(timelinessGrade, data) {
        this.props.displayAsgECTimelinessGradesDetailReport(timelinessGrade, data);
    }

    displayExtraCreditTaskGradeFieldsReport(data, numOfTaskGrades, taskID) {
        this.props.displayExtraCreditTaskGradeFieldsReport(data, numOfTaskGrades, taskID);
    }







    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, AECGRData, extraCreditTaskGradeNum, extraCreditTaskGrade, tableSubheader } = this.props;
        let { loaded } = this.state;
        let TableAECGRData = [];
        console.log('Assignment Extra Credit Grade Report (AECGRData)');
        console.log(AECGRData);

        let allWorkflowsOneTaskNoTimeliness = AECGRData.allTasks100.allTasks100;

        console.log("allWorkflowsOneTaskNoTimeliness: ");
        console.log(allWorkflowsOneTaskNoTimeliness);

        for (var TIID in AECGRData) {
            let TI = AECGRData[TIID];
            let curGrade = () => {
                if (TI.taskGrade === 'not yet complete') {
                    return '(in progress)';
                } else {
                    return TI.taskGradeInProgress + ': ' + TI.taskGrade;
                }
            };

            if (allWorkflowsOneTaskNoTimeliness) {
                TableAECGRData.push({
                    Problem: TI.workflowName,
                    Task: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.timelinessGradeDetails)}>
                        {strings.TimelinessGrade} </a>,
                    CurrentGrade: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.timelinessGradeDetails)}>
                        {TI.grade + (TI.totalTaskCount == 0 ? ' (none assigned)' : ' (' + TI.reachedTaskCount + ' out of ' + TI.totalTaskCount + ' reached, ' + TI.completedTaskCount + ' complete)')}</a>,
                    WeightWProblem: 'n/a',
                    ScaledGradeProblem: 'n/a'
                });
            } else {
                if (TI.workflowName === 'Entire Assignment' && TI.timelinessGradeDetails != null) {
                    TableAECGRData.push({
                        Problem: TI.workflowName,
                        Task: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.grade, TI.timelinessGradeDetails)}>
                            {strings.TimelinessGrade} </a>,
                        CurrentGrade: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.grade, TI.timelinessGradeDetails)}>
                            {TI.grade + (TI.totalTaskCount == 0 ? ' (none assigned)' : ' (' + TI.reachedTaskCount + ' out of ' + TI.totalTaskCount + ' reached, ' + TI.completedTaskCount + ' complete)')}</a>,
                        WeightWProblem: 'n/a',
                        ScaledGradeProblem: 'n/a',
                        WeightWAssignment: 'n/a',
                        ScaledGradeAssignment: 'n/a'

                    });
                } else if (!isNaN(TIID)) {
                    TableAECGRData.push({
                        Problem: TI.workflowName + ' (#' + TI.workflowInstanceID + ')',
                        Task: <a href="#" onClick={this.displayExtraCreditTaskGradeFieldsReport.bind(this, TI.taskGradeFields, TI.countOfTaskGrades, TI.taskInstanceID)}>
                            {TI.name + ' (#' + TI.taskInstanceID + ')'} </a>,
                        CurrentGrade: <a href="#" onClick={this.displayExtraCreditTaskGradeFieldsReport.bind(this, TI.taskGradeFields, TI.countOfTaskGrades, TI.taskInstanceID)}>
                            {curGrade()} </a>,
                        WeightWProblem: TI.adjustedWeightInProblem + '%',
                        ScaledGradeProblem: curGrade() === '(in progress)' ? '(in progress)' : TI.scaledWIGrade + ': ' + TI.taskGradeInProgress,
                        WeightWAssignment: TI.problemWeightInAssignment + '%',
                        ScaledGradeAssignment: curGrade() === '(in progress)' ? '(in progress)' : TI.scaledGrade + ': ' + TI.taskGradeInProgress

                    });
                }
            }


        }



        // if (allWorkflowsOneTaskNoTimeliness) {
        //     TableAECGRData.push({
        //         Problem: <h2 className="total">{strings.Total}</h2>,
        //         ScaledGradeProblem: <h2 className="total">{extraCreditTaskGrade}</h2>
        //     });
        // } else {
        //     TableAECGRData.push({
        //         Problem: <h2 className="total">{strings.Total}</h2>,
        //         ScaledGradeAssignment: <h2 className="total">{extraCreditTaskGrade}</h2>
        //     });
        // }

        let cols = allWorkflowsOneTaskNoTimeliness ?

            [
                {
                    Header: Utility.headerWithTooltip(strings.Problem, strings.AECGR_ProblemTT),
                    accessor: 'Problem',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Task, strings.AECGR_TaskTT),
                    accessor: 'Task',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Grade, strings.AECGR_CurrentGradeTT),
                    accessor: 'CurrentGrade',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Weight, strings.AECGR_WeightWithinProblemTT),
                    resizable: true,
                    accessor: 'WeightWProblem'
                },
                {
                    Header: Utility.headerWithTooltip(strings.ScaledGrade, strings.AECGR_CurrentScaledGradeWithinProblemTT),
                    accessor: 'ScaledGradeProblem',
                    resizable: true
                }] :
            [
                {
                    Header: Utility.headerWithTooltip(strings.Problem, strings.AECGR_ProblemTT),
                    accessor: 'Problem',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Task, strings.AECGR_TaskTT),
                    accessor: 'Task',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Grade, strings.AECGR_CurrentGradeTT),
                    accessor: 'CurrentGrade',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.Weight, strings.AECGR_WeightWithinProblemTT),
                    resizable: true,
                    accessor: 'WeightWProblem'
                },
                {
                    Header: Utility.headerWithTooltip(strings.ScaledGrade, strings.AECGR_CurrentScaledGradeWithinProblemTT),
                    accessor: 'ScaledGradeProblem',
                    resizable: true
                },
                {
                    Header: Utility.headerWithTooltip(strings.WeightWithinAssignment, strings.AECGR_WeightWithinAssignmentTT),
                    resizable: true,
                    accessor: 'WeightWAssignment'
                },
                {
                    Header: Utility.headerWithTooltip(strings.ScaledGradeAssignment, strings.AECGR_CurrentScaledGradeWithinAssignmentTT),
                    resizable: true,
                    accessor: 'ScaledGradeAssignment'
                }
            ];

        return (
            <div className="section card-2 sectionTable" >
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.AECGRHeader + ': ' + this.props.name, strings.AECGRTooltip)}
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECGRData}
                            columns={cols}
                            noDataText={strings.TaskGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );

    }
}

export default AssignmentExtraCreditGradesReport;