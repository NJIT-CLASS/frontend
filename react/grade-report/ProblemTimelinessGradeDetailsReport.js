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
        let {strings, /*gradeSummation, reachedTaskCount, adjustedTimelinessGradeFromPTGDR,*/ taskWorkflowName, PTGDRGradeData} = this.props;
        let {loaded} = this.state;

        console.log(PTGDRGradeData);
        let tablePTGDRGradeData = [];
        for(var gradeID in PTGDRGradeData){
            var timelinessGrade = PTGDRGradeData[gradeID];
            let status = () => {
                if (timelinessGrade.status === "started"){
                    return "started, not complete yet";
                } else if (timelinessGrade.status === "not_yet_started"){
                    return "not started yet";
                } else return timelinessGrade.status;
            };
            tablePTGDRGradeData.push({
                Task: timelinessGrade.name + " (#" + gradeID + ")",
                Status: status(),
                MaxGrade: 100,
                DaysLate: isNaN(timelinessGrade.daysLate) ? "-" : timelinessGrade.daysLate,
                PenaltyPerDay: isNaN(timelinessGrade.penalty) ? "-" : timelinessGrade.penalty + "%",
                TotalPenalty: isNaN(timelinessGrade.totalPenalty) ? "-" : timelinessGrade.totalPenalty + "%", 
                TimelinessGrade: isNaN(timelinessGrade.grade) ? "-" : timelinessGrade.grade
            });
        }

        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.PTGDRGHeader + ": " + taskWorkflowName}</h2>
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
                                    Header: strings.TimelinessMaximumGrade,
                                    accessor: 'MaxGrade',
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
                                    Header: strings.TimelinessGrade,
                                    resizable:true,
                                    accessor: 'TimelinessGrade'
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

/*TimelinessMaximumGrade: timelinesss.grade, //grade field likely inaccurate; will be traced and updated later 
                TimelinessGrade: timelinessGrade.grade * (1 - timelinessGrade.totalPenalty/100) * TimelinessMaximumGrade
Originally: TimelinessGrade: 100*(timelinessGrade.grade * (1 - timelinessGrade.totalPenalty/100) / timelinessGrade.grade)
                */