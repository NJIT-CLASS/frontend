import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class TaskGradeFieldsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, TGFRGradeData} = this.props;
        let {loaded} = this.state;

        console.log(TGFRGradeData);

        var finalGradeFields = null;
        for(var key in TGFRGradeData){
            finalGradeFields = TGFRGradeData[key];
        }
        var TableTGFRGradeData = [];
        for(var taskGradeID in finalGradeFields){
            var taskGrade = finalGradeFields[taskGradeID];
            var convNumGrade;
            if (taskGrade.type === "Label")
                convNumGrade = 100;
            else if (taskGrade.type === "Pass/Fail")
                convNumGrade = taskGrade.value == "pass" ? 100 : 0;
            else 
                convNumGrade = ((taskGrade.value/taskGrade.max) * 100).toFixed(2); 

            TableTGFRGradeData.push({
                Field:taskGrade.name,
                Type:taskGrade.type,
                Value:taskGrade.value,
                ConvertedNumericValue: convNumGrade,
                Max: taskGrade.max,
                WeightWTask:taskGrade.weight,
                ScaledGrade:(convNumGrade * (taskGrade.weight/100)).toFixed(2)
            });
        }


        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.TGFRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <TableComponent
                            data={TableTGFRGradeData}
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

export default TaskGradeFieldsReport;