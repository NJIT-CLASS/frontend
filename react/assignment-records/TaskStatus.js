import React from 'react';
import Reactable from 'reactable';
import request from 'request';
import Select from 'react-select';
import {TASK_TYPES, TASK_TYPE_TEXT} from '../../server/utils/constants';

class Frames extends React.Component {
  constructor(props){
    super(props);

    this.state={
        Workflows:null,
        DataLoaded: false,
        ShowContent: true,
        SelectedStudent: '',
        SelectedStatus: '',
        SelectedTask: '',
        SelectedWorkflow: '',
        SelectedSubWorkflow: ''
    }
  }

    componentWillMount(){
      const options = {
        method: 'GET',
         uri: this.props.apiUrl +'/api/getAssignmentRecord/' + this.props.AssignmentID,
         json: true
       };

       var colors = {"In Progress":"#ffffff",
                     "Complete":"#80ff80",
                     "Late":"#ff1a1a",
                     "Not Needed":"#ffff66",
                     "Inactive:":"#d9d9d9"}

       request(options, (err, res, body) => {
         console.log(err, res, body)
         this.setState(
           {Workflows:body.AssignmentRecords,
           DataLoaded: true,
           Info:body.Info,
           WorkflowArray: body.Workflows
          }
          );
        });
   }

   studentDropdownChange(val){
     this.setState({
         SelectedStudent : val
       })
   }

   StatusDropdownChange(val){
     this.setState({
         SelectedStatus : val
       })
   }

   TaskDropdownChange(val){
     this.setState({
         SelectedTask : val
       })
   }

   WorkflowDropdownChange(val){
     this.setState({
         SelectedWorkflow : val
       })
   }

   SubWorkflowDropdownChange(val){
     this.setState({
         SelectedSubWorkflow : val
       })
   }

  render(){
    if(!this.state.DataLoaded){
      return (<div></div>);
    }

    var colorwhite = {"backgroundColor": "#ffffff"}
    var coloryellow = {"backgroundColor": "#F5F598"}
    var colorgreen = {"backgroundColor": "#B4F0BB"}
    var colorgrey = {"backgroundColor": "#E8E8E8"}
    var colorred = {"backgroundColor": "#FCC7C7"}
    var background = {"backgroundColor": "#F3F3F4", 'borderColor':"#bfbfbf"}

    var colors = {"Incomplete":"#ffffff",
                  "Complete":"#B4F0BB",
                  "Late":"#FCC7C7",
                  "Not Needed":"#F5F598",
                  "not_yet_started":"#E8E8E8"}

    var letters =  {
                    "Incomplete":"(I)",
                    "Complete":"(C)",
                    "Late":"(L)",
                    "Not Needed":"(X)",
                    "not_yet_started":"(!)"
                  }

    var Table = Reactable.Table,
    Tr = Reactable.Tr,
    Td = Reactable.Td;
    var count = 0;
    var WorkflowIDDisplayed = [];

    let table = this.state.Workflows.map(function(workflow,index){
      if(index == 0)
      {
        WorkflowIDDisplayed = [];
      }
      let cols = workflow.map(function(task){

        /* When nothing is Selected show the table*/
        if((this.state.SelectedStudent == '') && (this.state.SelectedStatus == '') && (this.state.SelectedTask == '') )
        {
          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
          </td>);
        }

        /* filtering by student,status, and task. */
        else if((task.User.UserName == this.state.SelectedStudent) && (task.Status == this.state.SelectedStatus) && (task.TaskActivity.Type == this.state.SelectedTask))
        {

          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }

          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }

        /* filtering by student and status. */
        else if ((task.User.UserName == this.state.SelectedStudent) && (task.Status == this.state.SelectedStatus))
        {
          if(((this.state.SelectedStudent != "") && (this.state.SelectedStatus != "")) && (this.state.SelectedTask != ""))
          {
            count++;
            return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
          }

          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }

          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }

        /* filtering by task and status */
        else if ((task.TaskActivity.Type == this.state.SelectedTask) && (task.Status == this.state.SelectedStatus))
        {
          if(((this.state.SelectedStudent != "") && (this.state.SelectedStatus != "")) && (this.state.SelectedTask != ""))
          {
            count++;
            return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
          }

          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }

          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }

        /* filtering by student and task. */
        else if ((task.User.UserName == this.state.SelectedStudent) && (task.TaskActivity.Type == this.state.SelectedTask))
        {
          if(((this.state.SelectedStudent != "") && (this.state.SelectedStatus != "")) && (this.state.SelectedTask != ""))
          {
            count++;
            return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
          }

          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }

          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }

        /* filtering by one of student,status, or task. */
        else if((task.User.UserName == this.state.SelectedStudent) || (task.Status == this.state.SelectedStatus) || (task.TaskActivity.Type == this.state.SelectedTask))
        {
          if(((this.state.SelectedStudent != "") && (this.state.SelectedStatus != "")) && (this.state.SelectedTask != ""))
          {
            count++;
            return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
          }
          else if(((this.state.SelectedStudent != "") && (this.state.SelectedStatus != "")) || ((this.state.SelectedStudent != "") && (this.state.SelectedTask != "")) || ((this.state.SelectedStatus != "") && (this.state.SelectedTask != "")))
          {
            count++;
            return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
          }

          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }

          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }

        /* When you want to filtering by everything */
        else if((this.state.SelectedStudent == "All") || (this.state.SelectedStatus == "All") || (this.state.SelectedTask == "All"))
        {
          if(WorkflowIDDisplayed[0] == null)
          {
            WorkflowIDDisplayed[index] = task.WorkflowInstanceID
          }
          else
          {
            WorkflowIDDisplayed.forEach(function(WorkflowIDDisplayedList)
            {
              if(WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1)
              {
                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
              }
            }, this);
          }
          return (<td key={"Col for " + task.TaskInstanceID} className="ColLineColor" style = {{'backgroundColor':colors[task.Status]}}>
          <a key = {"link for " + task.TaskInstanceID} href={"/task/"+task.Type+"/"+task.TaskInstanceID+"?"+"courseId="+this.state.Info.Assignment.CourseId+"&sectionID="+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {"break one for " + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {"break two for " + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {"break three for " + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
        }
        else
        {
          count ++;
          return (<td key={"Col for " + task.TaskInstanceID} className = "EmptyCell"> </td>);
        }
      }, this);

      if(count == workflow.length)
      {
        count = 0;
        return (<tr key={"Row for " + workflow[0].TaskInstanceID} className = "DisplayNone"> {cols}</tr>);
      }
      /*there was width 50% for this if */
      if(this.state.SelectedWorkflow == "")
      {
        count = 0;
        return (<tr key={"Row for " + workflow[0].TaskInstanceID} className = "EmptyCell"> {cols}</tr>);
      }
      else if(workflow[index].WorkflowInstanceID == this.state.SelectedWorkflow)
      {
        count = 0;
        WorkflowIDDisplayed[index] = workflow[index].WorkflowInstanceID;
        return (<tr key={"Row for " + workflow[0].TaskInstanceID} className = "EmptyCell"> {cols}</tr>);
      }
    },this);

    let WorkflowIDTable = this.state.Workflows.map(function(WorkflowTable,index){
      let WorkflowIDCol = WorkflowTable.map(function(WorkflowID,index){
        if(index == 0)
        {
          return (<td key = {"Col for WorkflowTable"} className = "EmptyCell"> <br/> <h1> {WorkflowID.WorkflowInstanceID} </h1> <br/> <br/> </td>)
        }
        return
      }, this);

      if(WorkflowIDDisplayed[index] == WorkflowTable[index].WorkflowInstanceID)
      {
        return(<tr  key = {"Row for " + index}> {WorkflowIDCol} </tr>)
      }
      else if(this.state.SelectedWorkflow == "" && this.state.SelectedTask == "" && this.state.SelectedStatus == "" && this.state.SelectedStudent == "")
      {
        return(<tr  key = {"Row for " + index}> {WorkflowIDCol} </tr>)
      }
      return
    }, this);

    let TaskActivityTypeTable = this.state.Workflows[0].map(function(type)
    {
      return (<td key = {type.TaskActivity.Type} style = {background}> {type.TaskActivity.Type} </td>)
    }, this);

    let Students = [];
    this.state.Workflows.forEach(function(StudentNamesList)
    {
       StudentNamesList.forEach(function(StudentNames)
       {
         if(Students.indexOf(StudentNames.User.UserName) == -1)
         {
          Students.push(StudentNames.User.UserName);
         }
       }, this);
    }, this);

    var OptionsListStudents = [];
    OptionsListStudents.push({value: "",label: "All"});
    Students.forEach(function(Options)
    {
      OptionsListStudents.push({value: Options,label: Options})
    }, this);

    let Status = [];
    this.state.Workflows.forEach(function(StatusNamesList)
    {
       StatusNamesList.forEach(function(StatusNames)
       {
         if(Status.indexOf(StatusNames.Status) == -1)
         {
          Status.push(StatusNames.Status);
         }
       }, this);
    }, this);

    var OptionsListStatus = [];
    OptionsListStatus.push({value: "",label: "All"});

    Status.forEach(function(Options)
    {
      OptionsListStatus.push({value: Options,label: Options})
    }, this);


    let Task = [];
    this.state.Workflows.forEach(function(TaskNamesList)
    {
       TaskNamesList.forEach(function(TaskNames)
       {
         if(Task.indexOf(TaskNames.TaskActivity.Type) == -1)
         {
          Task.push(TaskNames.TaskActivity.Type);
         }
       }, this);
    }, this);

    var OptionsListTask = [];
    OptionsListTask.push({value: "",label: "All"})

    Task.forEach(function(Options)
    {
      OptionsListTask.push({value: Options,label: Options})
    }, this);

    var OptionsListWorkflow = [];
    OptionsListWorkflow.push({value: "",label: "All"});

    this.state.WorkflowArray.forEach(function(Options)
    {
      OptionsListWorkflow.push({value: Options,label: Options})
    }, this);

    var OptionsListSubWorkflow = [];
    OptionsListSubWorkflow.push({value: "",label: "All"});

    // NEED to add more to the Subworkflow
    return (
      <div>
      <h6> <b> Course: </b> {"  "+this.state.Info.Course.Name} </h6>
      <h6> <b> Section: </b> {this.state.Info.SectionID.SectionID} </h6>
      <h6> <b> Semester: </b> {this.state.Info.Assignment.SemesterID} </h6>
      <br/>
      <br/>
      <h1> <b> Legend </b> </h1>
      <br/>
      <table className = "TableWidth">
        <tbody>
          <tr>
            <td style = {colorwhite}> Incomplete (I) </td>
            <td style = {colorgreen}> Complete (C) </td>
            <td style = {colorred}> Late (L) </td>
            <td style = {coloryellow}> Not Needed (X) </td>
            <td style = {colorgrey} > Not_yet_started (!) </td>
          </tr>
        </tbody>
      </table>
      <br/>

      <div className="section">
        <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}> <b> {this.state.Info.Assignment.DisplayName} </b> </h2>
        <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
          <h6> <b> Filter by: </b> </h6>
          <br/>

          <table className = "TableFilterStyle">
            <tbody>
              <tr className = "TableFilterStyle">
                <td className = 'TableFilterStyle'>
                  <div>
                    <h6> <b> Student: </b> </h6>
                    <Select
                      options={OptionsListStudents}
                      value={this.state.SelectedStudent}
                      onChange={this.studentDropdownChange.bind(this)}
                      clearable={false}
                    />
                  </div>
                </td>
                <td className = "TableFilterStyle">
                  <div>
                    <h6> <b> Status: </b> </h6>
                    <Select
                      options={OptionsListStatus}
                      value={this.state.SelectedStatus}
                      onChange={this.StatusDropdownChange.bind(this)}
                      clearable={false}
                    />
                  </div>
                </td>
                <td className = "TableFilterStyle">
                  <div>
                    <h6> <b> Task: </b> </h6>
                    <Select
                      options={OptionsListTask}
                      value={this.state.SelectedTask}
                      onChange={this.TaskDropdownChange.bind(this)}
                      clearable={false}
                    />
                  </div>
                </td>
                <td className = "TableFilterStyle">
                  <div>
                    <h6> <b> Workflows: </b> </h6>
                    <Select
                      options={OptionsListWorkflow}
                      value={this.state.SelectedWorkflow}
                      onChange={this.WorkflowDropdownChange.bind(this)}
                      clearable={false}
                    />
                  </div>
                </td>
                <td className = "TableFilterStyle">
                  <div>
                    <h6> <b> Subworkflow: </b> </h6>
                    <Select
                      options={OptionsListSubWorkflow}
                      value={this.state.SelectedSubWorkflow}
                      onChange={this.SubWorkflowDropdownChange.bind(this)}
                      clearable={false}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="section-content">
            <div style={{overflowX: 'scroll'}}>
              <div className = "WholeTableStyleLeft">
                <table>
                  <tbody>
                    <tr>
                      <td className = "EmptyCell"> <h6> WorkflowID </h6> </td>
                    </tr>
                    {WorkflowIDTable}
                  </tbody>
                </table>
              </div>
              <div className = "WholeTableStyleRight">
                <table>
                  <tbody>
                    <tr>
                      {TaskActivityTypeTable}
                    </tr>
                    {table}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
// TaskStatus by Krzysztof Andres.
export default Frames;
