import React, { Component } from 'react';
import MarkupView from '../shared/markupTextInlineView';

const trunc = (str, n ) => {
    if(str == null) return '';
    if (str.length <= n) { return str; }
    var subString = str.substr(0, n-1);
    if(subString == null) return '';
    return (subString.substr(0, subString.lastIndexOf(' ')) ) + '...';
};

const ListItemComponent = (props) => {
    const {TaskObject, UserID} = props;
    let taskId = TaskObject.LatestTask;
    let taskData = TaskObject.FirstTask != null ?
        JSON.parse(TaskObject.FirstTask.Data) :
        null;
    if(taskData !== null){
        let problemText = trunc(taskData[0][0][0], 100);
        if(taskId != null){
            return <li className="list-group-item item-hover" onClick={props.selectWorkflow.bind(this, TaskObject.WorkflowInstanceID)} style={{ cursor: 'pointer' }}>
                <MarkupView content={problemText} />
            </li>;
            // return (<li onClick={props.selectWorkflow}><a target="_blank" href={`/task/${taskId}?visitorId=${UserID}`}>
            //     <MarkupView content={problemText} />
            // </a></li>);   
        } else {
            return (<li className="list-group-item item-hover">
                <MarkupView content={problemText} />
            </li>);
        }
    } else {
        return null;
    }
    
};
export default ListItemComponent;