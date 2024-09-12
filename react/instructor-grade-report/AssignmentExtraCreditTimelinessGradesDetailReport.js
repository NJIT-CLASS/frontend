import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as ECG from './ExtraCreditGradeCalculation';


class AssignmentExtraCreditTimelinessGradesDetailReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, AECTGDRData} = this.props;
        let {loaded} = this.state;
        console.log("Assignment Extra Credit Grade Report");
        console.log(AECTGDRData);

        let TableAECTGDRData = [];
        let timelinessMaxGrade = 100;

        for (var TIID in AECTGDRData){
            let TI = AECTGDRData[TIID];
            TableAECTGDRData.push({
                //Problem: TI.workflowName,
                Task: TI.name + " (#" + TIID + ")",
                Status: TI.status, 
                TimelinessMaximumGrade: timelinessMaxGrade,
                DaysLate: isNaN(TI.daysLate) ? "-" : TI.daysLate,
                PenaltyPerDay: isNaN(TI.penalty) ? "-" : TI.penalty +  "%", 
                TimelinessGrade: isNaN(TI.grade) ? "-" : TI.grade
                //ECG.getTaskTimelinessGradeScaled(TI.status, TI.grade, timelinessMaxGrade, TI.daysLate, TI.penalty)
            });
        }



        

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AECTGDRHeader}</h2>
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
                                    Header: strings.Task,
                                    accessor: 'Task',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Status,
                                    accessor: 'Status',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.TimelinessMaximumGrade,
                                    accessor: 'TimelinessMaximumGrade',
                                    resizable: true
                                },
                                {
                                    Header: strings.DaysLate,
                                    resizable:true,
                                    accessor: 'DaysLate'
                                },
                                {
                                    Header: strings.PenaltyPerDay,
                                    resizable:true,
                                    accessor: 'PenaltyPerDay'
                                },
                                {
                                    Header: strings.TimelinessGrade,
                                    resizable:true,
                                    accessor: 'TimelinessGrade'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'Status',
                                    desc: true
                                },
                                {
                                    id: 'Task',
                                    desc: true
                                },
                                {
                                    id: 'Problem',
                                    desc: true
                                },
                            ]}
                            noDataText={"This student has no Extra Credit Timeliness grades."}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditTimelinessGradesDetailReport;