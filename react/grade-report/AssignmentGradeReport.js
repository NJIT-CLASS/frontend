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
                this.setState({GradeReportRoot:body.assignmentGradeReport,
                               loaded:true});
            }
        });
    }

    displayProblemGradeReport(workflowData, username, userGrade){
        console.log("Problem/Workflow Grade Report:");
        console.log("data");
        console.log(workflowData);
        this.props.displayProblemGradeReport(workflowData, username, userGrade);
    }

    displayAssignmentExtraCreditGradeReport(AECGRData, username, userGrade){
        this.props.displayAssignmentExtraCreditGradeReport(AECGRData, username, userGrade);
    }

    displayAssignmentExtraCreditTasksReport(AECTRData, username, userGrade){
        this.props.displayAssignmentExtraCreditTasksReport(AECTRData, username, userGrade);
    }

    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings} = this.props;
        let {loaded, GradeReportRoot} = this.state;


        if(!loaded){
            return (<div>Loading...</div>);
        }
        
        let AGRData = [];
        for(var userID in GradeReportRoot){
            let userReport = GradeReportRoot[userID];
            let username = userReport.lastName + ", " + userReport.firstName;
            console.log("usereport");
            console.log(userReport);
            let ecReport = userReport.assignmentExtraCreditReport;
            console.log("ecReport");
            console.log(ecReport);
            let numOfECReport = userReport.numOfExtraCredit;

            let numXCreditTasks = numOfECReport == null || numOfECReport.statistics.totalTaskCount == 0 ? "none assigned" : 
                numOfECReport.statistics.reachedTaskCount + " out of " + numOfECReport.statistics.totalTaskCount + " reached, " + numOfECReport.statistics.completedTaskCount + " complete";
            
            let curXCreditTaskGrade = ecReport == null ? "none assigned" : 
                ecReport.extraGradableTaskStatistics.extraInProgress + ": " + ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation;

            let curXCreditTimeGrade = ecReport == null ? "none assigned" :  ecReport.timelinessGrade.grade + " (" + numXCreditTasks + ")";
            
                if (!(userReport.lastname == undefined && userReport.firstName == undefined && userReport.email == undefined)){
                AGRData.push({
                    LastName:userReport.lastName,
                    FirstName:userReport.firstName,
                    Email:userReport.email,
                    AssignmentGrade: <a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport, username, userReport.assignmentGrade)}>
                        {userReport.assignmentInProgress + ": " + userReport.assignmentGrade}</a>, 
                    NumXCreditTasks: <a href="#" onClick={this.displayAssignmentExtraCreditTasksReport.bind(this, numOfECReport, username, numXCreditTasks)}> {numXCreditTasks} </a>,
                    CurrXCreditTaskGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTaskGrade)}> {curXCreditTaskGrade} </a>,
                    CurrXCreditTimeGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTimeGrade)}> {curXCreditTimeGrade}  </a>
                  
                });
            }
        }


        console.log("AGR Data");
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
                                    Header: strings.NumXCreditTasks,
                                    resizable:true,
                                    accessor: 'NumXCreditTasks'
                                },
                                {
                                    Header: strings.CurrXCreditTaskGrade, 
                                    resizable:true,
                                    accessor: 'CurrXCreditTaskGrade'
                                },
                                {
                                    Header: strings.CurrXCreditTimeGrade,                                    
                                    resizable:true,
                                    accessor: 'CurrXCreditTimeGrade'
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