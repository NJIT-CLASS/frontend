import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class AssignmentExtraCreditTasksReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, AECTRData} = this.props;
        let TableAECTRData = [];

        //Method (1): uncomment after backend data is passed in correctly

        //Method (2)



        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AECTRHeader}</h2>
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
                            noDataText={strings.TaskGradeNoData}
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditTasksReport;