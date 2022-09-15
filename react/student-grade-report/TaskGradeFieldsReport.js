import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';
import MultiTaskGradeTable from './MultiTaskGradeTable';


class TaskGradeFieldsReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
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
        let { strings, numOfTaskGrades, taskID, taskLabel, TGFRGradeData, taskTotalGrade, tableSubheader } = this.props;
        let { loaded } = this.state;
        console.log("TGFRGradeData");
        console.log(TGFRGradeData);



        var TableTGFRGradeDataFrame = [];
        var TableTGFRGradeData = [];
        // let tableHeaders = [];

        var singleTaskGrade = (numOfTaskGrades == 0);

        var taskNumber = 1;
        for (var key in TGFRGradeData) {
            var finalGradeFields = TGFRGradeData[key];
            // if (multipleTaskGrades) tableHeaders.push(taskNumber);

            for (var taskGradeID in finalGradeFields) {
                var taskGrade = finalGradeFields[taskGradeID];

                var value = null;
                var maxValue = null;
                var convNumGrade = null;

                if (taskGrade.type === "Pass/Fail" || taskGrade.type === "Label" || taskGrade.type === "Rating" || taskGrade.type === "Numeric") {
                    if (taskGrade.type === "Label") {
                        value = taskGrade.value + " (" + taskGrade.labelPosition + " out of " + taskGrade.max + ")";
                        maxValue = taskGrade.labelMaxValue + " (" + taskGrade.max + " out of " + taskGrade.max + ")";
                        convNumGrade = taskGrade.convertedNumericValue /*+ " (" + taskGrade.labelPosition + ")"*/;

                    } else if (taskGrade.type === "Pass/Fail") {
                        value = taskGrade.value;
                        maxValue = "pass";
                        convNumGrade = taskGrade.convertedNumericValue;
                    } else {
                        value = taskGrade.value;
                        maxValue = taskGrade.max;
                        convNumGrade = taskGrade.convertedNumericValue;
                    }



                    TableTGFRGradeData.push({
                        Field: taskGrade.name != null ? taskGrade.name : "Unnamed",
                        Type: taskGrade.type,
                        Value: value,
                        ConvertedNumericValue: convNumGrade,
                        Max: maxValue,
                        WeightWTask: "" + taskGrade.weight + "%",
                        ScaledGrade: taskGrade.scaledGrade
                    });
                }


            }

            TableTGFRGradeData.push({
                Field: <h2 className="total">{strings.Total}</h2>,
                ScaledGrade: < h2 className="total" > {taskTotalGrade}</h2 >
            });

            TableTGFRGradeDataFrame.push(TableTGFRGradeData);
            TableTGFRGradeData = [];
        }

        // if (numOfTaskGrades == 0){
        //     return (
        //         <div className="section card-2 sectionTable">
        //         <h2 className="title">{strings.TGFRHeader + ": " + taskID}</h2>
        //         <div className="section-content">
        //             <div className="col-xs-6">
        //                 <TableComponent
        //                     data={taskGradeData}
        //                     columns={[
        //                         {
        //                             Header: strings.Field,
        //                             accessor: 'Field',
        //                             resizable:true      
        //                         },
        //                         {
        //                             Header: strings.Type,
        //                             accessor: 'Type',
        //                             resizable:true
        //                         },
        //                         {         
        //                             Header: strings.Value,
        //                             accessor: 'Value',
        //                             resizable:true                              
        //                         },
        //                         {
        //                             Header: strings.Max,
        //                             resizable:true,
        //                             accessor: 'Max'
        //                         },
        //                         {
        //                             Header: strings.ConvertedNumericValue,
        //                             accessor: 'ConvertedNumericValue',
        //                             resizable: true
        //                         },
        //                         {
        //                             Header: strings.WeightWTask,
        //                             resizable:true,
        //                             accessor: 'WeightWTask'
        //                         },
        //                         {
        //                             Header: strings.ScaledGradeTask,
        //                             resizable:true,
        //                             accessor: 'ScaledGrade'
        //                         }
        //                     ]}
        //                     noDataText={strings.TaskGradeNoData}
        //                 /></div>);
        //                 })}
        //             </div>
        //         </div>
        //     );
        // }

        // else return (
        //     <div className="section card-2 sectionTable">
        //         <h2 className="title">{strings.TGFRHeader + ": " + taskID}</h2>
        //         <div className="section-content">
        //             <div className="col-xs-6">
        //             {TableTGFRGradeDataFrame.map((taskGradeData, index) => {
        //                     return (
        //                     <div key={index}>
        //                     <div><b><h3>{singleTaskGrade ? "" : "Grading Task #" + (index + 1)}</h3></b></div>  <TableComponent
        //                     data={taskGradeData}
        //                     columns={[
        //                         {
        //                             Header: strings.Field,
        //                             accessor: 'Field',
        //                             resizable:true      
        //                         },
        //                         {
        //                             Header: strings.Type,
        //                             accessor: 'Type',
        //                             resizable:true
        //                         },
        //                         {         
        //                             Header: strings.Value,
        //                             accessor: 'Value',
        //                             resizable:true                              
        //                         },
        //                         {
        //                             Header: strings.Max,
        //                             resizable:true,
        //                             accessor: 'Max'
        //                         },
        //                         {
        //                             Header: strings.ConvertedNumericValue,
        //                             accessor: 'ConvertedNumericValue',
        //                             resizable: true
        //                         },
        //                         {
        //                             Header: strings.WeightWTask,
        //                             resizable:true,
        //                             accessor: 'WeightWTask'
        //                         },
        //                         {
        //                             Header: strings.ScaledGradeTask,
        //                             resizable:true,
        //                             accessor: 'ScaledGrade'
        //                         }
        //                     ]}
        //                     noDataText={strings.TaskGradeNoData}
        //                 /></div>);
        //                 })}
        //             </div>
        //         </div>
        //     </div>
        // );

        return (
            <div ref={this.myRef}>
                <MultiTaskGradeTable
                    taskTotalGrade={taskTotalGrade}
                    taskLabel={taskLabel}
                    multiTaskGradeFieldsData={TableTGFRGradeDataFrame}
                    numOfTaskGrades={numOfTaskGrades}
                    extraCrediTaskGrade={false}
                    taskID={taskID}
                    tableSubheader={tableSubheader}
                    strings={strings} >
                </MultiTaskGradeTable>
            </div>

        );

    }
}

export default TaskGradeFieldsReport;