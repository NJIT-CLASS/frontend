/*
This Container is the main component.It holds all the other components and decides what to render depending.

*/
import React from 'react';
import request from 'request';

//Input Components: These can be interactive with the user;
import CreateProblemComponent from './createProblemComponent';
import EditProblemComponent from './editProblemComponent';
import SolveProblemComponent from './solveProblemComponent';
import GradeSolutionComponent from './gradeSolutionComponent';
import ResolveGradeComponent from './resolveGradeComponent';
import DisputeComponent from './disputeComponent';

//Display Components: These only display data retrived from the database. Not interactive.
import HeaderComponent from './headerComponent'
import ResponseComponent from './responseComponent';
import ProblemViewComponent from './problemViewComponent';
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
              CourseID: null,
              CourseName: '',
              CourseNumber: '',
              AssignmentTitle: '',
              AssignmentID: null,
              TaskActivityType: '',
              SemesterID: null,
              SemesterName: '',
              TaskActivityName:''

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

              this.setState({
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
      }


      componentWillMount() { //get the database data before component renders
          this.getVariableData();

      }

      render(){
        let renderComponents = null;

        if(createProblemContainer){
          renderComponents = (
            <CreateProblemComponent TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    TaskActivityID = {this.state.TaskActivityID}
                                    AssignmentID = {this.state.AssignmentID}
                                    SemesterID={this.state.SemesterID}
                                    apiUrl={this.props.apiUrl}
                                    />

          );
        }
        else if(editProblemContainer){
          renderComponents = (
              <div>
              <ProblemViewComponent TaskID = {this.props.TaskID}
                                    apiUrl={this.props.apiUrl}
                                    problemHeader="Problem"/>
              <br />
              <EditProblemComponent TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID} />
              <br />
              </div>

          );
        }
        else if(solveProblemContainer){
            renderComponents =(
              <div>
              <ProblemViewComponent TaskID = {this.props.TaskID}
                                    apiUrl={this.props.apiUrl}
                                    problemHeader="Problem"/>
              <br />
              <SolveProblemComponent TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID} />
             </div>
            );
        }
        else if(gradeContainer){
          renderComponents = (<div>
              <ProblemViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  problemHeader="Problem" />
              <br />
              <GradeSolutionComponent TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID} />
              <br />
            </div>
          );

        }
        else if(gradedContainer){
          renderComponents=(<div>
            <ProblemViewComponent TaskID = {this.props.TaskID}
                                apiUrl={this.props.apiUrl}
                                problemHeader="Problem" />
            <br />
            <ResponseComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}/>
            <br />
            <GradedComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID} />
            <br />
            </div>
          );
        }
        else if(disputeContainer){
          renderComponents=(
            <div>
              <ProblemViewComponent TaskID = {this.props.TaskID}
                                    apiUrl={this.props.apiUrl}
                                    problemHeader="Problem"/>
              <br />
              <ResponseComponent      TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}/>
              <br />
              <GradedComponent       TaskID = {this.props.TaskID}
                                     apiUrl = {this.props.apiUrl}
                                     UserID = {this.props.UserID}
                                     HideDisputeButton = {true}/>
              <br />
              <DisputeComponent     TaskID = {this.props.TaskID}
                                    apiUrl = {this.props.apiUrl}
                                    UserID = {this.props.UserID} />
              <br />

            </div>
          );
        }
        else if(resolveGradeContainer){
          renderComponents=(
            <div>
              <ProblemViewComponent TaskID = {this.props.TaskID}
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
              <ResolveGradeComponent TaskID = {this.props.TaskID}
                                    apiUrl = {this.props.apiUrl}
                                    UserID = {this.props.UserID} />
                                  <br />

            </div>

          );
        }
        else if(completedContainer){
            renderComponents=(
              <div>
                <ProblemViewComponent TaskID = {this.props.TaskID}
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
              <CreateProblemComponent TaskID = {this.props.TaskID}
                                    UserID = {this.props.UserID}
                                    TaskActivityID = {this.state.TaskActivityID}
                                    AssignmentID = {this.state.AssignmentID}
                                    SemesterID={this.state.SemesterID}
                                    apiUrl={this.props.apiUrl}
                                    />
            <br />
            <ProblemViewComponent TaskID = {this.props.TaskID}
                                  apiUrl={this.props.apiUrl}
                                  problemHeader="Problem"/>
            <br />
            <SolveProblemComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID} />
            <br />
            <EditProblemComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID} />
            <br />
            <ResponseComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}/>
            <br />
            <GradeSolutionComponent TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID} />
            <br />
            <GradedComponent       TaskID = {this.props.TaskID}
                                   apiUrl = {this.props.apiUrl}
                                   UserID = {this.props.UserID}/>
            <br />
            <DisputeComponent     TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
            <br />
            <DisputeViewComponent  TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
                                <br/>
            <ResolveGradeComponent TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
                                <br />
            <ResolutionViewComponent TaskID = {this.props.TaskID}
                                  apiUrl = {this.props.apiUrl}
                                  UserID = {this.props.UserID} />
            </div>


          );
        }

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


}
/*render the components with the appropriate props*/

export default TemplateContainer;
