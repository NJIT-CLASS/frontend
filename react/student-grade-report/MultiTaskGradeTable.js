import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as Utility from './MiscFuncs';

class MultiTaskGradeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    render() {
        let { strings, taskLabel, multiTaskGradeFieldsData, numOfTaskGrades, extraCreditTaskGrade, taskID, taskTotalGrade, tableSubheader } = this.props;

        let header = '';
        if (extraCreditTaskGrade) {
            header = 'Extra Credit ';
        }

        // let singleTaskGrade = (numOfTaskGrades == 0);
        let multiTaskClassName = (numOfTaskGrades == 1) ? '' : 'multi-task';
        // if (singleTaskGrade) {
        //     multiTaskClassName = '';
        // }
        console.log(multiTaskGradeFieldsData);
        console.log('number of task graders: ' + numOfTaskGrades);

        let cols = [
            {
                Header: Utility.headerWithTooltip(strings.Field, strings.TGFR_FieldTT),
                accessor: 'Field',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Type, strings.TGFR_TypeTT),
                accessor: 'Type',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Value, strings.TGFR_ValueTT),
                accessor: 'Value',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.Max, strings.TGFR_MaxTT),
                resizable: true,
                accessor: 'Max'
            },
            {
                Header: Utility.headerWithTooltip(strings.ConvertedNumericValue, strings.TGFR_ConvertedNumericValueTT),
                accessor: 'ConvertedNumericValue',
                resizable: true
            },
            {
                Header: Utility.headerWithTooltip(strings.WeightWTask, strings.TGFR_WeightWithinTaskTT),
                resizable: true,
                accessor: 'WeightWTask'
            },
            {
                Header: Utility.headerWithTooltip(strings.ScaledGradeTask, strings.TGFR_ScaledGradeWithinTaskTT),
                resizable: true,
                accessor: 'ScaledGrade'
            }
        ];

        if (numOfTaskGrades == 0) {
            return (
                <div className="section card-2 sectionTable">
                    <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                    {Utility.titleWithTooltip(strings.TGFRHeader + ': ' + taskLabel + ' (' + taskID + ')', strings.TFGRTooltip)}
                    <h2 className="subtitle">{'Total (Scaled Grade Within Task): ' + taskTotalGrade}</h2>
                    <div className="section-content">
                        <div className="col-xs-6">
                            <TableComponent
                                data={multiTaskGradeFieldsData}
                                columns={cols}
                                noDataText={strings.TaskGradeNoData}
                            /></div>
                    </div>
                </div>
            );
        } else return (
            <div className="section card-2 sectionTable">
                <h2 className="assignmentDescriptor">{tableSubheader}</h2>
                {Utility.titleWithTooltip(strings.TGFRHeader + ': ' + taskLabel + ' (' + taskID + ')', strings.TGFRHeaderTooltip)}
                <div className="section-content">
                    <div className="col-xs-6">
                        {multiTaskGradeFieldsData.map((taskGradeData, index) => {
                            return (
                                <div key={index}>
                                    <h3 className={multiTaskClassName}>{numOfTaskGrades == 1 ? '' : header + 'Grader #' + (index + 1)}</h3>
                                    <TableComponent
                                        data={taskGradeData}
                                        columns={cols}
                                        noDataText={strings.TaskGradeNoData}
                                    /></div>);
                        })}
                    </div>
                </div>
            </div>
        );

    }

}

export default MultiTaskGradeTable;