import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Utility from './MiscFuncs';


class ProblemGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    displayProblemTaskAndTimelinessGradeReport(data, workflowGrade, workflowName) {
        this.props.displayProblemTaskAndTimelinessGradeReport(data, workflowGrade, workflowName);
    }



    render() {
        let { strings, name, userGrade, PGRGradeData, oneWorkflow, tableSubheader } = this.props;

        console.log("usergrade " + userGrade);
        console.log("PGR Grade Data");
        console.log(PGRGradeData);
        let TablePGRGradeData = [];
        for (var workflowID in PGRGradeData) {
            let workflowData = PGRGradeData[workflowID];

            if (workflowData != null && workflowData.name != null) {
                let wfInfo = workflowData.problemAndTimelinessGrade;
                let problemGrade = wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waScaledGradeSummation; //wa or assignmentScaledGradeSummation?
                let drillDown = this.displayProblemTaskAndTimelinessGradeReport.bind(this, workflowData.problemAndTimelinessGrade, problemGrade, workflowData.name);

                if (oneWorkflow) {
                    this.displayProblemTaskAndTimelinessGradeReport.bind(
                        this,
                        workflowData.problemAndTimelinessGrade,
                        problemGrade,
                        workflowData.name
                    );
                    return null;
                }

                TablePGRGradeData.push({
                    Problem: (<a href="#" onClick={drillDown}>{workflowData.name}</a>),
                    ProblemGrade: <a href="#" onClick={drillDown}>{wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waInProgress + ": " + wfInfo.waStatistics.waScaledGradeSummation}</a>,
                    ProblemsPerStudent: workflowData.numberOfSets,
                    Weight: workflowData.weight + "%",
                    ScaledGrade: wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waInProgress + ": " + wfInfo.waStatistics.assignmentScaledGradeSummation
                    //ScaledGrade: workflowData.scaledGrade
                    //scaled grade within assignment = current grade *weight within assignment/ original number of problems per student
                });
            }

        }

        TablePGRGradeData.push({
            Problem: <h2 className="total">Total</h2>,
            ScaledGrade: <h2 className="total">{userGrade}</h2>,
        });

        return (
            <div className="section card-2 sectionTable">
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.PGRHeader + ': ' + name, strings.PGRTooltip)}
                <h2 className="subtitle">{'Total (Current Scaled Grade Within Assignment): ' + userGrade}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TablePGRGradeData}
                            columns={[
                                {
                                    Header: Utility.headerWithTooltip(strings.Problem, strings.PGRTooltips_ProblemTT),
                                    accessor: 'Problem',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.ProblemGrade, strings.PGRTooltips_CurrentProblemGradeTT),
                                    accessor: 'ProblemGrade',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.ProblemsPerStudent, strings.PGRTooltips_OriginalNumberofProblemsPerStudentTT),
                                    accessor: 'ProblemsPerStudent',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.WeightWithinAssignment, strings.PGRTooltips_WeightWithinAssignmentTT),
                                    resizable: true,
                                    accessor: 'Weight'
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.ScaledGradeAssignment, strings.PGRTooltips_CurrentScaledGradeWithinAssignmentTT),
                                    resizable: true,
                                    accessor: 'ScaledGrade'
                                }
                            ]}
                            // defaultSorted={[
                            //     {
                            //         id: 'Problem',
                            //         desc: true
                            //     }
                            // ]}
                            noDataText={strings.AssignmentGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );

    }
}

export default ProblemGradesReport;