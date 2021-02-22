import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as ECG from './ExtraCreditGradeCalculation';


class AssignmentExtraCreditGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayAsgECTimelinessGradesDetailReport(data){
        this.props.displayAsgECTimelinessGradesDetailReport(data);
    }

    displayExtraCreditTaskGradeFieldsReport(data){
        this.props.displayExtraCreditTaskGradeFieldsReport(data);
    }



    



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, AECGRData} = this.props;
        let {loaded} = this.state;
        let TableAECGRData = [];
        console.log("Assignment Extra Credit Grade Report (AECGRData)");
        console.log(AECGRData);

        for (var TIID in AECGRData){
            let TI = AECGRData[TIID];
            if (TI.workflowName === "Entire Assignment" && TI.timelinessGradeDetails != null){
                TableAECGRData.push({
                    Problem: TI.workflowName,
                    Task: <a href="#" onClick={this.displayAsgECTimelinessGradesDetailReport.bind(this, TI.timelinessGradeDetails)}> 
                        {strings.TimelinessGrade} </a>,
                    CurrentGrade: ECG.getTimelinessGrade(TI.timelinessGradeDetails),
                    WeightWProblem: "N/A",
                    WeightWAssignment: "N/A",
                    ScaledGradeAssignment: "N/A"

                });
            } else {
                TableAECGRData.push({
                    Problem:  TI.workflowName + " (" + TI.workflowInstanceID + ")",
                    Task: <a href="#" onClick={this.displayExtraCreditTaskGradeFieldsReport.bind(this, TI.taskGradeFields)}>
                                {TI.name + " (" + TI.taskInstanceID + ")"} </a>,
                    //CurrentGrade: 
                    WeightWProblem: TI.weightInProblem, 
                    WeightWAssignment: TI.weightInProblem
                    //ScaledGradeAssignment:
    
                });
            }
            
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AECGRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECGRData}
                            columns={[
                                {
                                    Header: strings.Problem,
                                    accessor: 'Problem',
                                    resizable:true      
                                },
                                {
                                    Header: strings.Task,
                                    accessor: 'Task',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Grade,
                                    accessor: 'CurrentGrade',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.WeightWithinProblem,
                                    resizable:true,
                                    accessor: 'WeightWProblem'
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
                            noDataText={strings.TaskGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditGradesReport;