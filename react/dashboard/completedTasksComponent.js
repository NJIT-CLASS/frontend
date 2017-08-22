import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import moment from 'moment';

export default class CompletedTaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CompletedTasks:[],
            
        };
    }
    componentWillMount () {
        this.fetchCompleted(this.props.UserID);
    }

    fetchCompleted(userId){
        apiCall.get(`/getCompletedTaskInstances/${userId}`, (err, res,body)=> {
            if(res.statusCode === 200){
                this.setState({
                    CompletedTasks: body.CompletedTaskInstances
                });
            }
        });
    }
    
    render() {
        let {Strings} = this.props;
        let {CompletedTasks} = this.state;
        let taskList = null;
        if(CompletedTasks.length > 0){
            taskList = CompletedTasks.map(task => {
                const formattedDate = moment(task.ActualEndDate).format('MMMM Do, YYYY h:mm a');
                return (
                    <tr>
                        <td data-label={Strings.Assignment}>
                            <a href={`/task/${task.TaskInstanceID}`}>{task.AssignmentInstance.Assignment.Name}</a>
                        </td>
                        <td data-label={Strings.Type}>{task.TaskActivity.DisplayName}</td>
                        <td data-label={Strings.Course}>{task.AssignmentInstance.Section.Course.Name}</td>
                        <td data-label={Strings.EndDate}>{formattedDate}</td>
                    </tr>
                );
            });
        } 
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.CompletedTasks}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <table width="100%" className="sticky-enabled tableheader-processed sticky-table">
                            <thead><tr><th>{Strings.Assignment}</th><th>{Strings.Type}</th><th>{Strings.Course}</th><th>{Strings.EndDate}</th> </tr></thead>
                            <tbody>
                                {taskList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}