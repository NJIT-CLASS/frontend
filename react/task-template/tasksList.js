import React from 'react';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants'; //contains constants and their values
// Input Components: These can be interactive with the user;
import SuperComponent from './superComponent';

import MultiViewComponent from './multiViewComponent';
import SuperViewComponent from './superViewComponent';

class TasksList extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let { TasksArray, TaskID, UserID, Strings, apiUrl, getLinkedTaskValues } = this.props;

        return <div>
            {
                TasksArray.map(function(task, idx) {
        		// Goes over the array of tasks(starting from first task to this task)
        		// and gives the Components an appropriate title.
        		// Also finds grading tasks and puts them in a gradedComponent (although this wasn't tested properly)

                    let compString = null;
                    if (idx == TasksArray.length - 1) {
                    
                        if (task.Status == 'Complete' || task.Status == 'complete') {
                            return (
        					<SuperViewComponent
        						key={idx + 2000}
        						index={idx}
        						ComponentTitle={task.TaskActivity.DisplayName}
        						TaskData={task.Data}
        						Files={task.Files}
        						Instructions={task.TaskActivity.Instructions}
        						Rubric={task.TaskActivity.Rubric}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Strings={Strings}
                                    TaskID={task.TaskInstanceID}
                                    addCommentListItem={this.props.addCommentListItem.bind(this)}
                                    showComments={this.props.showComments.bind(this)}
                                    CurrentTaskType={this.props.CurrentTaskType}
        					/>
                            );
                        } 
                    
                        if(this.props.TaskStatus.includes('complete')){
                            return (
        					<SuperViewComponent
        						key={idx + 2000}
        						index={idx}
        						ComponentTitle={task.TaskActivity.DisplayName}
        						TaskData={task.Data}
        						Files={task.Files}
        						Instructions={task.TaskActivity.Instructions}
        						Rubric={task.TaskActivity.Rubric}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Strings={Strings}
                                    TaskID={task.TaskInstanceID}
                                    addCommentListItem={this.props.addCommentListItem.bind(this)}
                                    showComments={this.props.showComments.bind(this)}
                                    CurrentTaskType={this.props.CurrentTaskType}
        					/>
                            );
                        }
                        else {
                            return (
        					<SuperComponent
        						key={idx + 2000}
                                    index={idx}
        						TaskID={TaskID}
        						UserID={UserID}
        						Files={task.Files}
                                    getLinkedTaskValues={getLinkedTaskValues.bind(this)}
        						ComponentTitle={task.TaskActivity.DisplayName}
        						Type={task.TaskActivity.Type}
        						FileUpload={task.TaskActivity.FileUpload}
        						TaskData={task.Data}
        						TaskStatus={task.Status}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Instructions={task.TaskActivity.Instructions}
        						Rubric={task.TaskActivity.Rubric}
        						Strings={Strings}
        						apiUrl={apiUrl}
                                    showComments={this.props.showComments.bind(this)}
                                    addCommentListItem={this.props.addCommentListItem.bind(this)}
                                    IsRevision={this.props.IsRevision}
                                    CurrentTaskType={this.props.CurrentTaskType}
        					/>
                            );
                        }
                    } else {
                        if (Array.isArray(task)) {
                            return (
        					<MultiViewComponent
        						UsersTaskData={task}
        						TaskID={TaskID}
        						UserID={UserID}
        						Strings={Strings}
                                    addCommentListItem={this.props.addCommentListItem.bind(this)}
                                    showComments={this.props.showComments.bind(this)}
        					/>
                            );
                        } else {
                        
                            return (
        					<SuperViewComponent
        						key={idx + 2000}
        						index={idx}
        						Instructions={task.TaskActivity.Instructions}
        						Rubric={task.TaskActivity.Rubric}
        						ComponentTitle={task.TaskActivity.DisplayName}
        						TaskData={task.Data}
                                    Status={task.Status}
        						Files={task.Files}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Strings={Strings}
                                    TaskID={task.TaskInstanceID}
                                    addCommentListItem={this.props.addCommentListItem.bind(this)}
                                    showComments={this.props.showComments.bind(this)}
                                    CurrentTaskType={this.props.CurrentTaskType}
        					/>
                            );
                        }
                    }
                }, this)
            }
        </div>;
    }
}


export default TasksList;
