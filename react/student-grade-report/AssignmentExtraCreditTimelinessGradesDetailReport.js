import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Utility from './MiscFuncs';


class AssignmentExtraCreditTimelinessGradesDetailReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }



    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, timelinessGrade, AECTGDRData, tableSubheader } = this.props;
        let { loaded } = this.state;
        console.log('Assignment Extra Credit Grade Report');
        console.log(AECTGDRData);

        let TableAECTGDRData = [];
        let timelinessMaxGrade = 100;

        for (var TIID in AECTGDRData) {
            let TI = AECTGDRData[TIID];
            if (TI != null) {
                TableAECTGDRData.push({
                    //Problem: TI.workflowName,
                    Task: TI.name + ' (#' + TIID + ')',
                    Status: TI.status,
                    TimelinessMaximumGrade: timelinessMaxGrade,
                    DaysLate: isNaN(TI.daysLate) ? '-' : TI.daysLate,
                    PenaltyPerDay: isNaN(TI.penalty) ? '-' : TI.penalty + '%',
                    TimelinessGrade: isNaN(TI.grade) ? '-' : TI.grade
                    //ECG.getTaskTimelinessGradeScaled(TI.status, TI.grade, timelinessMaxGrade, TI.daysLate, TI.penalty)
                });
            }


        }


        TableAECTGDRData.push({
            Task: <h2 className="total">{strings.Total}</h2>,
            TimelinessGrade: <h2 className="total">{timelinessGrade}</h2>
        });

        // console.log(TableAECTGDRData);

        return (
            <div className="section card-2 sectionTable">
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.AECTGDRHeader, strings.AECTGDRTooltip)}
                <h2 className="subtitle">{'Total (Timeliness Grade): ' + timelinessGrade}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECTGDRData}
                            columns={[
                                // {
                                //     Header: strings.Problem,
                                //     accessor: 'Problem',
                                //     resizable:true      
                                // },
                                {
                                    Header: Utility.headerWithTooltip(strings.Task, strings.AECTGDR_TaskTT),
                                    accessor: 'Task',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.Status, strings.AECTGDR_StatusTT),
                                    accessor: 'Status',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.TimelinessMaximumGrade, strings.AECTGDR_TimelinessMaximumGradeTT),
                                    accessor: 'TimelinessMaximumGrade',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.DaysLate, strings.AECTGDR_DaysLateTT),
                                    resizable: true,
                                    accessor: 'DaysLate'
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.PenaltyPerDay, strings.AECTGDR_PenaltyPerDayTT),
                                    resizable: true,
                                    accessor: 'PenaltyPerDay'
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.TimelinessGrade, strings.AECTGDR_TimelinessGradeTT),
                                    resizable: true,
                                    accessor: 'TimelinessGrade'
                                }
                            ]}
                            // defaultSorted={[
                            //     {
                            //         id: 'Status',
                            //         desc: true
                            //     },
                            //     {
                            //         id: 'Task',
                            //         desc: true
                            //     },
                            //     {
                            //         id: 'Problem',
                            //         desc: true
                            //     },
                            // ]}
                            noDataText={'This student has no Extra Credit Timeliness grades.'}
                        />
                    </div>
                </div>
            </div>
        );

    }
}

export default AssignmentExtraCreditTimelinessGradesDetailReport;