import React, { Component } from 'react';
import TaskComponent from './task-component';

const WorkflowInstanceComponent = ({Workflow, Structure, WI_ID, WA_ID}) => {
    let taskActivitiesArray = Object.keys(Workflow).map(key => {
        return <TaskComponent TaskActivity={Workflow[key]}
                            TA_ID={key}
                            WI_ID={WI_ID}
                            WA_ID={WA_ID}
                            key={`${WA_ID}-${WI_ID}-${key}`}
                          />;
    });
    return <div className="workflow-instance">{taskActivitiesArray}<br/><br/></div>;
};

export default WorkflowInstanceComponent;
