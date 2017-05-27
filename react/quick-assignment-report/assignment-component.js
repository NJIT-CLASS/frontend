import React, { Component } from 'react';
import WorkflowComponent from './workflow-component';

const AssignmentComponent = ({Assignment, Filters ,Strings}) => {
    const workflowsArray = Object.keys(Assignment).map((key) => {
        return <WorkflowComponent WorkflowInstances={Assignment[key].WorkflowInstances}
                                  WorkflowStructure={Assignment[key].Structure}
                                  WA_ID={key}
                                  key={key}
                                  Filters={Filters}
                                  Strings={Strings}
                                />;
    });

    return <div>{workflowsArray}</div>;
};

export default AssignmentComponent;
