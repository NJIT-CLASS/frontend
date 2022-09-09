import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';

class MultiTaskGradeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }

    render(){
        let {strings, taskLabel, multiTaskGradeFieldsData, singleTaskGrade, numOfTaskGrades, extraCreditTaskGrade, taskID, taskTotalGrade} = this.props;

        let header = "";
        if (extraCreditTaskGrade){
            header = "Extra Credit ";
        }

        let multiTaskClassName = 'multi-task';
        if (singleTaskGrade){
            multiTaskClassName = '';
        }
        
        console.log("number of task grades: " + numOfTaskGrades);
        if (numOfTaskGrades == 0){
            return (
                <div className="section card-2 sectionTable">
                <h2 className="title">{strings.TGFRHeader + ": " + taskLabel + " (" + taskID + ")"}</h2>
                <h2 className="subtitle">{"Total (Scaled Grade Within Task): " + taskTotalGrade}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={multiTaskGradeFieldsData}
                            columns={[
                                {
                                    Header: strings.Field,
                                    accessor: 'Field',
                                    resizable:true      
                                },
                                {
                                    Header: strings.Type,
                                    accessor: 'Type',
                                    resizable:true
                                },
                                {         
                                    Header: strings.Value,
                                    accessor: 'Value',
                                    resizable:true                              
                                },
                                {
                                    Header: strings.Max,
                                    resizable:true,
                                    accessor: 'Max'
                                },
                                {
                                    Header: strings.ConvertedNumericValue,
                                    accessor: 'ConvertedNumericValue',
                                    resizable: true
                                },
                                {
                                    Header: strings.WeightWTask,
                                    resizable:true,
                                    accessor: 'WeightWTask'
                                },
                                {
                                    Header: strings.ScaledGradeTask,
                                    resizable:true,
                                    accessor: 'ScaledGrade'
                                }
                            ]}
                            noDataText={strings.TaskGradeNoData}
                        /></div>
                    </div>
                </div>
            );
        }

        else return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.TGFRHeader + ": " + taskLabel + " (" + taskID + ")"}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        {multiTaskGradeFieldsData.map((taskGradeData, index) => {
                            return (
                                <div key={index}>
                                    <h3 className={multiTaskClassName}>{singleTaskGrade ? "" : header + "Grader #" + (index + 1)}</h3>
                                    <TableComponent
                                        data={taskGradeData}
                                        columns={[
                                            {
                                                Header: strings.Field,
                                                accessor: 'Field',
                                                resizable:true      
                                            },
                                            {
                                                Header: strings.Type,
                                                accessor: 'Type',
                                                resizable:true
                                            },
                                            {         
                                                Header: strings.Value,
                                                accessor: 'Value',
                                                resizable:true                              
                                            },
                                            {
                                                Header: strings.Max,
                                                resizable:true,
                                                accessor: 'Max'
                                            },
                                            {
                                                Header: strings.ConvertedNumericValue,
                                                accessor: 'ConvertedNumericValue',
                                                resizable: true
                                            },
                                            {
                                                Header: strings.WeightWTask,
                                                resizable:true,
                                                accessor: 'WeightWTask'
                                            },
                                            {
                                                Header: strings.ScaledGradeTask,
                                                resizable:true,
                                                accessor: 'ScaledGrade'
                                            }
                                        ]}
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