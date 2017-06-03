/*  This is the main Container for the Assign to section page. It displays the appropriate Components
* depending on the data it fetches from the database. This Container also contains the onChange function
* that are passed down to its Components, so any changes made to those functions should be in here.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Tasks from './components/Tasks.js';
import apiCall from '../shared/apiCall';
import Assignment from './components/Assignment.js';
import WorkFlow from './components/WorkFlow.js';
import Strings from './strings';

var moment = require('moment');
//import ModalInfo from '../assignment-records/info-modal';
import { TASK_TYPES , TASK_TYPES_TEXT } from '../../server/utils/react_constants';

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
                StartNow:true,
                StartLater:false,
                Section:[],
                Semester: null,
                Time:moment().format('YYYY-MM-DD HH:mm:ss'),
                AssigmentName:''
            },
            Sections: [],
            DataLoaded: false,
            InfoMessage: '',
            InfoMessageType:'',
            Strings: Strings
        };
    }

    componentWillMount(){ //gets the appropraite assignment structure from the database before rendering the page
        let semestersArray = null;

        this.props.__(Strings, newStrings => {
            this.setState({
                Strings: newStrings
            });
        });

        const getAssignQueryStrings = {
                courseid: this.props.CourseID,
                assignmentid: this.props.AssignmentID
            };

        apiCall.get('/getAssignToSection',getAssignQueryStrings, (err, res, body) => {
            apiCall.get('/semester', (err2, res2, bod2) => {
                console.log(body);
                console.log(bod2);
                let workflows = Object.keys(body.taskActivityCollection).map(function(key){
                    let taskDaysPast = 0;
                    let tasks = body.taskActivityCollection[key].map(function(task){
                        let dueTypeArray = JSON.parse(task.defaults);
                        console.log('duettype for ', task.taskActivityID, dueTypeArray)
                        if(dueTypeArray[0] === 'specific time'){
                          if(!isNaN(dueTypeArray[1])){
                            taskDaysPast += dueTypeArray[1];
                            dueTypeArray = ['specific time', moment().add(Math.floor((taskDaysPast + dueTypeArray[1])/1440), 'days').format('YYYY-MM-DD')+(' 23:59')];
                          }


                        }
                        else{
                          taskDaysPast += dueTypeArray[1];
                        }

                        return {
                            ID: task.taskActivityID,
                            Type:task.type,
                            Name: task.name,
                            StartNow:dueTypeArray[0] === 'duration',
                            StartLater:dueTypeArray[0] === 'specific time',
                            Time:dueTypeArray[1],
                            TimeArray: dueTypeArray
                        };
                    }, this);

                    return {
                        id: key,
                        StartNow:true,
                        StartLater:false,
                        Time:moment().format('YYYY-MM-DD HH:mm:ss'),
                        Tasks: tasks
                    };

                }, this);


                semestersArray = bod2.Semesters.map(function(sem){
                    return ( {value: sem.SemesterID, label: sem.Name} );
                });

                let newA= this.state.Assignment;
                newA.AssigmentName = body.assignment.DisplayName;
                this.setState({
                    Assignment: newA,
                    Semesters:semestersArray,
                    WorkFlow:workflows,
                    DataLoaded: true
                });
            });

        });
    }

    fetchSectionsForSemester()  {
        const options = {
                userID: this.props.UserID,
                semesterID: this.state.Assignment.Semester
            };

        apiCall.get(`/getCourseSections/${this.props.CourseID}`, options, (err, res, body) => {
            let sectionsList = body.Sections.map((section) => {
                return {value: section.SectionID, label: section.Name};
            });

            this.setState({
                Sections: sectionsList
            });
        });
    }

    onSubmit(){
    //saves the state data to the database
      if(this.state.Assignment.Section.length === 0){
        showMessage(this.state.Strings.NoSectionsSelected);
        this.setState({
          InfoMessage: this.state.Strings.NoSectionsSelected,
          InfoMessageType: 'error'
        });
        return;
      }

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


        const options = newData;

        console.log(options);
        apiCall.post('/getAssignToSection/submit/', options, (err, res, body) => {
            if(res.statusCode === 200){
                console.log(this.state.Strings.SubmitSuccess);
                showMessage(this.state.Strings.SubmitSuccess);
                this.setState({
                    InfoMessage: this.state.Strings.SubmitSuccess,
                    InfoMessageType: 'success'
                });
            }
            else{
                console.log(this.state.Strings.SubmitError);
                showMessage(this.state.Strings.SubmitError);
                this.setState({
                    InfoMessage: this.state.Strings.SubmitError,
                    InfoMessageType: 'success'
                });
            }
        });
        return;
    }

//////////////// Functions used in the Assignment Component ////////////////////
    onChangeCalendarAssignment(dateString) //dateString is supplied by Datetime module
  {

        let newA = this.state.Assignment;
        newA.Time = dateString.format('YYYY-MM-DD HH:mm:ss');
        this.setState({Assignment: newA});
    }

    onChangeStartLaterAssignment()
  {
        let newA = this.state.Assignment;
        newA.StartNow = false;
        newA.StartLater = true;
        newA.Time = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss');
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
        newA.Semester = val.value;
        this.setState({Assignment: newA});
        this.fetchSectionsForSemester();
    }

    onChangeSectionAssignment(sectionID) //Section is automatically passed in by CheckBoxList module
  {
        let newA = this.state.Assignment;
        if(newA.Section.indexOf(sectionID) == -1){ //not already in the list of sectionID's
            newA.Section.push(sectionID);
        }
        else{
            newA.Section.splice(newA.Section.indexOf(sectionID), 1);
        }

        this.setState({Assignment: newA});
    }

//----------------------------------------------------------------------------

/////////////// Functions used in Tasks Component /////////////////////////////
    onChangeCalendarTasks(index, workflowIndex, dateString) //index is task's index in the tasks array, workflowIndex is index in WorkFlow array
    // dateString automatically passed in by Datetime module
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].Tasks[index].Time = dateString.format('YYYY-MM-DD HH:mm:ss');
        newA[workflowIndex].Tasks[index].TimeArray = ['specific time',newA[workflowIndex].Tasks[index].Time];

        this.setState({WorkFlow: newA});
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
        this.setState({WorkFlow: newA});
    }

    onChangeExpireNumberOfDaysTasks(index, workflowIndex)
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].Tasks[index].StartNow= true;
        newA[workflowIndex].Tasks[index].StartLater=false;
        newA[workflowIndex].Tasks[index].Time = 3 * 1440;
        newA[workflowIndex].Tasks[index].TimeArray = ['duration',newA[workflowIndex].Tasks[index].Time];
        this.setState({WorkFlow: newA});
    }

    onChangeCertainTimeTasks(index, workflowIndex)
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].Tasks[index].Time = this.getAddedTime(index, workflowIndex);
        newA[workflowIndex].Tasks[index].TimeArray = ['specific time',newA[workflowIndex].Tasks[index].Time];
        newA[workflowIndex].Tasks[index].StartNow= false;
        newA[workflowIndex].Tasks[index].StartLater=true;

        this.setState({WorkFlow: newA});
    }


    getAddedTime(index, workflowIndex){
      let count = 3*1440;
      for(let i = index-1; i >= 0 ; i--){
        if(this.state.WorkFlow[workflowIndex].Tasks[i].TimeArray[0] === 'specific time'){
          return moment(this.state.WorkFlow[workflowIndex].Tasks[i].TimeArray[1], 'YYYY-MM-DD HH:mm:ss').add(Math.floor(count/1440), 'days').format('YYYY-MM-DD HH:mm:ss');
        } else {
          count += this.state.WorkFlow[workflowIndex].Tasks[i].TimeArray[1];
        }
      }

      return moment(this.state.WorkFlow[workflowIndex].Time, 'YYYY-MM-DD HH:mm:ss').add(Math.floor(count/1440), 'days').format('YYYY-MM-DD HH:mm:ss');
    }
//-----------------------------------------------------------------------------

/////////// Functions used in WorkFlow Component ///////////////////////////////
    onChangeCalendarWorkFlow( workflowIndex,dateString) //workflowIndex is index in WorkFlow array, usually passed in as workflowIndex index prop
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].Time = dateString.format('YYYY-MM-DD HH:mm:ss');
        this.setState({WorkFlow: newA});
    }

    onChangeStartLaterWorkFlow(workflowIndex)
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].StartNow = false;
        newA[workflowIndex].StartLater = true;
        newA[workflowIndex].Time = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss');
        this.setState({WorkFlow: newA});
    }

    onChangeStartNowWorkFlow(workflowIndex)
  {
        let newA = this.state.WorkFlow;
        newA[workflowIndex].StartNow = true;
        newA[workflowIndex].StartLater = false;
        newA[workflowIndex].Time = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState({WorkFlow: newA});
    }

  //--------------------------------------------------------------------------

    render()
  {
        let strings = this.state.Strings;
        let infoMessage = null;
        let buttonView = this.state.SubmitSuccess ? null : (<button type="button" style={{marginBottom: '50px'}} onClick={this.onSubmit.bind(this)}>{strings.Submit}</button>);
        if(!this.state.DataLoaded){
            return (<div></div>);
        }

        if(this.state.InfoMessage !== ''){
            infoMessage = (<span onClick={() => {
                this.setState({InfoMessage: ''});
            }} className="small-info-message">
            <span className={`${this.state.InfoMessageType}-message`}>
              {this.state.InfoMessage}
            </span>
            </span>);
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
            onChangeCertainTimeTasks = {this.onChangeCertainTimeTasks.bind(this)}
            Strings={strings}
          />
                );

            },this);

            return (
        <div>
            <WorkFlow WorkFlow = {workflow} workflowIndex ={workindex}
            onChangeCalendarWorkFlow = {this.onChangeCalendarWorkFlow.bind(this)}
            onChangeStartLaterWorkFlow = {this.onChangeStartLaterWorkFlow.bind(this)}
            onChangeStartNowWorkFlow = {this.onChangeStartNowWorkFlow.bind(this)}
            Strings={strings}

          />

          {tasks}
        </div>);
        }, this);

        return (
      <div>

        <Assignment Assignment={this.state.Assignment}
          SectionsList={this.state.Sections}
          Semesters={this.state.Semesters}
          onChangeCalendarAssignment ={this.onChangeCalendarAssignment.bind(this)}
          onChangeStartLaterAssignment={this.onChangeStartLaterAssignment.bind(this)}
          onChangeStartNowAssignment = {this.onChangeStartNowAssignment.bind(this)}
          onChangeAssigmentName = {this.onChangeAssigmentName.bind(this)}
          onChangeSectionAssignment = {this.onChangeSectionAssignment.bind(this)}
          onChangeSemesterAssignment = {this.onChangeSemesterAssignment.bind(this)}
          Strings={strings}

        />


        {workflowView}
        {infoMessage}

        <div className="align-right">
          {buttonView}
        </div>
      </div>

        );
    }
}
//Assign to Section by Krzysztof Andres.
export default AssignToSectionContainer;
