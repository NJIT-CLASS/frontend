import React from 'react';
import AssignmentDetailComponent from './assignmentDetailComponent';
import TaskDetailComponent from './taskDetailComponent';


class AssignSectionContainer extends React.Component{
  constructor(props){
    super(props);

    this.state = {

    }
  }
/*
  functions to generate assignment and task data to pass down;
*/



  render(){
    return(<div>
      <AssignmentDetailComponent />
      <TaskDetailComponent />
    </div>);
  }

}

export default AssignSectionContainer;
