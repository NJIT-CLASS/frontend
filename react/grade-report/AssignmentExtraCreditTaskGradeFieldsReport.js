import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import * as ECG from './ExtraCreditGradeCalculation';


class AssignmentExtraCreditTaskGradeFieldsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, ECTGFRData} = this.props;
        let TableECTGFRData = [];

        console.log("ECTGFRData");
            console.log(ECTGFRData);

        for (var taskGradeFieldNum in ECTGFRData){
            let taskGradeField = ECTGFRData[taskGradeFieldNum];
            for (var taskFieldNum in taskGradeField){
                let taskField = taskGradeField[taskFieldNum];
                
                TableECTGFRData.push({
                    Field: taskField.name == null ? "Unnamed" : taskField.name, 
                    Type: taskField.type, 
                    Value: taskField.value, 
                    Max: ECG.getMax(taskField.type, taskField.max),
                    ConvertedNumericValue: ECG.getConvNumGrade(taskField.value, taskField.type, ECG.getMax(taskField.type, taskField.max)),
                    WeightWTask: isNaN(taskField.weight) ? "-" : taskField.weight,
                    ScaledGrade: ECG.getConvNumGradeScaled(taskField.value, taskField.type, 
                                                        ECG.getMax(taskField.type, taskField.max), taskField.weight)
                });
            }

        }

            



        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.ECTGFRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                    <TableComponent
                            data={TableECTGFRData}
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
                        />
                    </div>
                </div>
            </div>
        );
    
    }
}

export default AssignmentExtraCreditTaskGradeFieldsReport;