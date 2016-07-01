import React from 'react';
import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';


class AssignmentEditorContainer extends React.Component{
    constructor(props){
      super(props);

      this.state = {

      };
    }

    render(){
      return (
        <div>
          <AssignmentDetailsComponent/>
          <br />
          <TaskDetailsComponent />

        </div>
      );
    }
}

export default AssignmentEditorContainer;
