import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class ProblemGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    displayProblemTaskAndTimelinessGradeReport(data){
        this.props.displayProblemTaskAndTimelinessGradeReport(data);
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, PGRGradeData} = this.props;
        let {loaded} = this.state;

        console.log(PGRGradeData);
        let TablePGRGradeData = [];
        for(var workflowID in PGRGradeData){
            let workflowData = PGRGradeData[workflowID];

            TablePGRGradeData.push({
            Problem: (<a href="#" onClick={this.displayProblemTaskAndTimelinessGradeReport.bind(this, workflowData.problemAndTimelinessGrade)}>{workflowData.name}</a>),
                ProblemGrade: workflowData.workflowGrade,
                ProblemsPerStudent: workflowData.numberOfSets,
                Weight: workflowData.weight,
                ScaledGrade: workflowData.scaledGrade
            });
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PGRHeader}</h2>
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
                                    Header: strings.ScaledGrade,
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