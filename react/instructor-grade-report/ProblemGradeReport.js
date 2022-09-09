import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class ProblemGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    displayProblemTaskAndTimelinessGradeReport(data, workflowGrade, workflowName){
        this.props.displayProblemTaskAndTimelinessGradeReport(data, workflowGrade, workflowName);
    }



    render(){
        let {strings, name, userGrade, PGRGradeData} = this.props;
        console.log("usergrade " + userGrade);
        console.log("PGR Grade Data");
        console.log(PGRGradeData);
        let TablePGRGradeData = [];
        for(var workflowID in PGRGradeData){
            let workflowData = PGRGradeData[workflowID];

            if (workflowData != null && workflowData.name != null){
                let wfInfo = workflowData.problemAndTimelinessGrade;
                let problemGrade = wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waScaledGradeSummation; //wa or assignmentScaledGradeSummation?
                TablePGRGradeData.push({
                    Problem: (<a href="#" onClick={this.displayProblemTaskAndTimelinessGradeReport.bind(this, workflowData.problemAndTimelinessGrade, problemGrade, workflowData.name)}>{workflowData.name}</a>),
                    ProblemGrade: wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waInProgress + ": "  + wfInfo.waStatistics.waScaledGradeSummation,
                    ProblemsPerStudent: workflowData.numberOfSets,
                    Weight: workflowData.weight + "%",
                    ScaledGrade: wfInfo.waStatistics == null ? "-" : wfInfo.waStatistics.waInProgress +  ": " + wfInfo.waStatistics.assignmentScaledGradeSummation
                    //ScaledGrade: workflowData.scaledGrade
                    //scaled grade within assignment = current grade *weight within assignment/ original number of problems per student
                });
            }
            
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PGRHeader + ": " + name}</h2>
                <h2 className="subtitle">{"Total (Current Scaled Grade Within Assignment): " + userGrade}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TablePGRGradeData}
                            columns={[
                                {
                                    Header: strings.Problem,
                                    accessor: 'Problem',
                                    resizable:true      
                                },
                                {
                                    Header: strings.ProblemGrade,
                                    accessor: 'ProblemGrade',
                                    resizable:true
                                },
                                {         
                                    Header: strings.ProblemsPerStudent,
                                    accessor: 'ProblemsPerStudent',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.WeightWithinAssignment,
                                    resizable:true,
                                    accessor: 'Weight'
                                },
                                {
                                    Header: strings.ScaledGradeAssignment,
                                    resizable:true,
                                    accessor: 'ScaledGrade'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'Problem',
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

export default ProblemGradesReport;