/* This is the Container for the task template page. It loads all the other components
 * and puts the apporpriate data in them.This Container also has the GET calls to fetch
 *  the data and passes it down to the other Components. The page uses tabs for
 *  future stuff.
*/
import React from 'react';
import PropTypes from 'prop-types';
import request from 'request';
import { TASK_TYPES } from '../../server/utils/constants';

// Input Components: These can be interactive with the user;
import SuperComponent from './superComponent';
// Display Components: These only display data retrived from the database. Not interactive.

import SuperViewComponent from './superViewComponent';
import HeaderComponent from './headerComponent';
import MultiViewComponent from './multiViewComponent';
import ErrorComponent from './errorComponent';
import CommentComponent from './commentComponent';

// This constains all the hard-coded strings used on the page. They are translated on startup
import strings from './strings';

const ReactTabs = require('react-tabs');

const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;

class TemplateContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Loaded: false, // set when page succesfully fetches data from the backend
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
            Strings: strings,
        };
    }

    /**
     * [componentWillMount called when page loads, so good place to fetch initial data]
     * @return {[type]} [description]
     */
    componentWillMount() {
        this.getTaskData();
    }

    /** getTaskData
     *  Makes the API calls to get the relevant Task Data from the database
     *  Also gets the translated strings
     */
    getTaskData() {
        this.props.translateFunction(strings, (newStrings) => {
        // API call to get the header data
            const options = {
                method: 'GET',
                uri: `${this.props.apiUrl}/api/taskInstanceTemplate/main/${this.props.TaskID}`,
                qs: { // query strings
                    courseID: this.props.CourseID,
                    userID: this.props.UserID,
                    sectionID: this.props.SectionID,
                },
                json: true,
            };

        // this function makes an API call to get the current and previous tasks data and saves the data into appropriate state variables
        // for rendering
            const options2 = {
                method: 'GET',
                uri: `${this.props.apiUrl}/api/superCall/${this.props.TaskID}`,
                qs: {
                    userID: this.props.UserID,
                },
                json: true,
            };

            request(options, (err, res, body) => {
                if (res.statusCode == 400) {
                    this.setState({ Error: true });
                    return;
                }


                request(options2, (err, res, bod) => {
                    if (res.statusCode != 200) {
                        this.setState({ Error: true });
                        return;
                    }
                    console.log(bod);

                    const taskList = [];
                    const skipIndeces = [];

                    /*
                    Sometimes data from API calls is not completely parsed, so parseTaskList
                    makes sure that the object fields are actually objects,
                    if not it parses them
                     */
                    let parseTaskList = bod.superTask.map((task) => {
                        const newTask = task;
                        if (task.Data !== null) {
                            if (Array.isArray(task.Data)) {
                                newTask.Data = task.Data;
                            } else if (task.Data.constructor === Object) {
                                newTask.Data = [task.Data];
                            } else {
                                newTask.Data = [JSON.parse(task.Data)];
                            }
                        } else {
                            newTask.Data = [new Object()];
                        }
                        if (task.Files !== null && task.Files.constructor !== Object) {
                            newTask.Files = JSON.parse(task.Files);
                        } else {
                            newTask.Files = task.Files;
                        }
                        if (newTask.TaskActivity.Fields !== null && newTask.TaskActivity.Fields.constructor !== Object) {
                            newTask.TaskActivity.Fields = JSON.parse(task.TaskActivity.Fields);
                        }
                        if (newTask.TaskActivity.FileUpload !== null && newTask.TaskActivity.FileUpload.constructor !== Object) {
                            newTask.TaskActivity.FileUpload = JSON.parse(task.TaskActivity.FileUpload);
                        }

                        return newTask;
                    });
                    const currentTask = parseTaskList.pop();
                    parseTaskList = parseTaskList.reverse();

                    /*
                      Goes through the tasks and groups them by TaskActivityID.
                      Used to display tasks with multiple participants side by side.
                     */
                    parseTaskList.forEach((task, index) => {
                        if (skipIndeces.includes(index) || task.TaskActivity.Type === TASK_TYPES.NEEDS_CONSOLIDATION) {
                            return;
                        }
                        if (task.TaskActivity.NumberParticipants > 1) {
                            const newArray = parsedTaskList.filter((t, idx) => {
                                if (t.TaskActivity.TaskActivityID === task.TaskActivity.TaskActivityID) {
                                    skipIndeces.push(idx);

                                    return true;
                                }
                                return false;
                            });
                            taskList.push(newArray);
                        } else {
                            taskList.push(task);
                        }
                    }, this);
                    console.log(currentTask);
                    const currentTaskStatus = currentTask.Status;

                    taskList.push(currentTask);
                    console.log('Task data after manipulation', taskList);
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
                        Strings: newStrings,
                    });
                });
            });
        });
    }


    render() {
        let renderComponents = null;

        if (this.state.Error) { // if there was an error in the data fetching calls, show the Error Component
            return (<ErrorComponent />);
        }

        // while the data hasn't been loaded, show nothing.
        // This fixes a flickering issue in the animation.
        if (!this.state.Loaded) {
            return (
              <div />
            );
        }


        renderComponents = this.state.Data.map((task, idx) => {
            // Goes over the array of tasks(starting from first task to this task)
            // If it's the last task in the array, put in a SuperComponent
            // If it's an array, put it in a MultiViewComponent
            // If it's a plain object, put it in a SuperViewComponent

            let compString = null;
            console.log(task);
            if (idx == this.state.Data.length - 1) {
                switch (task.TaskActivity.Type) {
                case TASK_TYPES.CREATE_PROBLEM:
                    compString = this.state.Strings.CreateProblemTitle;
                    break;
                case TASK_TYPES.EDIT:
                    compString = this.state.Strings.EditProblemTitle;
                    break;
                case TASK_TYPES.COMMENT:
                    compString = this.state.Strings.CommentTitle;
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
                    compString = '';
                    break;
                }
                if (task.Status === 'Complete' || task.Status === 'complete') {
                    return (<SuperViewComponent key={idx + 2000} index={idx} ComponentTitle={compString} TaskData={task.Data} Files={task.Files} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} TaskActivityFields={task.TaskActivity.Fields} Strings={this.state.Strings} />);
                }
                return (<SuperComponent key={idx + 2000} TaskID={this.props.TaskID} UserID={this.props.UserID} Files={task.Files} ComponentTitle={compString} Type={task.TaskActivity.Type} FileUpload={task.TaskActivity.FileUpload} TaskData={task.Data} TaskStatus={task.Status} TaskActivityFields={task.TaskActivity.Fields} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} Strings={this.state.Strings} apiUrl={this.props.apiUrl} />);
            }
            if (Array.isArray(task)) {
                return (<MultiViewComponent UsersTaskData={task} TaskID={this.props.TaskID} UserID={this.props.UserID} Strings={this.state.Strings} />);
            }

            switch (task.TaskActivity.Type) {
            case TASK_TYPES.CREATE_PROBLEM:
                compString = this.state.Strings.CreateProblemTitle;
                break;
            case TASK_TYPES.EDIT:
                compString = this.state.Strings.EditProblemTitle;
                break;
            case TASK_TYPES.COMMENT:
                compString = this.state.Strings.CommentTitle;
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                compString = this.state.Strings.SolveProblemTitle;
                break;
            case TASK_TYPES.GRADE_PROBLEM:
                compString = this.state.Strings.GradeProblemTitle;
                break;
            case TASK_TYPES.CRITIQUE:
                compString = this.state.Strings.CritiqueTitle;
                break;
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
                compString = '';
                break;
            }

            return (<SuperViewComponent key={idx + 2000} index={idx} Instructions={task.TaskActivity.Instructions} Rubric={task.TaskActivity.Rubric} ComponentTitle={compString} TaskData={task.Data} Files={task.Files} TaskActivityFields={task.TaskActivity.Fields} Strings={this.state.Strings} />);
        }, this);

        return (
          <div>
            <Tabs
              onSelect={(tab) => {
                  this.setState({ TabSelected: tab });
              }} selectedIndex={this.state.TabSelected}
            >
              <TabList className="big-text">
                <Tab>{this.state.Strings.Task}</Tab>
                <Tab>{this.state.Strings.Comments}</Tab>
              </TabList>
              <TabPanel>
                <HeaderComponent
                  TaskID={this.props.TaskID}
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
                <div className="placeholder" />
                {/*  Future work to support comments*/}

                <CommentComponent
                  Comment={{
                      Author: 'User1',
                      Timestamp: 'May 6, 2013 9:43am',
                      Content: 'I really liked your problem. It was very intriguing.',
                  }}
                />
                <CommentComponent
                  Comment={{
                      Author: 'User2',
                      Timestamp: 'May 6, 2013 11:09am',
                      Content: 'I agree. I would have never thought of this.',
                  }}
                />
                <CommentComponent
                  Comment={{
                      Author: 'Instructor',
                      Timestamp: 'May 6, 2013 3:32pm',
                      Content: 'Your approach of the problem is very unique. Well done.',
                  }}
                />
              </TabPanel>

            </Tabs>

          </div>

        );
    }

}
TemplateContainer.propTypes = {
    TaskID: PropTypes.number.isRequired,
    SectionID: PropTypes.number.isRequired,
    UserID: PropTypes.number.isRequired,
    CourseID: PropTypes.number.isRequired,
    apiUrl: PropTypes.string.isRequired,
    translateFunction: PropTypes.func.isRequired,
};
export default TemplateContainer;
