import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

const AssignmentComponent = ({Assignment, Filters}) => {
    const workflowsArray = Object.keys(Assignment).map((key) => {
        return <WorkflowComponent WorkflowInstances={Assignment[key].WorkflowInstances}
                                  WorkflowStructure={Assignment[key].Structure}
                                  WA_ID={key}
                                  key={key}
                                  Filters={Filters}/>;
    });

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
