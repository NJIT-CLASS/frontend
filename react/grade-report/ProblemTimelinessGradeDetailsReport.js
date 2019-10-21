import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class ProblemTimelinessGradeDetailsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, PTGDRGradeData} = this.props;
        let {loaded} = this.state;

        console.log(PTGDRGradeData);
        let tablePTGDRGradeData = [];
        for(var gradeID in PTGDRGradeData){
            var timelinessGrade = PTGDRGradeData[gradeID];
            tablePTGDRGradeData.push({
                Task: timelinessGrade.name,
                Status: timelinessGrade.status,
                DaysLate: timelinessGrade.daysLate,
                PenaltyPerDay: timelinessGrade.penalty,
                TotalPenalty: timelinessGrade.totalPenalty,
                Grade: timelinessGrade.grade
            });
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PTGDRGHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={tablePTGDRGradeData}
                            columns={[
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
                                    Header: strings.DaysLate,
                                    accessor: 'DaysLate',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.PenaltyPerDay,
                                    resizable:true,
                                    accessor: 'PenaltyPerDay'
                                },
                                {
                                    Header: strings.TotalPenalty,
                                    resizable:true,
                                    accessor: 'TotalPenalty'
                                },
                                {
                                    Header: strings.Grade,
                                    resizable:true,
                                    accessor: 'Grade'
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

export default ProblemTimelinessGradeDetailsReport;