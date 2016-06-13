/*
This Container is the main component.It holds all the other components and decides what to render depending.

*/
import React from 'react';
import request from 'request';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';

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
import CommentComponent from './commentComponent';
import ResolutionViewComponent from './resolutionViewComponent';

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
              TaskActivityType: '',
              SemesterID: null,
              SemesterName: '',
              TaskActivityName:'',
              Data:{

              }
          }
      }

      getVariableData() {

        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/main/' + this.props.TaskID,
            qs: {
              courseID:1, //this.props.CourseID,
              userID:1, //this.props.UserID,
              sectionID:1, //this.props.SectionID
            },
            json: true
        };

        request(options, (err, res, body) => {

          if(true /*this.state.taskActivityType == TASK_TYPES.CREATE_PROBLEM*/){
            const options2 = {
                      method: 'GET',
                      uri: this.props.apiUrl + '/api/taskTemplate/create/10',
                      json: true
                  };

              request(options2, (err, res, bod) => {
                const options3 = {
                          method: 'GET',
                          uri: this.props.apiUrl + '/api/taskTemplate/edit/' + this.props.TaskID,
                          json: true
                      };

                  request(options3, (err, res, bo) => {
                    const options4 = {
                              method: 'GET',
                              uri: this.props.apiUrl + '/api/taskTemplate/grade/' + this.props.TaskID,
                              json: true
                          };

                      request(options4, (err, res, gradebody) => {


                        let newData = this.state.Data;
                        let taskprops = [bod.taskData,bod.taskActivityData,bod.assignmentDescription,bod.taskInstructions, bod.taskRubric];
                        let etaskprops = [bo.taskData,bo.taskActivityData,bo.assignmentDescription,bo.taskInstructions, bo.taskRubric];
                        newData['create'] = taskprops;
                        newData['edit'] = etaskprops;
                        newData['grade'] = [gradebody.taskData,gradebody.taskActivityData,gradebody.assignmentDescription,gradebody.taskInstructions, gradebody.taskRubric];
                        console.log(newData);
                        this.setState({
                          //set create's task data to pass down
                          Data: newData,
                          Loaded:true,
                          TaskActivityID: body.taskActivityID,
                          CourseName: body.courseName,
                          CourseNumber: body.courseNumber,
                          AssignmentTitle: body.assignmentTitle,
                          AssignmentID: body.assignmentID,
                          TaskActivityType: body.taskActivityType,
                          SemesterID: body.semesterID,
                          SemesterName: body.semesterName,
                          TaskActivityName: body.taskActivityName

                          });
                        });
                    });
                  });

                  }
          });

      }


      componentWillMount() { //get the database data before component renders
        this.getVariableData();


      }

      render(){
        let renderComponents = null;
        if(!this.state.Loaded){
          renderComponents = (<div></div>);

          return(

            <div >
              <HeaderComponent TaskID = {this.props.TaskID}
                               CourseName = {this.state.CourseName}
                               CourseName = {this.state.CourseName}
                                CourseNumber = {this.state.CourseNumber}
                                AssignmentTitle = {this.state.AssignmentTitle}
                                TaskActivityType = {this.state.TaskActivityType}
                                SemesterName={this.state.SemesterName}
                                TaskActivityName= {this.state.TaskActivityName} />
              <br />
              {renderComponents}
            </div>

          );

        }
        if(createProblemContainer){
          renderComponents = (
            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Create the Problem"
                                    TaskData = {this.state.Data['create'][0]}
                                    TaskActivityFields = {this.state.Data['create'][1]}
                                    AssignmentDescription = {this.state.Data['create'][2]}
                                    Instructions = {this.state.Data['create'][3]}
                                    Rubric= {this.state.Data['create'][4]}
                                    apiUrl={this.props.apiUrl}

                                    />

          );
        }
        else if(editProblemContainer){
          renderComponents = (
              <div>
              <SuperViewComponent 
                                    ComponentTitle="Problem"
                                    TaskData={this.state.Data['create'][0]}
                                    TaskActivityFields={this.state.Data['create'][1]}/>

              <SuperComponent         TaskID = {this.props.TaskID}
                                      UserID = {this.props.UserID}
                                      ComponentTitle="Edit the Problem"
                                      TaskData = {this.state.Data['edit'][0]}
                                      TaskActivityFields = {this.state.Data['edit'][1]}
                                      AssignmentDescription = {this.state.Data['edit'][2]}
                                      Instructions = {this.state.Data['edit'][3]}
                                      Rubric= {this.state.Data['edit'][4]}
                                      apiUrl={this.props.apiUrl}

                                      />
              <br />
              </div>

          );
        }
        else if(solveProblemContainer){
            renderComponents =(
              <div>
                <SuperViewComponent TaskID = {this.props.TaskID}
                                      apiUrl={this.props.apiUrl}
                                      ComponentTitle="Problem"
                                      TaskData={this.state.Data['create'][0]}
                                      TaskActivityFields={this.state.Data['create'][1]}/>

                <SuperComponent         TaskID = {this.props.TaskID}
                                        UserID = {this.props.UserID}
                                        ComponentTitle="Solve the Problem"
                                        TaskData = {this.state.Data['solve'][0]}
                                        TaskActivityFields = {this.state.Data['solve'][1]}
                                        AssignmentDescription = {this.state.Data['solve'][2]}
                                        Instructions = {this.state.Data['solve'][3]}
                                        Rubric= {this.state.Data['solve'][4]}
                                        apiUrl={this.props.apiUrl}

                                        />
             </div>
            );
        }
        else if(gradeContainer){
          renderComponents = (<div>
            <SuperViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  ComponentTitle="Problem"
                                  TaskData={this.state.Data['create'][0]}
                                  TaskActivityFields={this.state.Data['create'][1]}/>

            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Grade the Problem"
                                    TaskData = {this.state.Data['grade'][0]}
                                    TaskActivityFields = {this.state.Data['grade'][1]}
                                    AssignmentDescription = {this.state.Data['grade'][2]}
                                    Instructions = {this.state.Data['grade'][3]}
                                    Rubric= {this.state.Data['grade'][4]}
                                    apiUrl={this.props.apiUrl}
                                    />
            <SuperViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  ComponentTitle="Grades"
                                  TaskData={this.state.Data['grade'][0]}
                                  TaskActivityFields={this.state.Data['grade'][1]}/>



            <br />
            </div>
          );

        }
        else if(gradedContainer){
          renderComponents=(<div>
            <SuperViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  ComponentTitle="Problem"
                                  TaskData={this.state.Data['create'][0]}
                                  TaskActivityFields={this.state.Data['create'][1]}/>

            <ResponseComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}/>

            <GradedComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID} />

            </div>
          );
        }
        else if(disputeContainer){
          renderComponents=(
            <div>
              <SuperViewComponent  TaskID = {this.props.TaskID}
                                     apiUrl={this.props.apiUrl}
                                     problemHeader="Problem"/>

              <ResponseComponent     TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}/>

              <GradedComponent       TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID}
                                     HideDisputeButton = {true}/>

             <SuperComponent         TaskID = {this.props.TaskID}
                                     UserID = {this.props.UserID}
                                     ComponentTitle="Dispute Your Grade"
                                     TaskData = {this.state.Data['dispute'][0]}
                                     TaskActivityFields = {this.state.Data['dispute'][1]}
                                     AssignmentDescription = {this.state.Data['dispute'][2]}
                                     Instructions = {this.state.Data['dispute'][3]}
                                     Rubric= {this.state.Data['dispute'][4]}
                                     apiUrl={this.props.apiUrl}
                                     />

            </div>
          );
        }
        else if(resolveGradeContainer){
          renderComponents=(
            <div>
              <SuperViewComponent TaskID = {this.props.TaskID}
                                    apiUrl={this.props.apiUrl}
                                    problemHeader="Problem"/>
              <br />
              <ResponseComponent TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}/>
              <GradedComponent       TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID}
                                     HideDisputeButton = {true}/>
              <DisputeViewComponent  TaskID = {this.props.TaskID}
                                    apiUrl = {this.props.apiUrl}
                                    UserID = {this.props.UserID} />
              <SuperComponent         TaskID = {this.props.TaskID}
                                      UserID = {this.props.UserID}
                                      ComponentTitle="Resolve the Dispute"
                                      TaskData = {this.state.Data['resolve'][0]}
                                      TaskActivityFields = {this.state.Data['resolve'][1]}
                                      AssignmentDescription = {this.state.Data['resolve'][2]}
                                      Instructions = {this.state.Data['resolve'][3]}
                                      Rubric= {this.state.Data['resolve'][4]}
                                      apiUrl={this.props.apiUrl}
                                      />

            </div>

          );
        }
        else if(completedContainer){
            renderComponents=(
              <div>
                <SuperViewComponent TaskID = {this.props.TaskID}
                                      apiUrl={this.props.apiUrl}
                                      problemHeader="Problem"/>
                <br />
                <ResponseComponent TaskID = {this.props.TaskID}
                                       apiUrl = {this.props.apiUrl}/>
                <br />
                <GradedComponent       TaskID = {this.props.TaskID}
                                       apiUrl = {this.props.apiUrl}
                                       UserID = {this.props.UserID}
                                       HideDisputeButton = {true}/>
                <br />
                <DisputeViewComponent  TaskID = {this.props.TaskID}
                                      apiUrl = {this.props.apiUrl}
                                      UserID = {this.props.UserID} />
                                    <br/>
                <ResolutionViewComponent TaskID = {this.props.TaskID}
                                      apiUrl = {this.props.apiUrl}
                                      UserID = {this.props.UserID} />

              </div>
            );

        }
        else{
          renderComponents =  (
            <div>
              <SuperComponent         TaskID = {this.props.TaskID}
                                      UserID = {this.props.UserID}
                                      ComponentTitle="Create the Problem"
                                      TaskData = {this.state.Data['create'][0]}
                                      TaskActivityFields = {this.state.Data['create'][1]}
                                      AssignmentDescription = {this.state.Data['create'][2]}
                                      Instructions = {this.state.Data['create'][3]}
                                      Rubric= {this.state.Data['create'][4]}
                                      apiUrl={this.props.apiUrl}

                                      />
            <SuperViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  ComponentTitle="Problem"
                                  TaskData={this.state.Data['create'][0]}
                                  TaskActivityFields={this.state.Data['create'][1]}/>

            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Edit the Problem"
                                    TaskData = {this.state.Data['edit'][0]}
                                    TaskActivityFields = {this.state.Data['edit'][1]}
                                    AssignmentDescription = {this.state.Data['edit'][2]}
                                    Instructions = {this.state.Data['edit'][3]}
                                    Rubric= {this.state.Data['edit'][4]}
                                    apiUrl={this.props.apiUrl}

                                    />
            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Solve the Problem"
                                    TaskData = {this.state.Data['solve'][0]}
                                    TaskActivityFields = {this.state.Data['solve'][1]}
                                    AssignmentDescription = {this.state.Data['solve'][2]}
                                    Instructions = {this.state.Data['solve'][3]}
                                    Rubric= {this.state.Data['solve'][4]}
                                    apiUrl={this.props.apiUrl}

                                    />

            <ResponseComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}/>

           <SuperComponent         TaskID = {this.props.TaskID}
                                   UserID = {this.props.UserID}
                                   ComponentTitle="Grade the Problem"
                                   TaskData = {this.state.Data['grade'][0]}
                                   TaskActivityFields = {this.state.Data['grade'][1]}
                                   AssignmentDescription = {this.state.Data['grade'][2]}
                                   Instructions = {this.state.Data['grade'][3]}
                                   Rubric= {this.state.Data['grade'][4]}
                                   apiUrl={this.props.apiUrl}
                                   />

            <GradedComponent       TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID}/>

            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Dispute Your Grade"
                                    TaskData = {this.state.Data['dispute'][0]}
                                    TaskActivityFields = {this.state.Data['dispute'][1]}
                                    AssignmentDescription = {this.state.Data['dispute'][2]}
                                    Instructions = {this.state.Data['dispute'][3]}
                                    Rubric= {this.state.Data['dispute'][4]}
                                    apiUrl={this.props.apiUrl}
                                    />
            <DisputeViewComponent  TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
            <SuperComponent         TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    ComponentTitle="Resolve the Dispute"
                                    TaskData = {this.state.Data['resolve'][0]}
                                    TaskActivityFields = {this.state.Data['resolve'][1]}
                                    AssignmentDescription = {this.state.Data['resolve'][2]}
                                    Instructions = {this.state.Data['resolve'][3]}
                                    Rubric= {this.state.Data['resolve'][4]}
                                    apiUrl={this.props.apiUrl}
                                    />
            <ResolutionViewComponent TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
            </div>


          );
        }




        return(
          <div>
                <HeaderComponent TaskID = {this.props.TaskID}
                                 CourseName = {this.state.CourseName}
                                 CourseName = {this.state.CourseName}
                                  CourseNumber = {this.state.CourseNumber}
                                  AssignmentTitle = {this.state.AssignmentTitle}
                                  TaskActivityType = {this.state.TaskActivityType}
                                  SemesterName={this.state.SemesterName}
                                  TaskActivityName= {this.state.TaskActivityName} />
                {renderComponents}



              </div>



        );

      }


}
/*render the components with the appropriate props*/

export default TemplateContainer;
