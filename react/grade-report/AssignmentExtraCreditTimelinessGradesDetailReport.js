import React from 'react';
import apiCall from '../shared/apiCall';
import TableComponent from '../shared/tableComponent';


class AssignmentExtraCreditTimelinessGradesDetailReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }



    render(){
        //return (<div>The full grade report page is under development and will be ready in late Spring 2019.   You can see the grades for individual tasks from the "All Assignments Status" page.  Look for your submission, and then you can see the grades further along its problem thread.</div>);
        let {strings, GradeData} = this.props;

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.TGFRHeader}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <span style={{backgroundColor: '#C7C7C7', fontSize: '14px', textAlign: 'center', display: 'inline-block', padding: '5px', width: '99%'}}>{"Temp"}</span>
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

export default AssignmentExtraCreditTimelinessGradesDetailReport;