import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Utility from './MiscFuncs';


class AssignmentExtraCreditTasksReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };

        this.myRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })();
        }, 0);

    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })();
        }, 0);
    }



    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, AECTRData, name, grade, tableSubheader } = this.props;
        console.log('AECTRData');
        console.log(AECTRData);
        let TableAECTRData = [];


        for (var workflowID in AECTRData) {
            if (!isNaN(workflowID)) {
                let workflowData = AECTRData[workflowID];
                let status = () => {
                    if (workflowData.status === 'started') return 'not complete';
                    else if (workflowData.status === 'not_yet_started') return 'not reached';
                    else return workflowData.status;
                };

                let taskGrade = () => {
                    if (isNaN(workflowData.taskGrade)) return 'in progress';
                    else return workflowData.taskGradeInProgress + ': ' + workflowData.taskGrade;
                };

                TableAECTRData.push({
                    Problem: workflowData.workflowName + ' (#' + workflowData.workflowInstanceID + ')',
                    Task: workflowData.name + ' (#s' + workflowData.taskInstanceID + ')',
                    Status: status(),
                    TaskGrade: taskGrade(),
                    TimelinessGrade: workflowData.timelinessGrade
                });
            }

        }


        return (
            <div ref={this.myRef} className="section card-2 sectionTable">
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.AECTRHeader + ': ' + this.props.name, strings.AECTRTooltip)}
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECTRData}
                            columns={[
                                {
                                    Header: Utility.headerWithTooltip(strings.Problem, strings.AECTR_ProblemTT),
                                    accessor: 'Problem',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.Task, strings.AECTR_TaskTT),
                                    accessor: 'Task',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.Status, strings.AECTR_StatusTT),
                                    accessor: 'Status',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.TaskGrade, strings.AECTR_TaskGradeTT),
                                    accessor: 'TaskGrade',
                                    resizable: true
                                },
                                {
                                    Header: Utility.headerWithTooltip(strings.TimelinessGrade, strings.AECTR_TimelinessGradeTT),
                                    resizable: true,
                                    accessor: 'TimelinessGrade'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'Status',
                                    desc: false
                                }
                            ]}
                            noDataText={'This student has no Extra Credit tasks.'}
                        />
                    </div>
                </div>
            </div>
        );

    }
}

export default AssignmentExtraCreditTasksReport;