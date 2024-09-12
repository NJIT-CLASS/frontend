import { isNull } from 'lodash';
import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Strings from './strings.js';
import * as Utility from './MiscFuncs';
//import {CSVLink, CSVDownload} from 'react-csv';

class AssignmentGradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            GradeReportRoot: null,
            loaded: false
        };

        this.myRef = React.createRef();
    }

    componentWillMount() {
        apiCall.get(`/sectionUserInfo/${this.props.UserID}/${this.props.sectionID}`, (err, res, body) => {
            let sectionuserId = body.Info.SectionUserID;
            apiCall.post('/studentGradeReport', { ai_id: this.props.AI_ID, sectionUserID: sectionuserId }, (err, status, body) => {
                if (status.statusCode === 200) {
                    console.log(body);
                    this.setState({
                        GradeReportRoot: body.assignmentStudentGradeReport,
                        loaded: true
                    });
                }
            });
        });

    }
    componentDidMount() {
        setTimeout(() => {
            this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })();
        }, 0);

    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })();
        }, 0);
    }




    displayProblemGradeReport(workflowData, username, userGrade, oneWorkflow) {
        console.log('Problem/Workflow Grade Report:');
        console.log('data');
        console.log(workflowData);
        this.props.displayProblemGradeReport(workflowData, username, userGrade, oneWorkflow);
    }

    displayAssignmentExtraCreditGradeReport(AECGRData, username, userGrade) {
        this.props.displayAssignmentExtraCreditGradeReport(AECGRData, username, userGrade);
    }

    displayAssignmentExtraCreditTasksReport(AECTRData, username, userGrade) {
        this.props.displayAssignmentExtraCreditTasksReport(AECTRData, username, userGrade);
    }

    download(filename, fileContent) {
        filename = filename + '.tsv';

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

    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, assignmentIdentifier } = this.props;

        let { loaded, GradeReportRoot } = this.state;

        if (!loaded) {
            return (<div className="placeholder center-spinner">
                <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
            </div>);
        }

        let AGRData = [];
        let CSVData = [];

        let displayECColumns = false;
        let userReport = GradeReportRoot;
        let username = userReport.lastName + ', ' + userReport.firstName;
        console.log('usereport');
        console.log(userReport);
        let ecReport = userReport.assignmentExtraCreditReport;
        console.log('ecReport');
        console.log(ecReport);
        let numOfECReport = userReport.numOfExtraCredit;

        displayECColumns = !(numOfECReport == null || numOfECReport.statistics.totalTaskCount == 0);

        let numXCreditTasks = displayECColumns ?
            numOfECReport.statistics.reachedTaskCount + ' out of ' + numOfECReport.statistics.totalTaskCount + ' reached, ' + numOfECReport.statistics.completedTaskCount + ' complete'
            : 'none assigned';

        let curXCreditTaskGrade, curXCreditTaskGradeNum, curXCreditTaskGradeStatus;
        if (ecReport == null) {
            curXCreditTaskGrade = 'none assigned';
            curXCreditTaskGradeNum = -1;
            curXCreditTaskGradeStatus = 'n/a';
        } else if (ecReport.extraGradableTaskStatistics.extraInProgress === 'n/a') {
            curXCreditTaskGrade = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation + ' (none assigned)';
            curXCreditTaskGradeNum = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation;
            curXCreditTaskGradeStatus = 'n/a';
        } else {
            curXCreditTaskGrade = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation + ' (' + ecReport.extraGradableTaskStatistics.extraInProgress + ')';
            curXCreditTaskGradeNum = ecReport.extraGradableTaskStatistics.assignmentExtraScaledGradeSummation;
            curXCreditTaskGradeStatus = ecReport.extraGradableTaskStatistics.extraInProgress;
        }

        let curXCreditTimeGrade, curXCreditTimeGradeNum, curXCreditTimeGradeStatus;
        if (ecReport == null || ecReport.timelinessGrade == null) {
            curXCreditTimeGrade = 'none assigned';
            curXCreditTimeGradeNum = -1;
            curXCreditTimeGradeStatus = 'none assigned';
        } else {
            curXCreditTimeGrade = ecReport.timelinessGrade.grade + ' (' + ecReport.timelinessGrade.reachedTaskCount + ' out of ' + ecReport.timelinessGrade.completedTaskCount + ' reached, ' + ecReport.timelinessGrade.totalTaskCount + ' complete)';
            curXCreditTimeGradeNum = ecReport.timelinessGrade.grade;
            curXCreditTimeGradeStatus = ecReport.timelinessGrade.reachedTaskCount + ' out of ' + ecReport.timelinessGrade.completedTaskCount + ' reached, ' + ecReport.timelinessGrade.totalTaskCount;
        }

        let oneWorkflow = userReport.oneWorkflow;


        if (!(userReport.lastname == undefined && userReport.firstName == undefined && userReport.email == undefined)) {
            if (displayECColumns) {
                AGRData.push({
                    LastName: userReport.lastName,
                    FirstName: userReport.firstName,
                    Email: userReport.email,
                    AssignmentGrade: <a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport, username, userReport.assignmentGrade, oneWorkflow)}>
                        {userReport.assignmentGrade + ' (' + userReport.assignmentInProgress + ')'}</a>,
                    NumXCreditTasks: <a href="#" onClick={this.displayAssignmentExtraCreditTasksReport.bind(this, numOfECReport, username, numXCreditTasks)}> {numXCreditTasks} </a>,
                    CurrXCreditTaskGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTaskGrade)}> {curXCreditTaskGrade} </a>,
                    CurrXCreditTimeGrade: <a href="#" onClick={this.displayAssignmentExtraCreditGradeReport.bind(this, ecReport, username, curXCreditTimeGrade)}> {curXCreditTimeGrade}  </a>
                });
            } else {
                AGRData.push({
                    LastName: userReport.lastName,
                    FirstName: userReport.firstName,
                    Email: userReport.email,
                    AssignmentGrade: <a href="#" onClick={this.displayProblemGradeReport.bind(this, userReport.workflowGradeReport, username, userReport.assignmentGrade, oneWorkflow)}>
                        {userReport.assignmentGrade + ' (' + userReport.assignmentInProgress + ')'}</a>,
                    NumXCreditTasks: <a href="#" onClick={this.displayAssignmentExtraCreditTasksReport.bind(this, numOfECReport, username, numXCreditTasks)}> {numXCreditTasks} </a>
                });
            }

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


        /////////////////////////////////////////
        /**Creates and downloads a TSV file:**/
        let headers = [
            strings.LastName,
            strings.FirstName,
            strings.Email,
            strings.AssignmentGrade,
            strings.AssignmentGrade + ' Status',
            strings.NumXCreditTasks,
            strings.NumXCreditTasks + ' Status',
            strings.CurrXCreditTaskGrade,
            strings.CurrXCreditTaskGrade + ' Status',
            strings.CurrXCreditTimeGrade,
            strings.CurrXCreditTimeGrade + ' Status'
        ];

        CSVData.unshift(headers);

        // let csvContent = "data:text/tab-separated-values," 
        //     + CSVData.map(e => e.join("\t")).join("\n");
        let csvContent = CSVData.map(e => e.join('\t')).join('\n');
        // let csvContent = CSVData;
        // var encodedUri = encodeURI(csvContent);
        // window.open(encodedUri);
        /////////////////////////////////////////


        console.log('AGR Data');
        console.log(AGRData);

        let tableSubheader = assignmentIdentifier.replaceAll('_', ' - ');
        // if the assignment doesn't contain extra credit, then the extra credit relevant columns are not displayed
        let cols = displayECColumns ? [{
            Header: strings.LastName,
            accessor: 'LastName',
            // width: 200,
            resizable: true
        },
        {
            Header: strings.FirstName,
            accessor: 'FirstName',
            resizable: true
        },
        {
            Header: strings.Email,
            accessor: 'Email',
            resizable: true
        },
        {
            Header: Utility.headerWithTooltip(strings.AssignmentGrade, strings.AGRTooltips_CurrentAssignmentGradeTT),
            resizable: true,
            accessor: 'AssignmentGrade'
        },
        {
            Header: Utility.headerWithTooltip(strings.NumXCreditTasks, strings.AGRTooltips_TotalNumberofExtraCreditTasksAssignedTT),
            resizable: true,
            accessor: 'NumXCreditTasks'
        },
        {
            Header: Utility.headerWithTooltip(strings.CurrXCreditTaskGrade, strings.AGRTooltips_CurrentExtraCreditTaskGradesTT),
            resizable: true,
            accessor: 'CurrXCreditTaskGrade'
        },
        {
            Header: Utility.headerWithTooltip(strings.CurrXCreditTimeGrade, strings.AGRTooltips_CurrentExtraCreditTimelinessGradesTT),
            resizable: true,
            accessor: 'CurrXCreditTimeGrade'
        }] : [{
            Header: strings.LastName,
            accessor: 'LastName',
            width: 200,
            resizable: true
        },
        {
            Header: strings.FirstName,
            accessor: 'FirstName',
            resizable: true
        },
        {
            Header: strings.Email,
            accessor: 'Email',
            resizable: true
        },
        {
            Header: Utility.headerWithTooltip(strings.AssignmentGrade, strings.AGRTooltips_CurrentAssignmentGradeTT),
            resizable: true,
            accessor: 'AssignmentGrade'
        },
        {
            Header: Utility.headerWithTooltip(strings.NumXCreditTasks, strings.AGRTooltips_TotalNumberofExtraCreditTasksAssignedTT),
            resizable: true,
            accessor: 'NumXCreditTasks'
        }];
        return (
            <div ref={this.myRef}>
                <div className="section card-2 sectionTable">
                    <h2 className='subtitle-highlighted'>
                        {strings.ExpandTableColumnsDirections}
                    </h2>
                </div>

                <div className="section card-2 sectionTable">
                    <div className="title-download">
                        <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                        {Utility.titleWithTooltip(strings.AGRHeader, strings.AGRTooltip)}
                        <button className="download-button"
                            onClick={this.download.bind(this, this.props.assignmentIdentifier, csvContent)}>
                            Download
                        </button>
                    </div>
                    <div className="section-content">
                        <div className="col-xs-6">
                            <TableComponent
                                data={AGRData}
                                columns={cols}
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
            </div>

        );

    }
}



export default AssignmentGradeReport;