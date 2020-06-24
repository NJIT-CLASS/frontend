import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class AssignmentGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            GradeReportRoot:null
        };
    }

    componentDidMount(){
        apiCall.post(`/gradeReport`,{ai_id:this.props.AI_ID},(err,status,body)=>{
            if(status.statusCode === 200){
                console.log(body);
                this.setState({GradeReportRoot:body.assignmentGradeReport, loaded:true});
            }
        });
    }

    displayProblemGradeReport(data){
        console.log(data);
        this.props.displayProblemGradeReport(data);
    }

    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings} = this.props;
        let {loaded, GradeReportRoot} = this.state;


        if(!loaded){
            return (<div></div>);
        }
        console.log(this.props);

        let AGRData = [];
        for(var userID in GradeReportRoot){
            let userReport = GradeReportRoot[userID];
            console.log(userReport);

            AGRData.push({
                LastName:userReport.lastName,
                FirstName:userReport.firstName,
                Email:userReport.email,
                AssignmentGrade: userReport.assignmentGrade ? (<a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport)}>{userReport.assignmentGrade}</a>) : '-',
                NumXCreditTasks: userReport.numOfExtraCredit ? Object.keys(userReport.numOfExtraCredit).length : "0"
            });
        }

        console.log(AGRData);
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.AGRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={AGRData}
                            columns={[
                                {
                                    Header: strings.LastName,
                                    accessor: 'LastName',
                                    resizable:true      
                                },
                                {
                                    Header: strings.FirstName,
                                    accessor: 'FirstName',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Email,
                                    accessor: 'Email',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.AssignmentGrade,
                                    resizable:true,
                                    accessor: 'AssignmentGrade'
                                },
                                {
                                    Header: strings.CurrXCreditGrade,
                                    resizable:true,
                                    accessor: 'CurrXCreditGrade'
                                },
                                {
                                    Header: strings.NumXCreditTasks,
                                    resizable:true,
                                    accessor: 'NumXCreditTasks'
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'LastName',
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

export default AssignmentGradeReport;