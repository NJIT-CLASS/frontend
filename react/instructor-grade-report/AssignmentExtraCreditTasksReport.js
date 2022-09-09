import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class AssignmentExtraCreditTasksReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }


    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, AECTRData, name, grade} = this.props;
        console.log("AECTRData");
        console.log(AECTRData);
        let TableAECTRData = [];

        
        for (var workflowID in AECTRData){
            if (!isNaN(workflowID)){
                let workflowData = AECTRData[workflowID];
                let status = () => {
                    if (workflowData.status === "started") return "not complete";
                    else if (workflowData.status === "not_yet_started") return "not reached";
                    else return workflowData.status;
                }

                let taskGrade = () => {
                    if (isNaN(workflowData.taskGrade)) return "in progress";
                    else return workflowData.taskGradeInProgress + ": " + workflowData.taskGrade;
                }

                TableAECTRData.push({
                    Problem: workflowData.workflowName + " (#" + workflowData.workflowInstanceID + ")",
                    Task: workflowData.name + " (#s" + workflowData.taskInstanceID + ")",
                    Status: status(),
                    TaskGrade: taskGrade(),
                    TimelinessGrade: workflowData.timelinessGrade
                });
            }

        }


        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AECTRHeader + ": " + this.props.name}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableAECTRData}
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
                                    Header: strings.Status,
                                    accessor: 'Status',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.TaskGrade,
                                    accessor: 'TaskGrade',
                                    resizable: true
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
                                    desc: false
                                }
                            ]}
                            noDataText={"This student has no Extra Credit tasks."}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditTasksReport;