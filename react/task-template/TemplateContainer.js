/*
This Container is the main component.It holds all the other components and decides what to render depending.

*/
import React from 'react';
import request from 'request';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

//Input Components: These can be interactive with the user;
import SuperComponent from './superComponent';
/* DEAD ONES
import CreateProblemComponent from './createProblemComponent';
import EditProblemComponent from './editProblemComponent';
import SolveProblemComponent from './solveProblemComponent';
import GradeSolutionComponent from './gradeSolutionComponent';
import ResolveGradeComponent from './resolveGradeComponent';
import DisputeComponent from './disputeComponent';
*/

//Display Components: These only display data retrived from the database. Not interactive.

import SuperViewComponent from './superViewComponent';
import HeaderComponent from './headerComponent'
import ResponseComponent from './responseComponent';
import GradedComponent from './gradedComponent';
import DisputeViewComponent from './disputeViewComponent';
import ErrorComponent from './errorComponent';
import CommentComponent from './commentComponent';
import ResolutionViewComponent from './resolutionViewComponent';
import WorkflowTable from '../assignment-records/workflowTable';

//These will determine what elements are on the page, giving the current state of the Task and
// deciding what to dsiplay.
const createProblemContainer = document.getElementById('create-task-container');
const editProblemContainer = document.getElementById('edit-task-container');
const solveProblemContainer = document.getElementById('solve-task-container');
const gradeContainer = document.getElementById('grade-task-container');
const gradedContainer = document.getElementById('graded-container');
const disputeContainer = document.getElementById('dispute-task-container');
const resolveGradeContainer = document.getElementById('resolve-task-container');
const completedContainer = document.getElementById('completed-task-container');

/* Make all the methods that will call the api to get the appropriate data  here */

class TemplateContainer extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              //universal variables - used in all the components
              //Need to pass in TaskID,SectionID, UserID from HTML, route-handler, and main.js
              TaskActivityID: null,
              Loaded: false,
              CourseID: null,
              CourseName: '',
              CourseNumber: '',
              AssignmentTitle: '',
              AssignmentID: null,
              AssignmentDescription: '',
              TaskActivityType: '',
              TaskStatus: '',
              SemesterID: null,
              SemesterName: '',
              TaskActivityName:'',
              Data:null,
              Error: false
          }
      }

      getHeaderData() {

        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskInstanceTemplate/main/' + this.props.TaskID,
            qs: {
              courseID: this.props.CourseID,
              userID: this.props.UserID,
              sectionID:this.props.SectionID
            },
            json: true
        };

        request(options, (err, res, body) => {
          console.log(err,res);

          if(res.statusCode == 400){
              this.setState({Error: true});
              return;
          }


          this.setState({
            //set create's task data to pass down
            Loaded:true,
            TaskActivityID: body.taskActivityID,
            CourseName: body.courseName,
            CourseNumber: body.courseNumber,
            AssignmentTitle: body.assignmentTitle,
            AssignmentID: body.assignmentID,
            AssignmentDescription: body.assignmentDescription,
            TaskActivityType: body.taskActivityType,
            SemesterID: body.semesterID,
            SemesterName: body.semesterName,
            TaskActivityVisualID: body.taskActivityVisualID


          });
        });

      }


      getTasks(){
        const options = {
                  method: 'GET',
                  uri: this.props.apiUrl + '/api/superCall/'+ this.props.TaskID,
                  json: true
              };

        request(options, (err, res, bod) => {

          if(res.statusCode != 200){
            this.setState({
              Error: true
            });
            return;
          }
          else{
            let currentTaskStatus = bod.superTask[0].Status;
            let taskList = bod.superTask;
            this.setState({
              Data: taskList,
              TaskStatus: currentTaskStatus
            });
          }
        });
      }

      componentWillMount() { //get the database data before component renders
        this.getHeaderData();
        this.getTasks();

      }

      render(){
        console.log(this.state.Data);
        let renderComponents = null;
        let gradeViews = null;
        let numberOfGradingTasks = 0;

        if(this.state.Error){
          return(<ErrorComponent />)
        }
        if(!this.state.Loaded){
          return(
            <div></div>
          );
        }

        if(this.state.Data != null){
          let gradesViewIndex = null;
          renderComponents = this.state.Data.map(function(task,idx){ //this task -> previous... -> first task
              let compString = null;

              switch(task.TaskActivity.Type){
                case TASK_TYPES.CREATE_PROBLEM:
                  compString = "Create the Problem";
                  break;
              case TASK_TYPES.EDIT:
                  compString = "Edit the Problem";
                  break;
              case TASK_TYPES.SOLVE_PROBLEM:
                  compString = "Solve the Problem";
                  break;
              case TASK_TYPES.GRADE_PROBLEM:
                  compString = "Grade the Solution";
                  break;
              case TASK_TYPES.CONSOLIDATION:
                  compString = "Consolidate the Grades";
                  break;
              case TASK_TYPES.DISPUTE:
                  compString = "Dispute Your Grade";
                  break;
              case TASK_TYPES.RESOLVE_DISPUTE:
                  compString = "Resolve the Dispute";
                  break;
              default:
                  compString = "";
                  break;
              }



              if(idx == this.state.Data.length - 1){
                return (<SuperComponent    TaskID = {this.props.TaskID}
                                            UserID = {this.props.UserID}
                                            ComponentTitle={compString}
                                            TaskData = {task.Data}
                                            TaskStatus = {task.Status}
                                            TaskActivityFields = {task.TaskActivity.Fields}
                                            Instructions = {task.TaskActivity.Instructions}
                                            Rubric= {task.TaskActivity.Rubric}
                                            apiUrl={this.props.apiUrl}
                                        />);
              }
              else if(task.TaskActivity.Type == TASK_TYPES.GRADE_PROBLEM){
                numberOfGradingTasks = task.TaskActivity.NumberParticipants;
                gradeViews.push(data);
                return null;
              }
              else{
                return (<SuperViewComponent
                                    ComponentTitle={compString}
                                    TaskData={task.Data}
                                    TaskActivityFields={task.TaskActivity.Fields}/>)
              }



          }, this);

          for(let i = 0; i < this.state.Data.length; i++){
            if(this.state.Data[i].TaskActivity.Type == TASK_TYPES.NEED_CONSOLIDATION){
              gradesViewIndex = i;
            }
            else{
              continue;
            }
          }

        if(gradeViews != null){
          let gradedComponentView = (
            <GradedComponent      TaskID = {this.props.TaskID}
                                  UsersTaskData = {gradeViews}
                                  TaskActivityFields = {gradeViews[0].TaskActivity.Fields}
                                  TaskStatus = {this.state.Task}
                                  />
            );
          }

          if(gradesViewIndex != null){
            renderComponents.splice(gradesViewIndex, gradeViews.length, gradedComponentView);
          }
        }

        return(
          <div className="super-container">
            <Tabs
              onSelect={this.handleSelect}
              selectedIndex={0}
            >
              <TabList className="big-text">
                <Tab>Task</Tab>
                <Tab>Comments</Tab>
              </TabList>
              <TabPanel>
                <HeaderComponent TaskID = {this.props.TaskID}
                                 CourseName = {this.state.CourseName}
                                 CourseName = {this.state.CourseName}
                                  CourseNumber = {this.state.CourseNumber}
                                  AssignmentTitle = {this.state.AssignmentTitle}
                                  AssignmentDescription = {this.state.AssignmentDescription}
                                  TaskActivityType = {this.state.TaskActivityType}
                                  SemesterName={this.state.SemesterName}
                                  TaskActivityVisualID= {this.state.TaskActivityVisualID} />
                    {renderComponents}
              </TabPanel>
              <TabPanel>
                <div className="placeholder"></div>
                <CommentComponent />
                <CommentComponent />
                <CommentComponent />
              </TabPanel>



            </Tabs>

          </div>



        );

      }


}
/*render the components with the appropriate props*/

export default TemplateContainer;
