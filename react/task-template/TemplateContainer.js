/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import apiCall from '../shared/apiCall';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants'; // contains constants and their values

// Display Components: These only display data retrived from the database. Not interactive.

import HeaderComponent from './headerComponent';
import CommentComponent from './commentComponent';
import TasksList from './tasksList';

// This constains all the hard-coded strings used on the page. They are translated on startup
import strings from './strings';

const ReactTabs = require('react-tabs');
const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;


var TreeModel = require('tree-model'); /// references: http://jnuno.com/tree-model-js/  https://github.com/joaonuno/tree-model-js
let FlatToNested = require('flat-to-nested');

/*      PROPS:
            - TaskID
            - SectionID
            - UserID
              (from main.js)
*/

class TemplateContainer extends React.Component {
    
    
    constructor(props) {
        super(props);

        this.tree = new TreeModel();
        this.state = {
            Loaded: false, // this variable is set to true when the page succesfully fetches data from the backend
            CourseID: null,
            CourseName: '',
            CourseNumber: '',
            TaskActivityType: '',
            TaskStatus: '',
            SemesterID: null,
            SemesterName: '',
            TaskActivityName: '',
            Data: null,
            Error: false,
            TabSelected: 0,
            Strings: strings,
            NotAllowed: false,
            IsRevision: false,
        };
    }

    unflattenTreeStructure(flatTreeString){
        let flatToNested = new FlatToNested();
        let flatTreeArray = JSON.parse(flatTreeString);
        let nestedTreeObj = flatToNested.convert(flatTreeArray);
        let treeRoot = this.tree.parse(nestedTreeObj);
        return treeRoot;
    }

    getTaskData() {
		// this function makes an API call and saves the data into appropriate state variables

        const options = {
				// query strings
            courseID: this.props.CourseID,
            userID: this.props.UserID,
            sectionID: this.props.SectionID,
        };

		// this function makes an API call to get the current and previous tasks data and saves the data into appropriate state variables
		// for rendering
        const options2 = {
            userID: this.props.UserID,
        };

        apiCall.get(`/superCall/${this.props.TaskID}`, options2, (err, res, bod) => {
            if (res.statusCode != 200) {
                this.setState({ Error: true });
                return;
            }
            this.props.__(strings, (newStrings) => {

                apiCall.get(`/taskInstanceTemplate/main/${this.props.TaskID}`,options, (err, res, body) => {
                    if (res.statusCode != 200) {
                        this.setState({ Error: true });
                        return;
                    }

                    const taskList = new Array();
                    const skipIndeces = new Array();
                    let currentTaskStatus = '';

                    if (bod.error === true) {
                        console.log('Error message', bod.message);
                        this.setState({
                            NotAllowed: true,
                            Loaded: true,
                        });
                    } else {
                        let parseTaskList = bod.superTask.map((task) => {
                            const newTask = task;
                            if (task.Data !== null) {
                                if(typeof newTask.Data !== 'object'){
                                    newTask.Data = JSON.parse(task.Data);
                                } else{
                                    newTask.Data = task.Data;
                                }

                            } else {
                                newTask.Data = [new Object()];
                            }
                            if (
    								task.Files !== null &&
    								task.Files.constructor !== Object
    							) {
                                newTask.Files = JSON.parse(task.Files);
                            } else {
                                newTask.Files = task.Files;
                            }
                            if (newTask.TaskActivity.Fields !== null &&newTask.TaskActivity.Fields.constructor !==Object) {
                                newTask.TaskActivity.Fields = JSON.parse(task.TaskActivity.Fields);
                            }

                            newTask.Status = JSON.parse(task.Status);
                            if (
    								newTask.TaskActivity.FileUpload !== null &&
    								newTask.TaskActivity.FileUpload.constructor !==
    									Object
    							) {
                                newTask.TaskActivity.FileUpload = JSON.parse(
    									task.TaskActivity.FileUpload);
                            }

                            return newTask;
                        });

                        const currentTask = parseTaskList.pop();
                        parseTaskList = parseTaskList.reverse();

                        parseTaskList.forEach((task, index) => {
                            if (skipIndeces.includes(index) ||task.TaskActivity.Type == TASK_TYPES.NEEDS_CONSOLIDATION || task.Status.includes('bypassed')) {
                                return;
                            }
                            if (task.TaskActivity.NumberParticipants > 1) {
                                const newArray = parseTaskList.filter((t, idx) => {
                                    if (t.TaskActivity.TaskActivityID ===task.TaskActivity.TaskActivityID) {
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

                        currentTaskStatus = currentTask.Status;
                        taskList.push(currentTask);

                        
                        if([TASK_TYPES.COMMENT].includes(currentTask.TaskActivity.Type)){
                        /** Check if the current task is a revision task
                         *      If not, it's a regular edit and show regular buttons
                         *      Else, check if it has a consolidation task
                         *          If it does, show regular buttons
                         *          Else, show revision buttons
                         */
                            if(currentTask.TaskActivity.AllowRevision === true){

                                apiCall.get(`/getWorkflow/${this.props.TaskID}`, (err, res, reviseBod) => {
                                    reviseBod.WorkflowTree = this.unflattenTreeStructure(reviseBod.WorkflowTree);
                                    //console.log(reviseBod);
                                    let currentTaskNode = reviseBod.WorkflowTree.first((node) => {
                                        return node.model.id === parseInt(this.props.TaskID);
                                    });

                                    console.log(currentTaskNode);
                                    if(currentTaskNode.children && currentTaskNode.children[2]){
                                        if(currentTaskNode.children[2].children && currentTaskNode.children[2].children[2]){
                                            this.setState({
                                                IsRevision: true
                                            });
                                        }
                                    } else{
                                        this.setState({
                                            IsRevision: true
                                        });
                                    }
                                });
                            
                            }else {
                                this.setState({
                                    IsRevision: false
                                });
                            }
                        }else if([TASK_TYPES.CONSOLIDATION].includes(currentTask.TaskActivity.Type)){
                        /** Check if current consolidation is acting on an Revision edit task
                         *  If it is, show revision buttons
                         *  Else, show normal buttons
                         * 
                         * 
                         */

                            apiCall.get(`/getWorkflow/${this.props.TaskID}`, (err, res, reviseBod) => {
                                reviseBod.WorkflowTree = this.unflattenTreeStructure(reviseBod.WorkflowTree);
                            //console.log(reviseBod);
                                let currentTaskNode = reviseBod.WorkflowTree.first((node) => {
                                    return node.model.id === parseInt(this.props.TaskID);
                                });
                                let possibleEditTask = currentTaskNode;
                                let editIndex = null;
                                if(currentTaskNode.parent){
                                    possibleEditTask = currentTaskNode.parent; //possible needs consolidation
                                    if(possibleEditTask.parent){
                                        possibleEditTask = possibleEditTask.parent; //possible edit task
                                        editIndex= possibleEditTask.model.id;
                                    } else {
                                        possibleEditTask = null;
                                    }
                                } else {
                                    possibleEditTask = null;
                                }
                                if(possibleEditTask === null) {
                                    this.setState({
                                        IsRevision: false
                                    });
                                } else {
                                    let possibleEditData = reviseBod.Workflow[editIndex].TaskActivity;
                                    if([TASK_TYPES.COMMENT].includes(possibleEditData.Type)){
                                        if(possibleEditData.AllowRevision === true){
                                            this.setState({
                                                IsRevision: true
                                            });
                                        } else {
                                            this.setState({
                                                IsRevision: false
                                            });
                                        }

                                    } else {
                                        this.setState({
                                            IsRevision: false
                                        });
                                    }
                                }
                                console.log(currentTaskNode);
                        
                            });
                        }
                    // apiCall.get(`/getWorkflow/${this.props.TaskID}`, (err, res, reviseBod) => {
                    //     reviseBod.WorkflowTree = this.unflattenTreeStructure(reviseBod.WorkflowTree);
                    //         //console.log(reviseBod);
                    //     let currentTaskNode = reviseBod.WorkflowTree.first((node) => {
                    //         return node.model.id === parseInt(this.props.TaskID);
                    //     });

                    //     console.log(currentTaskNode);
                        
                    // });
                    }

                    
                    console.log('tasklist', taskList);


                    this.setState({
                        Loaded: true,
                        CourseName: body.courseName,
                        CourseNumber: body.courseNumber,
                        Assignment: body.assignment,
                        TaskActivityType: body.taskActivityType,
                        SemesterID: body.semesterID,
                        SemesterName: body.semesterName,
                        SectionName: body.sectionName,
                        SectionID: body.sectionID,
                        Data: taskList,
                        TaskStatus: currentTaskStatus,
                        Strings: newStrings,
                    });
                });
            });
        });
    }

    componentWillMount() {
		// this function is called before the component renders, so that the page renders with the appropriate state data
        this.getTaskData();
    }

    /**
     * [getLinkedTaskValues Gets the Data for a linked task that uses default_refers_to]
     * @param  {[number]} taskActivityID [ID of the Task Activity, first index in default_refers_to]
     * @param  {[number]} fieldIndex     [field index in the Task Activity Fields object, second index on default_refers_to]
     * @return {[array]}                ['response', 'justification']
     */
    getLinkedTaskValues(taskActivityID, fieldIndex){
        let returningValues = ['', ''];
        this.state.Data.forEach((task) => {
            if(Array.isArray(task)){
              /// If multiple participants, assume that whichever is first in the array is desired
                task.forEach((miniTask) => {
                    if(miniTask.TaskActivity.TaskActivityID === taskActivityID){
                    //if multiple versions, assume that the lastest version is desired
                        returningValues = miniTask.Data[miniTask.Data.length - 1][fieldIndex];
                    }
                });
            } else {
                if(task.TaskActivity.TaskActivityID === taskActivityID){
                  //if multiple versions, assume that the lastest version is desired

                    returningValues = task.Data[task.Data.length - 1][fieldIndex];
                }
            }
        });
        return returningValues;
    }

    render() {
        let renderView = null;
        if (this.state.Error) {
			// if there was an error in the data fetching calls, show the Error Component
            return <ErrorComponent />;
        }
        if (!this.state.Loaded) {
			// while the data hasn't been loaded, show nothing. This fixes a flickering issue in the animation.
            return <div />;
        }

        if (this.state.NotAllowed === true) {
            renderView = (<div>{this.state.Strings.NotAllowed}</div>);
        } else {
            renderView = (<TasksList
              TasksArray={this.state.Data}
              getLinkedTaskValues={this.getLinkedTaskValues.bind(this)}
              TaskID={this.props.TaskID}
              UserID={this.props.UserID}
              Strings={this.state.Strings}
              apiUrl={this.props.apiUrl}
              IsRevision={this.state.IsRevision}
            />);
        }


        return (
          <div>
            <Tabs
              onSelect={(tab) => {
                  this.setState({ TabSelected: tab });
              }}
              selectedIndex={this.state.TabSelected}
            >
              <TabList className="big-text">
                <Tab>{this.state.Strings.Task}</Tab>
                <Tab>{this.state.Strings.Comments}</Tab>
              </TabList>
              <TabPanel>
                <HeaderComponent
                  TaskID={this.props.TaskID}
                  CourseName={this.state.CourseName}
                  CourseName={this.state.CourseName}
                  CourseNumber={this.state.CourseNumber}
                  Assignment={this.state.Assignment}
                  TaskActivityType={this.state.TaskActivityType}
                  SemesterName={this.state.SemesterName}
                  SectionName={this.state.SectionName}
                  Strings={this.state.Strings}
                  
                />

                {renderView}

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

export default TemplateContainer;
