import React from 'react';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants'; //contains constants and their values
// Input Components: These can be interactive with the user;
import SuperComponent from './superComponent';

import MultiViewComponent from './multiViewComponent';
import SuperViewComponent from './superViewComponent';

class TasksList extends React.Component{
    constructor(props){
        super(props);

        this.toggleTaskContent = this.props.toggleTaskContent.bind(this);
    }

    render(){
        let { TasksArray, TaskID, UserID, Strings, getLinkedTaskValues,TaskContentFlags } = this.props;


        return <div>
            {
                TasksArray.map(function(task, idx) {
        		// Goes over the array of tasks(starting from first task to this task)
        		// and gives the Components an appropriate title.

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
                                    TaskActivity={task.TaskActivity}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Strings={Strings}
                                    TaskID={task.TaskInstanceID}
                                    showComments={this.props.showComments.bind(this)}
                                    Type={task.TaskActivity.Type}
                                    Status={task.Status}
                                    toggleTaskContent = {this.toggleTaskContent}
                                    TaskContentFlags={TaskContentFlags}
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
                                    TaskActivity={task.TaskActivity}
                                    TaskActivityFields={task.TaskActivity.Fields}
                                    TaskID={task.TaskInstanceID}
                                    Strings={Strings}
                                    showComments={this.props.showComments.bind(this)}
                                    Type={task.TaskActivity.Type}
                                    Status={task.Status}
                                    toggleTaskContent = {this.toggleTaskContent}
                                    TaskContentFlags={TaskContentFlags}
								
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
                                    showComments={this.props.showComments.bind(this)}
                                    IsRevision={this.props.IsRevision}
                                    toggleTaskContent = {this.toggleTaskContent}
                                    TaskContentFlags={TaskContentFlags}
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
                                    showComments={this.props.showComments.bind(this)}
                                    toggleTaskContent = {this.toggleTaskContent}
                                    TaskContentFlags={TaskContentFlags}
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
                                    TaskActivity={task.TaskActivity}
        						TaskActivityFields={task.TaskActivity.Fields}
        						Strings={Strings}
                                    TaskID={task.TaskInstanceID}
                                    showComments={this.props.showComments.bind(this)}
                                    Type={task.TaskActivity.Type}
                                    toggleTaskContent = {this.toggleTaskContent}
                                    TaskContentFlags={TaskContentFlags}
									
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
