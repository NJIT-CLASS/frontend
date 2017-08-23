import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import ReactTable from 'react-table';

export default class PendingTaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PendingTasks: [],
            PendingTasksData: []
        };
    }
    componentDidMount () {
        this.fetchCompleted(this.props.UserID);
    }

    fetchCompleted(userId){
        apiCall.get(`/getPendingTaskInstances/${userId}`, (err, res,body)=> {
            if(res.statusCode === 200){
                let transformedTaskList = body.PendingTaskInstances.map(task => {
                    return {
                        Assignment: task.AssignmentInstance.Assignment.Name,
                        TaskID: task.TaskInstanceID,
                        Type: task.TaskActivity.DisplayName,
                        Course: task.AssignmentInstance.Section.Course.Name,
                        Date: moment(task.EndDate).format('MMMM Do, YYYY h:mm a'),
                    };
                });
                this.setState({
                    PendingTasks: body.PendingTaskInstances,
                    PendingTasksData: transformedTaskList
                });
            }
        });
    }
    makeLink({original, row, value}){
        return <a  href={`/task/${original.TaskID}`}>{value}</a>;
    }
    
    render() {
        let {Strings} = this.props;
        let {PendingTasks, PendingTasksData} = this.state;
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.PendingTasks}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        
                        <ReactTable
                            data={PendingTasksData}
                            columns={[
                                {
                                    Header: Strings.Assignment,
                                    accessor: d => d.Assignment,
                                    Cell: this.makeLink,
                                    id:'Pending-Assignment',
                                    resizable:true
                                    
                                        
                                },
                                {
                                    Header: Strings.Type,
                                    accessor: 'Type',
                                    id:'Pending-Type',
                                    resizable:true,
                                    
                                },
                                {         
                                    Header: Strings.Course,
                                    accessor: 'Course',
                                    resizable:true,                                    
                                },{
                                    Header: Strings.DueDate,
                                    resizable:true,
                                    accessor: 'Date',
                                }
                            ]}
                            defaultPageSize={10}
                            className="-striped -highlight"
                            resizable={true}
                            noDataText={String.NoPending}
                        />
                    </div>
                </div>
            </div>
        );
    }

}