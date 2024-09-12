import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';


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

                    // console.log(task);
                    var code = '';

                    if(task.TaskActivity.MustCompleteThisFirst){
                        code += ' #1 ';
                    }
                    if(task.Status.indexOf('late') !== -1){
                        code += ' ! ';
                    }
                    
                    return {
                        Assignment: task.AssignmentInstance.Assignment.Name,
                        TaskID: task.TaskInstanceID,
                        Type: task.TaskActivity.DisplayName,
                        Course: task.AssignmentInstance.Section.Course.Name,
                        CourseNumber: task.AssignmentInstance.Section.Course.Number,
                        SectionName: task.AssignmentInstance.Section.Name,
                        Revision: task.TaskActivity.AllowRevision,
                        Status: typeof task.Status === 'string' ? JSON.parse(task.Status) : task.Status,//task.Status,
                        Date:task.EndDate,
                        Code:code
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
    makeDate({ original, row, value }) {
        let css = '';
        if (original.Status[3] === 'late') {
            css = 'task-late';
        }
        return <span className={css}>{moment(value).format('MMMM Do, YYYY h:mm a')}</span>;
    }

    makeRevisionLabel({original, row, value}){
        //if(original.Status.indexOf('submitted_for_approval') != -1 || original.Status.indexOf('being_revised') != -1){
        
        let txt = `${value}`;
        let css = '';
        if(original.Revision == true ||
           original.Status[2].indexOf('submitted_for_approval') != -1 ||
           original.Status[2].indexOf('being_revised') != -1 )  
        {

            txt = `(${this.props.Strings.Revision}) ${value}`;
        
        }

        if (original.Status[3] === 'late'){
            css='task-late';
        }
        return <div className={css}>{txt}</div>;
    }

    makeCourse({ original, row, value }){
        let displayText = value;
        if(original.CourseNumber != null && original.SectionName != null){
            displayText = `${original.CourseNumber} - ${original.SectionName}`;
        }
        if (original.Status[3] === 'late') {
            return <div className="task-late">{displayText}</div>;
        }
        return <div>{displayText}</div>;
    }

    makeCode({ original, row, value }){
        if(value.indexOf('#1') !== -1){
            return <div style={{position:'relative'}}><div style={{color:'orange',display:'inline-block'}}>#1 </div><div style={{display:'inline-block'}} className="task-late">{value.substring(value.indexOf('#1')+3,value.length)}</div></div>;
        }

        if (original.Status[3] === 'late') {
            return <div className="task-late">{value}</div>;
        }
    }
    
    render() {
        let {Strings} = this.props;
        let {PendingTasks, PendingTasksData} = this.state;

        const codeHeader = (
            <span>
                {Strings.CodeHeader} 
                <Tooltip 
                    ID='Tooltip'
                    // style={{ float: 'bottom' }}
                    multiline={true}
                    place="bottom"
                    Text={Strings.CodeTooltipExplaination}
                />
            </span>);
        
        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{Strings.PendingTasks}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <span style={{backgroundColor: '#C7C7C7', fontSize: '14px', textAlign: 'center', display: 'inline-block', padding: '5px', width: '99%'}}>{Strings.RedHeader}</span>
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
                                    Cell:this.makeCourse                                
                                },{
                                    Header: Strings.DueDate,
                                    resizable:true,
                                    accessor: 'Date',
                                    Cell: this.makeDate
                                },
                                {
                                    Header: codeHeader,
                                    resizable:true,
                                    accessor: 'Code',
                                    Cell:this.makeCode
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: 'Date',
                                    desc: false
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
