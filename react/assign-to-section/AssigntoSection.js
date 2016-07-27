import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './components/Tasks.js';
import request from 'request';
import Assignment from './components/Assignment.js';
import WorkFlow from './components/WorkFlow.js';
var moment = require('moment');

class AssignToSectionContainer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state=
    {
      Assignment:{
        StartNow:false,
        StartLater:false,
        Section:[],
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
    DataLoaded: false
  }
}

  componentWillMount(){
     const options = {
       method: 'GET',
        uri: this.props.apiUrl +'/api/getAssignToSection/',
        qs:{
          courseid: this.props.CourseID,
          assignmentid: this.props.AssignmentID
        },
        json: true

      };

      request(options, (err, res, body) => {
        console.log(body);
        let workflows = Object.keys(body.taskActivityCollection).map(function(key){
          let tasks = body.taskActivityCollection[key].map(function(task){
            return {ID: task.taskActivityID,
              Name: task.name,
              StartNow:false,
              StartLater:false,
              Time:0,
              TimeArray:[]};
          },this);

          return {
            id: key,
            StartNow:false,
            StartLater:false,
            Time:0,
            Tasks: tasks
          };

        }, this);


        this.setState(
          {WorkFlow:workflows,
           Sections: body.sectionIDs,
          DataLoaded: true}
         );
       });
  }

  onSubmit(){
    console.log('clicked')

    const options = {
      method: 'POST',
      uri: /*this.props.apiUrl*/ 'http://localhost:3000/api' +'/getAssignToSection/submit/',
      body:{
        assignmentid: this.props.AssignmentID,
        sectionIDs: this.state.Assignment.Section,
        startDate: this.state.Assignment.Time,
        wf_timing: this.state.WorkFlow
      },
      json: true

    };

      request(options, (err, res, body) => {
        if(res.statusCode === 200){
          console.log('Submit worked');
        }
        else{
          console.log('Something went wrong');
        }
      });
    return
  }

  onChangeCalendarAssignment(dateString)
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

  onChangeAssigmentName(Name)
  {
    let newA = this.state.Assignment;
    newA.AssigmentName = Name.target.value;
    this.setState({Assignment: newA});
  }

  onChangeSectionAssignment(Section)
  {
    console.log(Section);
    let newA = this.state.Assignment;
    newA.Section = Section;
    this.setState({Assignment: newA});
  }

  onChangeCalendarTasks(index, workflowIndex, dateString)
  {
    let newA = this.state.WorkFlow;
    newA[workflowIndex].Tasks[index].Time = dateString.format("YYYY-MM-DD HH:mm:ss");
    newA[workflowIndex].Tasks[index].TimeArray = ['specific time',newA[workflowIndex].Tasks[index].Time];

    this.setState({Tasks: newA});
  }

  onChangeMultipleTasks(index, workflowIndex, value)
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

  onChangeCalendarWorkFlow( workflowIndex,dateString)
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

  render()
  {

    if(!this.state.DataLoaded){
      return (<div></div>);
    }

    let workflowView = this.state.WorkFlow.map(function(workflow, workindex)
    {
      let tasks = workflow.Tasks.map(function(task, index){
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
        <span>
          <Assignment Assignment={this.state.Assignment}
          SectionsList={this.state.Sections}
          onChangeCalendarAssignment ={this.onChangeCalendarAssignment.bind(this)}
          onChangeStartLaterAssignment={this.onChangeStartLaterAssignment.bind(this)}
          onChangeStartNowAssignment = {this.onChangeStartNowAssignment.bind(this)}
          onChangeAssigmentName = {this.onChangeAssigmentName.bind(this)}
          onChangeSectionAssignment = {this.onChangeSectionAssignment.bind(this)}
          />
        </span>

        <span style={{display:'block'}}>
          {workflowView}
        </span>
        <button type="button" style={{marginBottom: '50px'}} onClick={this.onSubmit.bind(this)}>Submit</button>
      </div>
      //Assign to Section by Krzysztof Andres.
    )
  }
}
export default AssignToSectionContainer;
