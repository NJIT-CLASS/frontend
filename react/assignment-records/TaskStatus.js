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
        };
    }

    componentWillMount(){
        const options = {
            method: 'GET',
            uri: this.props.apiUrl +'/api/getAssignmentRecord/' + this.props.AssignmentID,
            json: true
        };

        var colors = {'In Progress':'#ffffff',
            'Complete':'#80ff80',
            'Late':'#ff1a1a',
            'Not Needed':'#ffff66',
            'Inactive:':'#d9d9d9'};

        request(options, (err, res, body) => {
            console.log(err, res, body);
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
        });
    }

    StatusDropdownChange(val){
        this.setState({
            SelectedStatus : val
        });
    }

    TaskDropdownChange(val){
        this.setState({
            SelectedTask : val
        });
    }

    WorkflowDropdownChange(val){
        this.setState({
            SelectedWorkflow : val
        });
    }

    SubWorkflowDropdownChange(val){
        this.setState({
            SelectedSubWorkflow : val
        });
    }

    render(){
        if(!this.state.DataLoaded){
            return (<div></div>);
        }
        var strings = {
            all: 'All',
            Incomplete: 'Incomplete',
            Complete: 'Complete',
            Late: 'Late',
            Not_Needed: 'Not Needed',
            Not_yet_started: 'Not Yet Started',
            Started : 'Started',
            Automatic : 'Automatic',
            Student: 'Student',
            FilterBy: 'Filter By',
            Legend: 'Legend',
            Course: 'Course',
            Section: 'Section',
            Semester: 'Semester',
            Status: 'Status',
            Task: 'Task',
            Workflows: 'Workflows',
            Subworkflow: 'Subworkflow',
            WorkflowID: 'WorkflowID'
        };


        var colors = {'Incomplete':'incomplete',
            'complete':'complete',
            'Late':'late',
            'Not Needed':'not-needed',
            'not_yet_started':'not-yet-started',
            'started' : 'started',
            'automatic' : 'automatic'
        };
        var background = {'backgroundColor': '#F3F3F4', 'borderColor':'#bfbfbf'};

        var letters =  {
            'Incomplete' : '(I)',
            'complete' : '(C)',
            'Late' : '(!)',
            'Not Needed' : '(X)',
            'not_yet_started' : '(NS)',
            'started' : '(S)',
            'automatic' : '(A)'
        };
        var style1 = {'tableLayout':'fixed'};

        var Table = Reactable.Table,
            Tr = Reactable.Tr,
            Td = Reactable.Td;
        var count = 0;
        var WorkflowIDDisplayed = [];
        var NumberofWorkflow = 0;
        var IndexforWorkflow = 0;

        let table = this.state.Workflows.map(function(workflow,index){
            if(index == 0)
      {
                WorkflowIDDisplayed = [];
            }
            if(this.state.SelectedWorkflow.label == strings.all)
      {
                this.state.SelectedWorkflow = '';
            }
            count = 0;

            let cols = workflow.map(function(task){
                var link = '/task/'+task.TaskInstanceID+'?'+'courseId='+this.state.Info.Assignment.CourseID+'&sectionID='+this.state.Info.SectionID.SectionID;
                if(this.state.SelectedTask.label == strings.all)
        {
                    this.state.SelectedTask = '';
                }

                if(this.state.SelectedStudent.label == strings.all)
        {
                    this.state.SelectedStudent = '';
                }

                if(this.state.SelectedStatus.label == strings.all)
        {
                    this.state.SelectedStatus = '';
                }

        /* When nothing is Selected show the table*/
                if((this.state.SelectedStudent == '') && (this.state.SelectedStatus == '') && (this.state.SelectedTask == '') )
        {
                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={link}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            <h6> User ID: {task.User.UserID}
              <br key = {'break two for ' + task.TaskInstanceID} />
              Task ID: {task.TaskInstanceID}
            </h6>
          </a>
          {letters[task.Status]}
          </td>);
                }

        /* filtering by student,status, and task. */
                else if((task.User.UserName == this.state.SelectedStudent.label) && (task.Status == this.state.SelectedStatus.label) && (task.TaskActivity.Type == this.state.SelectedTask.label))
        {
                    if(WorkflowIDDisplayed[0] == null)
          {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
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

                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={'/task/'+task.TaskInstanceID+'?'+'courseId='+this.state.Info.Assignment.CourseId+'&sectionID='+this.state.Info.SectionID}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {'break two for ' + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {'break three for ' + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
                }

        /* filtering by student and status. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) && (task.Status == this.state.SelectedStatus.label))
        {
                    if(((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != ''))
          {
                        count++;
                        return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                    }

                    if(WorkflowIDDisplayed[0] == null)
          {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
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

                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={link}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {'break two for ' + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {'break three for ' + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
                }

        /* filtering by task and status */
                else if ((task.TaskActivity.Type == this.state.SelectedTask.label) && (task.Status == this.state.SelectedStatus.label))
        {
                    if(((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != ''))
          {
                        count++;
                        return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                    }

                    if(WorkflowIDDisplayed[0] == null)
          {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
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

                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={link}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {'break two for ' + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {'break three for ' + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
                }

        /* filtering by student and task. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) && (task.TaskActivity.Type == this.state.SelectedTask.label))
        {
                    if(((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != ''))
          {
                        count++;
                        return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                    }

                    if(WorkflowIDDisplayed[0] == null)
          {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
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

                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={link}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {'break two for ' + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {'break three for ' + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
                }

        /* filtering by one of student,status, or task. */
                else if((task.User.UserName == this.state.SelectedStudent.label) || (task.Status == this.state.SelectedStatus.label) || (task.TaskActivity.Type == this.state.SelectedTask.label))
        {
                    if(((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != ''))
          {
                        count++;
                        return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                    }
                    else if(((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) || ((this.state.SelectedStudent != '') && (this.state.SelectedTask != '')) || ((this.state.SelectedStatus != '') && (this.state.SelectedTask != '')))
          {
                        count++;
                        return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                    }

                    if(WorkflowIDDisplayed[0] == null)
          {
                        WorkflowIDDisplayed[0] = task.WorkflowInstanceID;
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

                    return (<td key={'Col for ' + task.TaskInstanceID} className={`ColLineColor ${colors[task.Status]}`}>
          <a key = {'link for ' + task.TaskInstanceID} href={'/task/'+'/'+task.TaskInstanceID+'?'+'courseId='+this.state.Info.Assignment.CourseId+'&sectionID='+this.state.Info.SectionID.SectionID}>
            {task.User.UserName}
            <br key = {'break one for ' + task.TaskInstanceID} />
            {task.User.UserID}
            <br key = {'break two for ' + task.TaskInstanceID} />
            {task.TaskInstanceID}
          </a>
          <br key = {'break three for ' + task.TaskInstanceID} />
          {letters[task.Status]}
        </td>);
                }
                else
        {
                    count ++;
                    return (<td key={'Col for ' + task.TaskInstanceID} className = "EmptyCell"> </td>);
                }
            }, this);

            if(count == workflow.length)
      {
                IndexforWorkflow++;
                count = 0;
                return (<tr key={'Row for ' + workflow[0].TaskInstanceID} className = "DisplayNone"> {cols}</tr>);
            }
            else if(this.state.SelectedWorkflow == '' || this.state.SelectedWorkflow.label == strings.all)
      {
                IndexforWorkflow = 0;
                count = 0;
                return (<tr key={'Row for ' + workflow[0].TaskInstanceID} className = "EmptyCell"> {cols}</tr>);
            }
            else if(workflow[0].WorkflowInstanceID == this.state.SelectedWorkflow.label)
      {
                count = 0;
                WorkflowIDDisplayed[0] = workflow[0].WorkflowInstanceID;
                return (<tr key={'Row for ' + workflow[0].TaskInstanceID} className = "EmptyCell"> {cols}</tr>);
            }
            IndexforWorkflow++;
        },this);

        if(this.state.SelectedWorkflow != '')
    {
            WorkflowIDDisplayed = [];
            WorkflowIDDisplayed[0] = this.state.SelectedWorkflow.label;
            if(IndexforWorkflow == this.state.Workflows.length)
      {
                WorkflowIDDisplayed = [];
            }
        }

        let WorkflowIDTable = this.state.Workflows.map(function(WorkflowTable,index){
            let WorkflowIDCol = WorkflowTable.map(function(WorkflowID,index){
                if(index == 0)
        {
                    return (<td key = {'Col for WorkflowTable'} className = "EmptyCell"> <br/> <h1> {WorkflowID.WorkflowInstanceID} </h1> <br/> <br/> </td>);
                }
                return;
            }, this);

            if(WorkflowIDDisplayed[0] == strings.all)
      {
                return(<tr  key = {'Row for ' + index}> {WorkflowIDCol} </tr>);
            }
            if((this.state.SelectedWorkflow == '' || this.state.SelectedTask == strings.all) && this.state.SelectedTask == '' && this.state.SelectedStatus == '' && this.state.SelectedStudent == '')
      {
                return(<tr  key = {'Row for ' + index}> {WorkflowIDCol} </tr>);
            }
            else if(WorkflowIDDisplayed[index] == WorkflowTable[0].WorkflowInstanceID)
      {
                return(<tr  key = {'Row for ' + index}> {WorkflowIDCol} </tr>);
            }
            else if(this.state.SelectedWorkflow != '')
      {
                if(WorkflowIDDisplayed[0] == WorkflowTable[0].WorkflowInstanceID)
        {
                    return(<tr  key = {'Row for ' + index}> {WorkflowIDCol} </tr>);
                }
            }
            return;
        }, this);

        let TaskActivityTypeTable = this.state.Workflows[0].map(function(type)
    {
            return (<td key = {type.TaskActivity.Type} style = {background}> {type.TaskActivity.Type} </td>);
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
        OptionsListStudents.push({value: '',label: strings.all});
        Students.forEach(function(Options)
    {
            OptionsListStudents.push({value: Options,label: Options});
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
        OptionsListStatus.push({value: '',label: strings.all});

        Status.forEach(function(Options)
    {
            OptionsListStatus.push({value: Options,label: Options});
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
        OptionsListTask.push({value: '',label: strings.all});

        Task.forEach(function(Options)
    {
            OptionsListTask.push({value: Options,label: Options});
        }, this);

        var OptionsListWorkflow = [];
        OptionsListWorkflow.push({value: '',label: strings.all});

        this.state.WorkflowArray.forEach(function(Options)
    {
            OptionsListWorkflow.push({value: Options,label: Options});
        }, this);

        var OptionsListSubWorkflow = [];
        OptionsListSubWorkflow.push({value: '',label: strings.all});

    // NEED to add more to the Subworkflow
        return (
      <div>
      <h6> <b> {strings.Course}: </b> {'  '+this.state.Info.Course.Name} </h6>
      <h6> <b> {strings.Section}: </b> {this.state.Info.SectionID.SectionID} </h6>
      <h6> <b> {strings.Semester}: </b> {this.state.Info.Assignment.SemesterID} </h6>
      <br/>
      <br/>
      <h1> <b> {strings.Legend} </b> </h1>
      <br/>
      <table>
        <tbody>
          <tr>
            <td className = {`TableWidth ${colors['complete']}`}> {strings.Complete} (C) </td>
            <td className = {`TableWidth ${colors['started']}`}> {strings.Started} (S) </td>
            <td className = {`TableWidth ${colors['Late']}`}> {strings.Late} (!) </td>
            <td className = {`TableWidth ${colors['not_yet_started']}`} > {strings.Not_yet_started} (NS) </td>
            <td className = {`TableWidth ${colors['Not Needed']}`}> {strings.Not_Needed} (X) </td>
            <td className = {`TableWidth ${colors['Incomplete']}`}> {strings.Incomplete} (I) </td>
            <td className = {`TableWidth ${colors['automatic']}`}> {strings.Automatic} (A) </td>
          </tr>
        </tbody>
      </table>
      <br/>

      <div className="section">
        <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}> <b> {this.state.Info.Assignment.DisplayName} </b> </h2>
        <div className={this.state.ShowContent ? 'section-content' : 'task-hiding'}>
          <h6> <b> {strings.FilterBy}: </b> </h6>
          <br/>

          <table className = "TableFilterStyle">
            <tbody>
              <tr className = "TableFilterStyle">
                <td className = 'TableFilterStyle'>
                  <div>
                    <h6> <b> {strings.Student}: </b> </h6>
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
                    <h6> <b> {strings.Status}: </b> </h6>
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
                    <h6> <b> {strings.Task}: </b> </h6>
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
                    <h6> <b> {strings.Workflows}: </b> </h6>
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
                    <h6> <b> {strings.Subworkflow}: </b> </h6>
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

          <div className="task-status-table">
            <div style={{overflowX: 'scroll'}}>
              <div className = "WholeTableStyleLeft">
                <table>
                  <tbody>
                    <tr>
                      <td className = "EmptyCell"> <h6> {strings.WorkflowID} </h6> </td>
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
