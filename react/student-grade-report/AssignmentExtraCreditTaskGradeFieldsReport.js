import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as ECG from './ExtraCreditGradeCalculation';
import MultiTaskGradeTable from './MultiTaskGradeTable';


class AssignmentExtraCreditTaskGradeFieldsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.myRef = React.createRef();
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



    render() {
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let { strings, numOfTaskGrades, taskID, ECTGFRData, tableSubheader } = this.props;

        console.log("ECTGFRData");
        console.log(ECTGFRData);

        let singleTaskGrade = (numOfTaskGrades == 1);
        let TableECTGFRDataFrame = ECG.getTaskFieldReport(ECTGFRData, numOfTaskGrades);




        return (
            <div ref={this.myRef}>
                <MultiTaskGradeTable
                    multiTaskGradeFieldsData={TableECTGFRDataFrame}
                    singleTaskGrade={singleTaskGrade}
                    numOfTaskGrades={numOfTaskGrades}
                    extraCrediTaskGrade={true}
                    taskID={taskID}
                    tableSubheader={tableSubheader}
                    strings={strings}>
                </MultiTaskGradeTable>
            </div>

        );

    }
}

export default AssignmentExtraCreditTaskGradeFieldsReport;