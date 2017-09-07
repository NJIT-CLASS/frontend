import React, { Component } from 'react';


const trunc = (str, n ) => {
    if (str.length <= n) { return str; }
    var subString = str.substr(0, n-1);
    return (subString.substr(0, subString.lastIndexOf(' ')) ) + '...';
};

const ListItemComponent = ({TaskObject, UserID}) => {
    let taskId = TaskObject.LatestTask;
    let taskData = JSON.parse(TaskObject.FirstTask.Data);

    if(taskData !== null){
        let problemText = trunc(taskData[0][0][0], 100);
        
        if(taskId != null){
            return (<li><a target="_blank" href={`/task/${taskId}?visitorId=${UserID}`}>{problemText}</a></li>);
                
        } else {
            return (<li><div href={`/task/${taskId}`}>{problemText}</div></li>);
        }
    } else {
        return null;
    }
    
};
export default ListItemComponent;