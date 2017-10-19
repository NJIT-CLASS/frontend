/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants'; // contains constants and their values

// Display Components: These only display data retrived from the database. Not interactive.

import HeaderComponent from './headerComponent';
import ProblemThreadComponent from './problemThreadComponent.js';
import CommentComponent from './commentComponent';
import TasksList from './tasksList';
import CommentEditorComponent from './commentEditorComponent';
import SuperViewComponent from './superViewComponent';
import Tooltip from '../shared/tooltip';

// This constains all the hard-coded strings used on the page. They are translated on startup
import strings from './strings';

const ReactTabs = require('react-tabs');
const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;

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
            CommentTargetList: [],
            BoxHide: false
        };

        console.log(props.UserType, props.Admin);
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
                    let commentsTaskList = [];
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

                        parseTaskList.forEach((task, index) => {
                            if (task.TaskActivity.Type == TASK_TYPES.NEEDS_CONSOLIDATION || task.Status.includes('bypassed')) {
                                return;
                            }
                            else {
                                commentsTaskList.push(task);
                            }
                        }, this);

                        commentsTaskList.push(currentTask);

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
                        CommentsTaskList: commentsTaskList,
                        TaskStatus: currentTaskStatus,
                        Strings: newStrings,
                    });
                    this.createCommentList();
                    console.log(commentsTaskList, body.assignment)
                });
            });
        });
    }

    getIDData() {
        apiCall.get(`/comments/IDData/${this.props.TaskID}`, (err, res, body) => {
            if (!body.Error) {
                this.setState({WorkflowInstanceID: body.WorkflowInstanceID, AssignmentInstanceID: body.AssignmentInstanceID});
            }
            else {
                console.log('No comment ID data received.');
            }
        });
    }

    getCommentData(target, ID) {
        //if ((this.state.CommentTargetList[this.state.CommentTarget].Target == target && this.state.CommentTargetList[this.state.CommentTarget].ID == ID) || type == 'refresh') {
            apiCall.get(`/comments/ti/${target}/id/${ID}`, (err, res, body) => {
                console.log('Comment data fetched')
                let list = [];
                if (body != undefined ) {
                    for (let com of body.Comments) {
                        list.push(com);
                    }
                    this.setState({
                        commentList: list
                    });
                }
                else {
                    console.log('No comment data received.');
                    this.setState({
                        commentList: list
                    });
                }
        });
        //}
    }


    componentWillMount() {
        // this function is called before the component renders, so that the page renders with the appropriate state data
        this.getIDData();
        this.getTaskData();
        this.switchTab();
    };

    getQS(field) {
        let url = window.location.href;
        let regex = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        let string = regex.exec(url);
        return string ? string[1] : null;
    }

    switchTab() {
        let tab = this.getQS('tab');
        let target = this.getQS('target');
        let targetID = this.getQS('targetID');
        if (tab === 'comments') {
            this.setState({TabSelected: 1});
            //this.showComments(target, targetID);
        }
    }

    createCommentList() {
        let commentTargetList = [];
        commentTargetList.push({Target: 'AssignmentInstance', ID: this.state.AssignmentInstanceID, value: commentTargetList.length, label: this.state.Assignment.DisplayName});
        commentTargetList.push({Target: 'WorkflowInstance', ID: this.state.WorkflowInstanceID, value: commentTargetList.length, label: this.state.Strings.ProblemThreadLabel});
        for (let i of this.state.CommentsTaskList) {
            commentTargetList.push({Target: 'TaskInstance', ID: i.TaskInstanceID, value: commentTargetList.length, label: i.TaskActivity.DisplayName});
        }
        this.setState({CommentTargetList: commentTargetList});
        this.showCommentQS();
    }

    showCommentQS() {
        let target = this.getQS('target');
        let targetID = this.getQS('targetID');
        if ((target != undefined) && (targetID != undefined)) {
            this.showComments(target, targetID, 1);
        }
        else {
            this.showComments('TaskInstance', this.props.TaskID, 0);
        }
    }

    showSingleComment() {
        let commentsID = this.getQS('commentsID');
        console.log('showSingleComment called');
        if (commentsID != undefined) {
            this.setState({EmphasizeID: commentsID});
        }
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

    handleChangeTarget(event) {
        this.setState({CommentTarget: event.value});
        this.getCommentData(event.Target, event.ID);
        if (this.state.BoxHide) {
            this.hideBox();
        }
    }

    showComments(target, id, tab) {
      let show;
      for (let i of this.state.CommentTargetList) {
        if ((i.Target == target) && (i.ID == id)) {
          show = i.value;
        }
      }
      console.log('show', show);
      this.setState({CommentTarget: show, TabSelected: tab});
      this.getCommentData(this.state.CommentTargetList[show].Target, this.state.CommentTargetList[show].ID);
    }

    hideBox() {
        this.state.BoxHide ? this.setState({BoxHide: false}) : this.setState({BoxHide: true});
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
                showComments={this.showComments.bind(this)}
                TaskStatus={this.state.TaskStatus}
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
                            AssignmentInstanceID={this.state.AssignmentInstanceID}
                            showComments={this.showComments.bind(this)}
                        />

                        <ProblemThreadComponent
                            WorkflowInstanceID={this.state.WorkflowInstanceID}
                            showComments={this.showComments.bind(this)}
                        />

                        {renderView}

                    </TabPanel>
                    <TabPanel>
                        <div className="placeholder" />
                        <div className="regular-text">{this.state.Strings.CommentTargetLabel}</div>
                        <div style={{width: 280, display: 'inline'}}>
                            <Select options={this.state.CommentTargetList} value={this.state.CommentTarget} onChange={this.handleChangeTarget.bind(this)} clearable={false} searchable={true}/>
                        </div>
                        {this.state.CommentTarget > 1 && <div style={{display: 'inline'}} className="link"><a onClick={this.hideBox.bind(this)}>{this.state.BoxHide ? this.state.Strings.UnhideLabel : this.state.Strings.HideLabel}</a></div>}
                        {(this.state.CommentTarget > 1 && !this.state.BoxHide) &&
                (<SuperViewComponent
                    Instructions={this.state.CommentsTaskList[this.state.CommentTarget - 2].TaskActivity.Instructions}
                    Rubric={this.state.CommentsTaskList[this.state.CommentTarget - 2].TaskActivity.Rubric}
                    ComponentTitle={this.state.CommentsTaskList[this.state.CommentTarget - 2].TaskActivity.DisplayName}
                    TaskData={this.state.CommentsTaskList[this.state.CommentTarget - 2].Data}
                    Status={this.state.CommentsTaskList[this.state.CommentTarget - 2].Status}
                    Files={this.state.CommentsTaskList[this.state.CommentTarget - 2].Files}
                    TaskActivityFields={this.state.CommentsTaskList[this.state.CommentTarget - 2].TaskActivity.Fields}
                    Strings={this.state.Strings}
                    TaskID={this.state.CommentsTaskList[this.state.CommentTarget - 2].TaskInstanceID}
                    oneBox={true}
                    index={5000}
                    margin={0}
                />)}

                {(this.state.commentList != undefined) && (this.state.commentList.map((comment, index, array) => {
                    if ((array[index].Status == 'submitted') || (array[index].UserID == this.props.UserID)) {
                        if ((index + 1) < array.length) {
                            return (
                                  <CommentComponent
                                    key={comment.CommentsID}
                                    Comment={comment}
                                    Update={this.getCommentData.bind(this)}
                                    CurrentUser={this.props.UserID}
                                    NextParent={array[index + 1].Parents}
                                    NextStatus={array[index + 1].Status}
                                    UserType={this.props.UserType}
                                    Admin={this.props.Admin}
                                    ref={(CommentComponent) => { this[comment.CommentsID] = CommentComponent;}}
                                    scroll={this.showSingleComment.bind(this)}
                                    Emphasize={(this.state.EmphasizeID == comment.CommentsID) ? true : false}
                                    CommentTargetList={this.state.CommentTargetList}
                                    />
                            );}
                        else {
                            return (
                                <CommentComponent
                                  key={comment.CommentsID}
                                  Comment={comment}
                                  Update={this.getCommentData.bind(this)}
                                  CurrentUser={this.props.UserID}
                                  NextParent={null}
                                  UserType={this.props.UserType}
                                  Admin={this.props.Admin}
                                  ref={(CommentComponent) => { this[comment.CommentsID] = CommentComponent;}}
                                  scroll={this.showSingleComment.bind(this)}
                                  Emphasize={(this.state.EmphasizeID == comment.CommentsID) ? true : false}
                                  CommentTargetList={this.state.CommentTargetList}
                                  />
                            );
                        }
                    }
                }))}

                {this.state.CommentTarget != undefined &&
                  (<div id = "nc">
                    <CommentEditorComponent
                      UserID={this.props.UserID}
                      Update={this.getCommentData.bind(this)}
                      ReplyLevel={0}
                      Parents={null}
                      CommentTarget={this.state.CommentTargetList[this.state.CommentTarget].Target}
                      TargetID={this.state.CommentTargetList[this.state.CommentTarget].ID}
                      AssignmentInstanceID={this.state.AssignmentInstanceID}
                      TaskID={this.props.TaskID}
                      CommentTargetList={this.state.CommentTargetList}
                      CommentTargetOnList={this.state.CommentTarget}
                      Emphasize={false}
                    />
                  </div>)
                }

                    </TabPanel>

                </Tabs>

            </div>
        );
    }
}

export default TemplateContainer;
