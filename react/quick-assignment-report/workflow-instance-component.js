import React, { Component } from 'react';
import TaskComponent from './task-component';

const WorkflowInstanceComponent = ({onReallocate, Workflow, Structure, WI_ID, WA_ID, Filters, Strings}) => {
    let showWorkflow = true;
    if(Filters.WorkflowID !== ''){
        showWorkflow = WI_ID === Filters.WorkflowID;
    }
    let taskActivitiesArray = Object.keys(Workflow).map(key => {
        return <TaskComponent onReallocate={onReallocate}
                            TaskActivity={Workflow[key]}
                            TA_ID={key}
                            WI_ID={WI_ID}
                            WA_ID={WA_ID}
                            key={`${WA_ID}-${WI_ID}-${key}`}
                            Filters={Filters}
                            Strings={Strings}
                          />;
    });

    if(showWorkflow){
        return <div className="workflow-block">
          <div className="workflow-instance-label">{WI_ID}</div>
          <div className="workflow-instance">{taskActivitiesArray}<br/><br/></div>
        </div>;
    }
    return null;
};

export default WorkflowInstanceComponent;
