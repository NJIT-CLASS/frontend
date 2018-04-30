import React, { Component } from 'react';
import TaskComponent from './task-component';
import Checkbox from '../shared/checkbox';

const WorkflowInstanceComponent = ({currentUserID, hasInstructorPrivilege, Workflow, Structure, WI_ID, WA_ID, Filters, Strings, onReplaceUserInTaskButtonClick, onMoreInformationButtonClick, showCheckboxes, onCheckboxClick, selectedWorkflowIDs}) => {
    let showWorkflow = true;
    if(Filters.WorkflowID !== ''){
        showWorkflow = WI_ID === Filters.WorkflowID;
    }
    let taskActivitiesArray = Object.keys(Workflow).map(key => {
        return <TaskComponent TaskActivity={Workflow[key]}
            TA_ID={key}
            WI_ID={WI_ID}
            WA_ID={WA_ID}
            key={`${WA_ID}-${WI_ID}-${key}`}
            Filters={Filters}
            Strings={Strings}
            onReplaceUserInTaskButtonClick={onReplaceUserInTaskButtonClick}
            onMoreInformationButtonClick={onMoreInformationButtonClick}
            hasInstructorPrivilege={hasInstructorPrivilege}
            currentUserID={currentUserID}
        />;
    });

    if(showWorkflow){
        return <div className="workflow-block">
            {
                showCheckboxes ?
                    <Checkbox
                        isClicked={selectedWorkflowIDs.includes(WI_ID)}
                        click={() => onCheckboxClick(WI_ID)}
                    />
                    : null
            }
            <div className="workflow-instance-label">{WI_ID}</div>
            <div className="workflow-instance">{taskActivitiesArray}<br/><br/></div>
        </div>;
    }
    return null;
};

export default WorkflowInstanceComponent;
