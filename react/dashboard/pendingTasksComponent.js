import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import TableComponent from '../shared/tableComponent';

export default class PendingTaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PendingTasks: [],
            PendingTasksData: []
        };

        this.makeRevisionLabel = this.makeRevisionLabel.bind(this);
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
                        Revision: task.TaskActivity.AllowRevision,
                        Status: typeof task.Status === 'string' ? JSON.parse(task.Status) : task.Status,//task.Status,
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

    makeRevisionLabel({original, row, value}){
        //if(original.Status.indexOf('submitted_for_approval') != -1 || original.Status.indexOf('being_revised') != -1){
        if(original.Revision == true ||
           original.Status[2].indexOf('submitted_for_approval') != -1 ||
           original.Status[2].indexOf('being_revised') != -1 )  
        {

            return <div>({this.props.Strings.Revision}){value}</div>;
        
        }
        return <div>{value}</div>;
    }
    
    render() {
        let {Strings} = this.props;
        let {PendingTasks, PendingTasksData} = this.state;
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.PendingTasks}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        
                        <TableComponent
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
                                    Cell: this.makeRevisionLabel,
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
                            noDataText={Strings.NoPending}
                        />
                    </div>
                </div>
            </div>
        );
    }

}