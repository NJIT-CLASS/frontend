import { isNull } from 'lodash';
import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
//import {CSVLink, CSVDownload} from 'react-csv';

class AssignmentGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            GradeReportRoot: null, 
            loaded: false
        };
    }

    componentDidMount(){
        apiCall.get(`/sectionUserInfo/${this.props.UserID}/${this.props.sectionID}`, (err, res,body) => {
            let sectionuserId = body.Info.SectionUserID;
            if (body.Info.Role === "Student"){
                apiCall.post(`/studentGradeReport`,{ai_id:this.props.AI_ID, sectionUserID:sectionuserId},(err,status,body)=>{
                    if(status.statusCode === 200){
                        console.log(body);
                        this.setState({GradeReportRoot:body.assignmentStudentGradeReport,
                                       loaded:true});
                    }
                });
            } else if (body.Info.Role === "Instructor"){
                apiCall.post(`/gradeReport`,{ai_id:this.props.AI_ID},(err,status,body)=>{
                    if(status.statusCode === 200){
                        console.log(body);
                        this.setState({GradeReportRoot:body.assignmentGradeReport,
                                       loaded:true});
                    }
                });
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

    download(filename, fileContent) {
        filename = filename + ".tsv";
    
        var blob = new Blob([fileContent], { type: 'text/tab-separated-values' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement('a');
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    
    }

    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, assignmentIdentifier} = this.props;

        let {loaded, GradeReportRoot} = this.state;

        if(!loaded){
            return (<div>Loading...</div>);
        }
        
        let AGRData = [];
        let CSVData = [];

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
            
            let curXCreditTaskGrade, curXCreditTaskGradeNum, curXCreditTaskGradeStatus;
            if (ecReport == null) {
                curXCreditTaskGrade = "none assigned";
                curXCreditTaskGradeNum = -1;
                curXCreditTaskGradeStatus = "n/a";
            } else if (ecReport.extraGradableTaskStatistics.extraInProgress === "n/a"){
                curXCreditTaskGrade = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation + " (none assigned)";
                curXCreditTaskGradeNum = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation;
                curXCreditTaskGradeStatus = "n/a";
            } else {
                curXCreditTaskGrade = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation + " (" + ecReport.extraGradableTaskStatistics.extraInProgress + ")";
                curXCreditTaskGradeNum = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation;
                curXCreditTaskGradeStatus = ecReport.extraGradableTaskStatistics.extraInProgress;
            }
            
            let curXCreditTimeGrade, curXCreditTimeGradeNum, curXCreditTimeGradeStatus;
            if (ecReport == null || ecReport.timelinessGrade == null) {
                curXCreditTimeGrade = "none assigned";
                curXCreditTimeGradeNum = -1;
                curXCreditTimeGradeStatus = "none assigned";
            } else {
                curXCreditTimeGrade = ecReport.timelinessGrade.grade + " (" + ecReport.timelinessGrade.reachedTaskCount + " out of " + ecReport.timelinessGrade.completedTaskCount + " reached, " + ecReport.timelinessGrade.totalTaskCount + " complete)";
                curXCreditTimeGradeNum = ecReport.timelinessGrade.grade;
                curXCreditTimeGradeStatus = ecReport.timelinessGrade.reachedTaskCount + " out of " + ecReport.timelinessGrade.completedTaskCount + " reached, " + ecReport.timelinessGrade.totalTaskCount;
            }
                        
            
            if (!(userReport.lastname == undefined && userReport.firstName == undefined && userReport.email == undefined)){
                AGRData.push({
                    LastName:userReport.lastName,
                    FirstName:userReport.firstName,
                    Email:userReport.email,
                    AssignmentGrade: <a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport, username, userReport.assignmentGrade)}>
                        {userReport.assignmentGrade + " (" + userReport.assignmentInProgress + ")"}</a>, 
                    NumXCreditTasks: <a href="#" onClick={this.displayAssignmentExtraCreditTasksReport.bind(this, numOfECReport, username, numXCreditTasks)}> {numXCreditTasks} </a>,
                    CurrXCreditTaskGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTaskGrade)}> {curXCreditTaskGrade} </a>,
                    CurrXCreditTimeGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTimeGrade)}> {curXCreditTimeGrade}  </a>
                  
                });
            
                CSVData.push([
                    userReport.lastName,
                    userReport.firstName,
                    userReport.email,
                    userReport.assignmentGrade, 
                    userReport.assignmentInProgress, 
                    numOfECReport == null || numOfECReport.statistics.totalTaskCount == 0 ? -1 : numOfECReport.statistics.totalTaskCount,
                    numXCreditTasks,
                    curXCreditTaskGradeNum,
                    curXCreditTaskGradeStatus,
                    curXCreditTimeGradeNum,
                    curXCreditTimeGradeStatus
                ]);

            }
        }

        /////////////////////////////////////////
        /**Creates and downloads a TSV file:**/
        let headers = [strings.LastName, 
                        strings.FirstName,
                        strings.Email, 
                        strings.AssignmentGrade,
                        strings.AssignmentGrade + " Status",
                        strings.NumXCreditTasks,
                        strings.NumXCreditTasks + " Status", 
                        strings.CurrXCreditTaskGrade,
                        strings.CurrXCreditTaskGrade + " Status",
                        strings.CurrXCreditTimeGrade,
                        strings.CurrXCreditTimeGrade + " Status"];

        CSVData.unshift(headers);

        // let csvContent = "data:text/tab-separated-values," 
        //     + CSVData.map(e => e.join("\t")).join("\n");
        let csvContent = CSVData.map(e => e.join("\t")).join("\n");
        // let csvContent = CSVData;
        // var encodedUri = encodeURI(csvContent);
        // window.open(encodedUri);
        /////////////////////////////////////////


        console.log("AGR Data");
        console.log(AGRData);
        
        return (
            <div className="section card-2 sectionTable">
                <div className="title-download">
                    <h2 className="title">{strings.AGRHeader}</h2>
                    <button className="download-button" 
                        onClick={this.download.bind(this, this.props.assignmentIdentifier, csvContent)}>
                            Download
                    </button>
                </div>
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