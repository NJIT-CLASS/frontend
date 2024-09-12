import React from "react";
import apiCall from "../shared/apiCall";
import TableComponent from "../shared/tableComponent";

class AssignmentGradesReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            GradeReportRoot: null
        };
    }

    componentDidMount() {
        apiCall.post(
            `/gradeReport`,
            { ai_id: this.props.AI_ID },
            (err, status, body) => {
                if (status.statusCode === 200) {
                    this.setState({
                        GradeReportRoot: body.assignmentGradeReport,
                        loaded: true
                    });
                }
            }
        );
    }

    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings } = this.props;
        let { loaded } = this.state;
        if (!loaded) {
            return <div />;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.PendingTasks}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <span
                            style={{
                                backgroundColor: "#C7C7C7",
                                fontSize: "14px",
                                textAlign: "center",
                                display: "inline-block",
                                padding: "5px",
                                width: "99%"
                            }}
                        >
                            {Strings.RedHeader}
                        </span>
                        <TableComponent
                            data={PendingTasksData}
                            columns={[
                                {
                                    Header: strings.LastName,
                                    accessor: "LastName",
                                    resizable: true
                                },
                                {
                                    Header: strings.FirstName,
                                    accessor: "FirstName",
                                    resizable: true
                                },
                                {
                                    Header: strings.Email,
                                    accessor: "Email",
                                    resizable: true
                                },
                                {
                                    Header: strings.AssignmentGrade,
                                    resizable: true,
                                    accessor: "AssignmentGrade"
                                },
                                {
                                    Header: strings.CurrXCreditGrade,
                                    resizable: true,
                                    accessor: "CurrXCreditGrade"
                                },
                                {
                                    Header: strings.NumXCreditTasks,
                                    resizable: true,
                                    accessor: "NumXCreditTasks"
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: "Date",
                                    desc: false
                                }
                            ]}
                            noDataText={Strings.NoPending}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AssignmentGradesReport;
