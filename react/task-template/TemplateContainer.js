/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import request from 'request';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants'; //contains constants and their values
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

//Input Components: These can be interactive with the user;
import SuperComponent from './superComponent';

//Display Components: These only display data retrived from the database. Not interactive.

import SuperViewComponent from './superViewComponent';
import HeaderComponent from './headerComponent';
import GradedComponent from './gradedComponent';
import ErrorComponent from './errorComponent';
import CommentComponent from './commentComponent';

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

/*      PROPS:
            - TaskID
            - SectionID
            - UserID
              (from main.js)
*/

class TemplateContainer extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              Loaded: false, //this variable is set to true when the page succesfully fetches data from the backend
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
        //this function makes an API call and saves the data into appropriate state variables

        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskInstanceTemplate/main/' + this.props.TaskID,
            qs: { //query strings
              courseID: this.props.CourseID,
              userID: this.props.UserID,
              sectionID:this.props.SectionID
            },
            json: true
        };

        request(options, (err, res, body) => {

          if(res.statusCode == 400){
              this.setState({Error: true});
              return;
          }
          this.setState({
            //set create's task data to pass down
            Loaded:true,
            CourseName: body.courseName,
            CourseNumber: body.courseNumber,
            AssignmentTitle: body.assignmentName,
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
        // this function makes an API call to get the current and previous tasks data and saves the data into appropriate state variables
        // for rendering
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
            

            let currentTaskStatus = bod.superTask[bod.superTask.length - 1].Status;
            let taskList = bod.superTask;
            this.setState({
              Data: taskList,
              TaskStatus: currentTaskStatus
            });
          }
        });
      }

      componentWillMount() { // this function is called before the component renders, so that the page renders with the appropriate state data
        this.getHeaderData();
        this.getTasks();

      }

      render(){
        let renderComponents = null;
        let gradeViews = null;
        let numberOfGradingTasks = 0;

        if(this.state.Error){ // if there was an error in the data fetching calls, show the Error Component
          return(<ErrorComponent />)
        }
        if(!this.state.Loaded){ // while the data hasn't been loaded, show nothing. This fixes a flickering issue in the animation.
          return(
            <div>
            <div className="placeholder"></div>
              <i style={{marginLeft: '45%'}} className="fa fa-cog fa-spin fa-3x fa-fw"></i>
              <span className="sr-only" >Loading...</span>
            </div>
          );
        }

        if(this.state.Data != null){
          let gradesViewIndex = null;
          renderComponents = this.state.Data.map(function(task,idx){
            // Goes over the array of tasks(starting from first task to this task)
            // and gives the Components an appropriate title.
            // Also finds grading tasks and puts them in a gradedComponent (although this wasn't tested properly)
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
                return (<SuperComponent
                                            TaskID = {this.props.TaskID}
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
                return (<SuperViewComponent key={idx+2000}
                                    index={idx}
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
          <div>
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
                                  SemesterName={this.state.SemesterName} />
                    {renderComponents}
              </TabPanel>
              <TabPanel>
                <div className="placeholder"></div>
                {/*  Future work to support comments*/}
                <CommentComponent Comment={{Author:'User1', Timestamp:'May 6, 2013 9:43am' ,Content: 'I really liked your problem. It was very intriguing.'}}/>
                <CommentComponent Comment={{Author:'User2', Timestamp:'May 6, 2013 11:09am' ,Content: 'I agree. I would have never thought of this.'}}/>
                <CommentComponent Comment={{Author:'Instructor', Timestamp:'May 6, 2013 3:32pm' ,Content: 'Your approach of the problem is very unique. Well done.'}}/>
              </TabPanel>



            </Tabs>

          </div>



        );

      }


}


export default TemplateContainer;
