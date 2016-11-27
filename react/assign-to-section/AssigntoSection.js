/*  This is the main Container for the Assign to section page. It displays the appropriate Components
* depending on the data it fetches from the database. This Container also contains the onChange function
* that are passed down to its Components, so any changes made to those functions should be in here.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './components/Tasks.js';
import request from 'request';
import Assignment from './components/Assignment.js';
import WorkFlow from './components/WorkFlow.js';
var moment = require('moment');
//import ModalInfo from '../assignment-records/info-modal';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../../server/utils/constants';

class AssignToSectionContainer extends React.Component
{
  constructor(props)
  {
    super(props);
    /*
      Props:
            - apiUrl
            - CourseID
            - AssignmentID
    */

    this.state=
    { //structure of the data being passes in from the database
      Assignment:{
        StartNow:false,
        StartLater:false,
        Section:[],
        Semester: null,
        Time:0,
        AssigmentName:""
      },
      WorkFlow:[{
        id: null,
        StartNow:false,
        StartLater:false,
        Time:0,
        Tasks:[{ID: 1,
          Name: "Krispy Kreme",
          StartNow:false,
          StartLater:false,
          Time:0,
          TimeArray:[null]
      }]
    },{
      id: null,
      StartNow:false,
      StartLater:false,
      Time:0,
      Tasks:[{ID: 1,
        Name: "Krispy Kreme",
        StartNow:false,
        StartLater:false,
        Time:0,
        TimeArray:[null]
    }],
  }],
    Sections: null,
    SubmitSuccess:false,
    SubmitError: false,
    DataLoaded: false
  }
}

  componentWillMount(){ //gets the appropraite assignment structure from the database before rendering the page
    let semestersArray = null;

     const options = {
       method: 'GET',
        uri: this.props.apiUrl +'/api/getAssignToSection/',
        qs:{
          courseid: this.props.CourseID,
          assignmentid: this.props.AssignmentID
        },
        json: true
      };
      const semOptions = {
          method: 'GET',
          uri: this.props.apiUrl + '/api/semester',
          json: true
      };

      request(options, (err, res, body) => {
        let workflows = Object.keys(body.taskActivityCollection).map(function(key){
          let tasks = body.taskActivityCollection[key].map(function(task){
            return {
              ID: task.taskActivityID,
              Type:task.type,
              Name: task.name,
              StartNow:false,
              StartLater:false,
              Time:0,
              TimeArray:[]
            };
          }, this);

          return {
            id: key,
            StartNow:false,
            StartLater:false,
            Time:0,
            Tasks: tasks
          };

        }, this);

        request(semOptions, (err2, res2, bod2) => {
          semestersArray = bod2.Semesters.map(function(sem){
            return ( {value: sem.SemesterID, label: sem.Name} );
          });

          let newA= this.state.Assignment;
          newA.AssigmentName = body.assignment.DisplayName;
          this.setState({
            Assignment: newA,
            Semesters:semestersArray,
            WorkFlow:workflows,
             Sections: body.sectionIDs,
            DataLoaded: true
          });
        });
       });
  }

  onSubmit(){
    //saves the state data to the database


    let timingArray = this.state.WorkFlow.map(function(Workflow){

      let work_task = Workflow.Tasks.map(function(tk){
        return {
          id: tk.ID,
          DueType: tk.TimeArray
        };
      });

      return {
        id: Workflow.id,
        startDate: Workflow.Time,
        tasks: work_task
      };
    });

    let newData = {
      assignmentid: this.props.AssignmentID,
      sectionIDs: this.state.Assignment.Section,
      startDate: this.state.Assignment.Time,
      wf_timing: {
        workflows: timingArray
      }
    };


    const options = {
      method: 'POST',
      uri: this.props.apiUrl +'/api/getAssignToSection/submit/',
      body: newData,
      json: true
    };

      request(options, (err, res, body) => {
        if(res.statusCode === 200){
          console.log('Submit worked');
          this.setState({
            SubmitSuccess: true
          });
        }
        else{
          console.log('Something went wrong');
        }
      });
    return
  }

//////////////// Functions used in the Assignment Component ////////////////////
  onChangeCalendarAssignment(dateString) //dateString is supplied by Datetime module
  {

    let newA = this.state.Assignment;
    newA.Time = dateString.format("YYYY-MM-DD HH:mm:ss");
    this.setState({Assignment: newA});
  }

  onChangeStartLaterAssignment()
  {
    let newA = this.state.Assignment;
    newA.StartNow = false;
    newA.StartLater = true;
    newA.Time = moment().add(3, 'days').format("MM/DD/YYYY")+(' 23:59');
    this.setState({Assignment: newA});
  }

  onChangeStartNowAssignment()
  {
    let newA = this.state.Assignment;
    newA.StartNow = true;
    newA.StartLater = false;
    newA.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({Assignment: newA});
  }

  onChangeAssigmentName(e) //e is event that is automatically passed in
  {
    let newA = this.state.Assignment;
    newA.AssigmentName = e.target.value;
    this.setState({Assignment: newA});
  }

  onChangeSemesterAssignment(val){
    let newA = this.state.Assignment;
    newA.Semester = val;
    this.setState({Assignment: newA});
  }

  onChangeSectionAssignment(Section) //Section is automatically passed in by CheckBoxList module
  {
    let newA = this.state.Assignment;
    newA.Section = Section;
    this.setState({Assignment: newA});
  }

//----------------------------------------------------------------------------

/////////////// Functions used in Tasks Component /////////////////////////////
  onChangeCalendarTasks(index, workflowIndex, dateString) //index is task's index in the tasks array, workflowIndex is index in WorkFlow array
    // dateString automatically passed in by Datetime module
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].Tasks[index].Time = dateString.format("YYYY-MM-DD HH:mm:ss");
    newA[workflowIndex].Tasks[index].TimeArray = ['specific time',newA[workflowIndex].Tasks[index].Time];

    this.setState({Tasks: newA});
  }

  onChangeMultipleTasks(index, workflowIndex, value) // value automatically passed in by NumericInput
  {
    let newA = this.state.WorkFlow;
    if (value > 100)
    {
      value = 100;
    }

    newA[workflowIndex].Tasks[index].Time = value*1440;
    newA[workflowIndex].Tasks[index].TimeArray = ['duration',newA[workflowIndex].Tasks[index].Time];
    this.setState({Tasks: newA});
  }

  onChangeExpireNumberOfDaysTasks(index, workflowIndex)
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].Tasks[index].StartNow= true;
    newA[workflowIndex].Tasks[index].StartLater=false;
    newA[workflowIndex].Tasks[index].Time = 3 * 1440;
    newA[workflowIndex].Tasks[index].TimeArray = ['duration',newA[workflowIndex].Tasks[index].Time];
    this.setState({Tasks: newA});
  }

  onChangeCertainTimeTasks(index, workflowIndex)
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].Tasks[index].StartNow= false;
    newA[workflowIndex].Tasks[index].StartLater=true;
    newA[workflowIndex].Tasks[index].Time = moment().add(3, 'days').format("MM/DD/YYYY")+(' 23:59');
    newA[workflowIndex].Tasks[index].TimeArray = ['specific time',newA[workflowIndex].Tasks[index].Time];
    this.setState({Tasks: newA});
  }

//-----------------------------------------------------------------------------

/////////// Functions used in WorkFlow Component ///////////////////////////////
  onChangeCalendarWorkFlow( workflowIndex,dateString) //workflowIndex is index in WorkFlow array, usually passed in as workflowIndex index prop
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].Time = dateString.format("YYYY-MM-DD HH:mm:ss");;
    this.setState({WorkFlow: newA});
  }

  onChangeStartLaterWorkFlow(workflowIndex)
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].StartNow = false;
    newA[workflowIndex].StartLater = true;
    newA[workflowIndex].Time = moment().add(3, 'days').format("MM/DD/YYYY")+(' 23:59');
    this.setState({WorkFlow: newA});
  }

  onChangeStartNowWorkFlow(workflowIndex)
  {
    let newA = this.state.WorkFlow
    newA[workflowIndex].StartNow = true;
    newA[workflowIndex].StartLater = false;
    newA[workflowIndex].Time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.setState({WorkFlow: newA});
  }

  //--------------------------------------------------------------------------

  render()
  {

    let infoMessage = null;

    if(!this.state.DataLoaded){
      return (<div></div>);
    }
    if(this.state.SubmitSuccess){
      infoMessage = (<span onClick={() => {this.setState({SubmitSuccess: false})}} style={{backgroundColor: '#00AB8D', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px rgb(0, 171, 141)'}}> Successfully submitted! </span>);
    }
    if(this.state.SubmitError){
      infoMessage = (<span onClick={() => {this.setState({SubmitError: false})}} style={{backgroundColor: '#ed5565', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px #ed5565'}}>Submit Error! Please check your work and try again </span>);
    }
    let workflowView = this.state.WorkFlow.map(function(workflow, workindex)
    {
      let tasks = workflow.Tasks.map(function(task, index){
        if(task.Type == TASK_TYPES.NEEDS_CONSOLIDATION || task.Type == TASK_TYPES.COMPLETED ){
          return null;
        }

        return (
            <Tasks key = {index} Tasks={task} index={index} workflowIndex={workindex}
            onChangeCalendarTasks={this.onChangeCalendarTasks.bind(this)}
            onChangeMultipleTasks={this.onChangeMultipleTasks.bind(this)}
            onChangeExpireNumberOfDaysTasks={this.onChangeExpireNumberOfDaysTasks.bind(this)}
            onChangeCertainTimeTasks = {this.onChangeCertainTimeTasks.bind(this)} />
        );

      },this);

      return (
        <div>
          <span>
            <WorkFlow WorkFlow = {workflow} workflowIndex ={workindex}
            onChangeCalendarWorkFlow = {this.onChangeCalendarWorkFlow.bind(this)}
            onChangeStartLaterWorkFlow = {this.onChangeStartLaterWorkFlow.bind(this)}
            onChangeStartNowWorkFlow = {this.onChangeStartNowWorkFlow.bind(this)}/>
          </span>
          {tasks}
        </div>);
    }, this);

    return (
      <div style={{display:'inline-block'}}>
        {infoMessage}
        <span>
          <Assignment Assignment={this.state.Assignment}
          SectionsList={this.state.Sections}
          Semesters={this.state.Semesters}
          onChangeCalendarAssignment ={this.onChangeCalendarAssignment.bind(this)}
          onChangeStartLaterAssignment={this.onChangeStartLaterAssignment.bind(this)}
          onChangeStartNowAssignment = {this.onChangeStartNowAssignment.bind(this)}
          onChangeAssigmentName = {this.onChangeAssigmentName.bind(this)}
          onChangeSectionAssignment = {this.onChangeSectionAssignment.bind(this)}
          onChangeSemesterAssignment = {this.onChangeSemesterAssignment.bind(this)}
          />
        </span>

        <span style={{display:'block'}}>
          {workflowView}
        </span>
        <button type="button" style={{marginBottom: '50px'}} onClick={this.onSubmit.bind(this)}>Submit</button>
      </div>

    )
  }
}
//Assign to Section by Krzysztof Andres.
export default AssignToSectionContainer;
