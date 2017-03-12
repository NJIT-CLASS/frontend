/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import request from 'request';
import {TASK_TYPES, TASK_TYPE_TEXT} from '../../server/utils/constants'; //contains constants and their values
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
import MultiViewComponent from './multiViewComponent';
import ErrorComponent from './errorComponent';
import CommentComponent from './commentComponent';
import strings from './strings';
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
            TaskActivityName: '',
            Data: null,
            Error: false,
            TabSelected: 0,
            Strings: strings
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
                sectionID: this.props.SectionID
            },
            json: true
        };

        // this function makes an API call to get the current and previous tasks data and saves the data into appropriate state variables
        // for rendering
        const options2 = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/superCall/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {

            if (res.statusCode == 400) {
                this.setState({Error: true});
                return;
            }

            this.props.__(strings, (newStrings) =>{

            request(options2, (err, res, bod) => {

                if (res.statusCode != 200) {
                    this.setState({Error: true});
                    return;
                }

                let taskList = new Array();
                let skipIndeces = new Array();
                let currentTask = bod.superTask.pop();
                console.log(currentTask)
                let currentTaskStatus = currentTask.Status;



                bod.superTask.reverse().forEach(function(task, index) {
                    if (skipIndeces.indexOf(index) != -1 || task.TaskActivity.Type == TASK_TYPES.NEEDS_CONSOLIDATION) {
                        return;
                    }
                    if (task.TaskActivity.NumberParticipants > 1) {
                        let newArray = bod.superTask.filter(function(t, idx) {
                            if (t.TaskActivity.TaskActivityID === task.TaskActivity.TaskActivityID) {
                                skipIndeces.push(idx);
                                return true;
                            } else {
                                return false;
                            }
                        });
                        taskList.push(newArray);
                    }
                    else {
                        taskList.push(task);
                    }

                }, this);

                taskList.push(currentTask);
                console.log(taskList);

                  this.setState({
                      Loaded: true,
                      CourseName: body.courseName,
                      CourseNumber: body.courseNumber,
                      AssignmentTitle: body.assignmentName,
                      AssignmentID: body.assignmentID,
                      AssignmentDescription: body.assignmentDescription,
                      TaskActivityType: body.taskActivityType,
                      SemesterID: body.semesterID,
                      SemesterName: body.semesterName,
                      TaskActivityVisualID: body.taskActivityVisualID,
                      Data: taskList,
                      TaskStatus: currentTaskStatus,
                      Strings: newStrings
                  });
                });

            });
        });

    }

    componentWillMount() { // this function is called before the component renders, so that the page renders with the appropriate state data
      this.getHeaderData();

    }

    render() {
        let renderComponents = null;

        if (this.state.Error) { // if there was an error in the data fetching calls, show the Error Component
            return (<ErrorComponent/>)
        }
        if (!this.state.Loaded) { // while the data hasn't been loaded, show nothing. This fixes a flickering issue in the animation.
            return (
                <div>
                    <div className="placeholder"></div>
                    <i style={{
                        marginLeft: '45%'
                    }} className="fa fa-cog fa-spin fa-4x fa-fw"></i>
                  <span className="sr-only"></span>
                </div>
            );
        }


        renderComponents = this.state.Data.map(function(task, idx) {
            // Goes over the array of tasks(starting from first task to this task)
            // and gives the Components an appropriate title.
            // Also finds grading tasks and puts them in a gradedComponent (although this wasn't tested properly)

            let compString = null;



            if (Array.isArray(task)) {
              return (<MultiViewComponent UsersTaskData={task} TaskID={this.props.TaskID} UserID={this.props.UserID} Strings={this.state.Strings}/>);

            }
            else {
              switch (task.TaskActivity.Type) {
                  case TASK_TYPES.CREATE_PROBLEM:
                      compString = this.state.Strings.CreateProblemTitle;
                      break;
                  case TASK_TYPES.EDIT:
                      compString = this.state.Strings.EditProblemTitle;
                      break;
                  case TASK_TYPES.COMMENT:
                      compString = this.state.Strings.CommentTitle
                  case TASK_TYPES.SOLVE_PROBLEM:
                      compString = this.state.Strings.SolveProblemTitle;
                      break;
                  case TASK_TYPES.GRADE_PROBLEM:
                      compString = this.state.Strings.GradeProblemTitle;
                      break;
                  case TASK_TYPES.CRITIQUE:
                      compString = this.state.Strings.CritiqueTitle;
                  case TASK_TYPES.CONSOLIDATION:
                      compString = this.state.Strings.ConsolidateProblemTitle;
                      break;
                  case TASK_TYPES.DISPUTE:
                      compString = this.state.Strings.DisputeGradeTitle;
                      break;
                  case TASK_TYPES.RESOLVE_DISPUTE:
                      compString = this.state.Strings.ResolveDisputeTitle;
                      break;
                  default:
                      compString = "";
                      break;
              }

                if (idx == this.state.Data.length - 1) {
                    if (task.Status == 'Complete' || task.Status == 'complete') {
                        return (<SuperViewComponent key={idx + 2000} index={idx} ComponentTitle={compString} TaskData={task.Data} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} TaskActivityFields={task.TaskActivity.Fields} Strings={this.state.Strings}/>);
                    } else {
                        return (<SuperComponent key={idx + 2000} TaskID={this.props.TaskID} UserID={this.props.UserID} ComponentTitle={compString} Type={task.TaskActivity.Type} TaskData={task.Data} TaskStatus={task.Status} TaskActivityFields={task.TaskActivity.Fields} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} Strings={this.state.Strings} apiUrl={this.props.apiUrl} />);
                    }

                } else {
                    return (<SuperViewComponent key={idx + 2000} index={idx} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} ComponentTitle={compString} TaskData={task.Data} TaskActivityFields={task.TaskActivity.Fields} Strings={this.state.Strings}/>)
                }
            }
          }, this);

          return (
              <div>
                  <Tabs onSelect={(tab) => {
                      this.setState({TabSelected: tab});
                  }} selectedIndex={this.state.TabSelected}>
                      <TabList className="big-text">
                          <Tab>{this.state.Strings.Task}</Tab>
                          <Tab>{this.state.Strings.Comments}</Tab>
                      </TabList>
                      <TabPanel>
                          <HeaderComponent TaskID={this.props.TaskID}
                            CourseName={this.state.CourseName}
                            CourseName={this.state.CourseName}
                            CourseNumber={this.state.CourseNumber}
                            AssignmentTitle={this.state.AssignmentTitle}
                            AssignmentDescription={this.state.AssignmentDescription}
                            TaskActivityType={this.state.TaskActivityType}
                            SemesterName={this.state.SemesterName}
                            Strings={this.state.Strings}
                            />
                          {renderComponents}
                      </TabPanel>
                      <TabPanel>
                          <div className="placeholder"></div>
                          {/*  Future work to support comments*/}

                          <CommentComponent Comment={{
                              Author: 'User1',
                              Timestamp: 'May 6, 2013 9:43am',
                              Content: 'I really liked your problem. It was very intriguing.'
                          }}/>
                          <CommentComponent Comment={{
                              Author: 'User2',
                              Timestamp: 'May 6, 2013 11:09am',
                              Content: 'I agree. I would have never thought of this.'
                          }}/>
                          <CommentComponent Comment={{
                              Author: 'Instructor',
                              Timestamp: 'May 6, 2013 3:32pm',
                              Content: 'Your approach of the problem is very unique. Well done.'
                          }}/>
                      </TabPanel>

                  </Tabs>

              </div>

          );
        }

}

export default TemplateContainer;
