import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import TableComponent from '../shared/tableComponent';
import { concatSeries } from 'async';

export default class CompletedTaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CompletedTasks:[],
            CompletedTasksData: []
        };
    }
    componentWillMount () {
        this.fetchCompleted(this.props.UserID);
    }

    fetchCompleted(userId){
        apiCall.get(`/getCompletedTaskInstances/${userId}`, (err, res,body)=> {
            if(res.statusCode === 200){
                console.log(body)
                let transformedTaskList = body.CompletedTaskInstances.map(task => {
                    return {
                        Assignment: task.AssignmentInstance.DisplayName,
                        TaskID: task.TaskInstanceID,
                        Type: task.TaskActivity.DisplayName,
                        CourseNumber: task.AssignmentInstance.Section.Course.Number,
                        SectionName: task.AssignmentInstance.Section.Name,
                        Course: task.AssignmentInstance.Section.Course.Name,
                        Date: task.ActualEndDate,
                    };
                });

                this.setState({
                    CompletedTasks: body.CompletedTaskInstances,
                    CompletedTasksData: transformedTaskList
                });
            }
        });
    }
    makeLink({original, row, value}){
        return <a  href={`/task/${original.TaskID}`}>{value}</a>;
    }
    makeDate({original, row, value}){
        return <span>{moment(value).format('MMMM Do, YYYY h:mm a')}</span>;
    }

    makeCourse({ original, row, value }){
        let displayText = value;
        if(original.CourseNumber != null && original.SectionName != null){
            displayText = `${original.CourseNumber} - ${original.SectionName}`;
        }
        return <div>{displayText}</div>;
    }

    render() {
        let {Strings} = this.props;
        let {CompletedTasks, CompletedTasksData} = this.state;
        console.log(CompletedTasksData)
        
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.CompletedTasks}</h2>
                <div className="section-content">
                    
                    <TableComponent
                        data={CompletedTasksData}
                        columns={[
                            {
                                Header: Strings.Assignment,
                                accessor: 'Assignment',
                                Cell: this.makeLink,
                                  
                            },
                            {
                                Header: Strings.Type,
                                accessor: 'Type'
                            },
                            {         
                                Header: Strings.Course,
                                accessor: 'Course',
                                Cell:this.makeCourse                                

                            },{
                                Header: Strings.EndDate,
                                accessor: 'Date',
                                Cell: this.makeDate
                            }
                        ]}
                        noDataText={Strings.NoCompleted}

                    />
                </div>
            </div>
        );
    }
}