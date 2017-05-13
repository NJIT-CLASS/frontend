import React from 'react';
import Reactable from 'reactable';
import request from 'request';
import Select from 'react-select';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/constants';
import InfoModal from './info-modal';
import Strings from './strings.js';

class Frames extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Workflows: null,
            DataLoaded: false,
            ShowContent: true,
            SelectedStudent: '',
            SelectedStatus: '',
            SelectedTask: '',
            SelectedWorkflow: '',
            SelectedSubWorkflow: '',
            ShowModal: false,
            ModalInfo: {},
            Strings: Strings
        };
    }

    componentWillMount() {

        this.props.__(Strings, newStrings => {
            this.setState({
                Strings: newStrings
            });
        });
        const options = {
            method: 'GET',
            uri: `${this.props.apiUrl}/api/getAssignmentRecord/${this.props.AssignmentID}`,
            json: true,
        };

        const colors = { 'In Progress': '#ffffff',
            Complete: '#80ff80',
            Late: '#ff1a1a',
            'Not Needed': '#ffff66',
            'Inactive:': '#d9d9d9' };

        request(options, (err, res, body) => {
            console.log(err, res, body);
            this.setState(
                { Workflows: body.AssignmentRecords,
                    DataLoaded: true,
                    Info: body.Info,
                    WorkflowArray: body.Workflows,
                }
          );
        });
    }

    studentDropdownChange(val) {
        this.setState({
            SelectedStudent: val,
        });
    }

    StatusDropdownChange(val) {
        this.setState({
            SelectedStatus: val,
        });
    }

    TaskDropdownChange(val) {
        this.setState({
            SelectedTask: val,
        });
    }

    WorkflowDropdownChange(val) {
        this.setState({
            SelectedWorkflow: val,
        });
    }

    SubWorkflowDropdownChange(val) {
        this.setState({
            SelectedSubWorkflow: val,
        });
    }

    render() {
        if (!this.state.DataLoaded) {
            return (<div />);
        }
        const strings = this.state.Strings;


        const colors = { Incomplete: 'incomplete',
            complete: 'complete',
            Late: 'late',
            'Not Needed': 'not-needed',
            not_yet_started: 'not-yet-started',
            started: 'started',
            automatic: 'automatic',
        };
        const background = { backgroundColor: '#F3F3F4', borderColor: '#bfbfbf' };

        const letters = {
            Incomplete: '(I)',
            complete: '(C)',
            Late: '(!)',
            'Not Needed': '(X)',
            not_yet_started: '(NS)',
            started: '(S)',
            automatic: '(A)',
        };
        const style1 = { tableLayout: 'fixed' };

        let Table = Reactable.Table,
            Tr = Reactable.Tr,
            Td = Reactable.Td;
        let count = 0;
        let WorkflowIDDisplayed = [];
        const NumberofWorkflow = 0;
        let IndexforWorkflow = 0;

        const modalView = this.state.ShowModal ? (
          <InfoModal {...this.state.ModalInfo} Show={this.state.ShowModal} modalToggle={() => {this.setState({ShowModal: !this.state.ShowModal});}}/>
        ) : null;

        const table = this.state.Workflows.map(function (workflow, index) {
            if (index === 0) {
                WorkflowIDDisplayed = [];
            }
            if (this.state.SelectedWorkflow.label == strings.all) {
                this.state.SelectedWorkflow = '';
            }
            count = 0;

            const cols = workflow.map(function (task) {
                const link = `/task/${task.TaskInstanceID}?` + `courseId=${this.state.Info.Assignment.CourseID}&sectionId=${this.state.Info.SectionID.SectionID}`;
                const modalOptions = {
                    TA_Type: task.TaskActivity.Name,
                    StudentName: task.User.UserName,
                    TaskStatus: task.Status,
                    TaskID: task.TaskInstanceID,
                    TaskUserHistory: JSON.parse(task.UserHistory),
                    Link: link,
                    UserRole: task.User.UserType,
                    Strings: strings
                };
                console.log(modalOptions);
                const taskCellDiv = (
                  <td key={`Col for ${task.TaskInstanceID}`} className={`ColLineColor ${colors[task.Status]}`}>
                    <a key={`link for ${task.TaskInstanceID}`} href={link}>
                      {task.User.UserName}
                      <br key={`break one for ${task.TaskInstanceID}`} />
                      <h6> User ID: {task.User.UserID}
                      <br key={`break two for ${task.TaskInstanceID}`} />
                        Task ID: {task.TaskInstanceID}
                      </h6>
                    </a>
                    {letters[task.Status]}
                  </td>
                );

                //modal style link view
                /*const taskCellDiv = (
                  <td key={`Col for ${task.TaskInstanceID}`} className={`ColLineColor ${colors[task.Status]}`}>
                    <div key={`link for ${task.TaskInstanceID}`}
                          onClick={()=>{
                              this.setState({
                                  ShowModal: true,
                                  ModalInfo:modalOptions
                              });
                          }}
                      >
                      {task.User.UserName}
                      <br key={`break one for ${task.TaskInstanceID}`} />
                      <h6> User ID: {task.User.UserID}
                      <br key={`break two for ${task.TaskInstanceID}`} />
                        Task ID: {task.TaskInstanceID}
                      </h6>
                    </div>
                    {letters[task.Status]}
                  </td>
                );*/



                if (this.state.SelectedTask.label === strings.all) {
                    this.state.SelectedTask = '';
                }

                if (this.state.SelectedStudent.label === strings.all) {
                    this.state.SelectedStudent = '';
                }

                if (this.state.SelectedStatus.label === strings.all) {
                    this.state.SelectedStatus = '';
                }

        /* When nothing is Selected show the table*/
                if ((this.state.SelectedStudent === '') && (this.state.SelectedStatus === '') && (this.state.SelectedTask === '')) {
                    return (taskCellDiv);
                }

        /* filtering by student,status, and task. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) && (task.Status == this.state.SelectedStatus.label) && (task.TaskActivity.Type == this.state.SelectedTask.label)) {
                    if (WorkflowIDDisplayed[0] == null) {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                    } else {
                        WorkflowIDDisplayed.forEach((WorkflowIDDisplayedList) => {
                            if (WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1) {
                                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                            }
                        }, this);
                    }

                    return (taskCellDiv);
                }

        /* filtering by student and status. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) && (task.Status == this.state.SelectedStatus.label)) {
                    if (((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != '')) {
                        count++;
                        return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
                    }

                    if (WorkflowIDDisplayed[0] == null) {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                    } else {
                        WorkflowIDDisplayed.forEach((WorkflowIDDisplayedList) => {
                            if (WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1) {
                                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                            }
                        }, this);
                    }

                    return (taskCellDiv);
                }

        /* filtering by task and status */
                else if ((task.TaskActivity.Type == this.state.SelectedTask.label) && (task.Status == this.state.SelectedStatus.label)) {
                    if (((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != '')) {
                        count++;
                        return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
                    }

                    if (WorkflowIDDisplayed[0] == null) {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                    } else {
                        WorkflowIDDisplayed.forEach((WorkflowIDDisplayedList) => {
                            if (WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1) {
                                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                            }
                        }, this);
                    }

                    return (taskCellDiv);
                }

        /* filtering by student and task. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) && (task.TaskActivity.Type == this.state.SelectedTask.label)) {
                    if (((this.state.SelectedStudent !== '') && (this.state.SelectedStatus !== '')) && (this.state.SelectedTask != '')) {
                        count++;
                        return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
                    }

                    if (WorkflowIDDisplayed[0] == null) {
                        WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                    } else {
                        WorkflowIDDisplayed.forEach((WorkflowIDDisplayedList) => {
                            if (WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1) {
                                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                            }
                        }, this);
                    }

                    return (taskCellDiv);
                }

        /* filtering by one of student,status, or task. */
                else if ((task.User.UserName == this.state.SelectedStudent.label) || (task.Status == this.state.SelectedStatus.label) || (task.TaskActivity.Type == this.state.SelectedTask.label)) {
                    if (((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) && (this.state.SelectedTask != '')) {
                        count++;
                        return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
                    } else if (((this.state.SelectedStudent != '') && (this.state.SelectedStatus != '')) || ((this.state.SelectedStudent != '') && (this.state.SelectedTask != '')) || ((this.state.SelectedStatus != '') && (this.state.SelectedTask != ''))) {
                        count++;
                        return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
                    }

                    if (WorkflowIDDisplayed[0] == null) {
                        WorkflowIDDisplayed[0] = task.WorkflowInstanceID;
                    } else {
                        WorkflowIDDisplayed.forEach((WorkflowIDDisplayedList) => {
                            if (WorkflowIDDisplayed.indexOf(task.WorkflowInstanceID) == -1) {
                                WorkflowIDDisplayed[index] = task.WorkflowInstanceID;
                            }
                        }, this);
                    }

                    return (taskCellDiv);
                }

                count++;
                return (<td key={`Col for ${task.TaskInstanceID}`} className="EmptyCell" />);
            }, this);

            if (count === workflow.length) {
                IndexforWorkflow++;
                count = 0;
                return (<tr key={`Row for ${workflow[0].TaskInstanceID}`} className="DisplayNone"> {cols}</tr>);
            } else if (this.state.SelectedWorkflow == '' || this.state.SelectedWorkflow.label == strings.all) {
                IndexforWorkflow = 0;
                count = 0;
                return (<tr key={`Row for ${workflow[0].TaskInstanceID}`} className="EmptyCell"> {cols}</tr>);
            } else if (workflow[0].WorkflowInstanceID == this.state.SelectedWorkflow.label) {
                count = 0;
                WorkflowIDDisplayed[0] = workflow[0].WorkflowInstanceID;
                return (<tr key={`Row for ${workflow[0].TaskInstanceID}`} className="EmptyCell"> {cols}</tr>);
            }
            IndexforWorkflow++;
        }, this);

        if (this.state.SelectedWorkflow != '') {
            WorkflowIDDisplayed = [];
            WorkflowIDDisplayed[0] = this.state.SelectedWorkflow.label;
            if (IndexforWorkflow == this.state.Workflows.length) {
                WorkflowIDDisplayed = [];
            }
        }

        const WorkflowIDTable = this.state.Workflows.map(function (WorkflowTable, index) {
            const WorkflowIDCol = WorkflowTable.map((WorkflowID, index) => {
                if (index == 0) {
                    return (<td key={'Col for WorkflowTable'} className="EmptyCell"> <br /> <h1> {WorkflowID.WorkflowInstanceID} </h1> <br /> <br /> </td>);
                }
            }, this);

            if (WorkflowIDDisplayed[0] == strings.all) {
                return (<tr key={`Row for ${index}`}> {WorkflowIDCol} </tr>);
            }
            if ((this.state.SelectedWorkflow == '' || this.state.SelectedTask == strings.all) && this.state.SelectedTask == '' && this.state.SelectedStatus == '' && this.state.SelectedStudent == '') {
                return (<tr key={`Row for ${index}`}> {WorkflowIDCol} </tr>);
            } else if (WorkflowIDDisplayed[index] == WorkflowTable[0].WorkflowInstanceID) {
                return (<tr key={`Row for ${index}`}> {WorkflowIDCol} </tr>);
            } else if (this.state.SelectedWorkflow != '') {
                if (WorkflowIDDisplayed[0] == WorkflowTable[0].WorkflowInstanceID) {
                    return (<tr key={`Row for ${index}`}> {WorkflowIDCol} </tr>);
                }
            }
        }, this);

        const TaskActivityTypeTable = this.state.Workflows[0].map(type => (<td key={type.TaskActivity.Type} style={background}> {type.TaskActivity.Type} </td>), this);

        const Students = [];
        this.state.Workflows.forEach(function (StudentNamesList) {
            StudentNamesList.forEach((StudentNames) => {
                if (Students.indexOf(StudentNames.User.UserName) == -1) {
                    Students.push(StudentNames.User.UserName);
                }
            }, this);
        }, this);

        const OptionsListStudents = [];
        OptionsListStudents.push({ value: '', label: strings.all });
        Students.forEach((Options) => {
            OptionsListStudents.push({ value: Options, label: strings.Options });
        }, this);

        const Status = [];
        this.state.Workflows.forEach(function (StatusNamesList) {
            StatusNamesList.forEach((StatusNames) => {
                if (Status.indexOf(StatusNames.Status) == -1) {
                    Status.push(StatusNames.Status);
                }
            }, this);
        }, this);

        const OptionsListStatus = [];
        OptionsListStatus.push({ value: '', label: strings.all });

        Status.forEach((Options) => {
            OptionsListStatus.push({ value: Options, label: strings.Options });
        }, this);


        const Task = [];
        this.state.Workflows.forEach(function (TaskNamesList) {
            TaskNamesList.forEach((TaskNames) => {
                if (Task.indexOf(TaskNames.TaskActivity.Type) == -1) {
                    Task.push(TaskNames.TaskActivity.Type);
                }
            }, this);
        }, this);

        const OptionsListTask = [];
        OptionsListTask.push({ value: '', label: strings.all });

        Task.forEach((Options) => {
            OptionsListTask.push({ value: Options, label: strings.Options });
        }, this);

        const OptionsListWorkflow = [];
        OptionsListWorkflow.push({ value: '', label: strings.all });

        this.state.WorkflowArray.forEach((Options) => {
            OptionsListWorkflow.push({ value: Options, label: strings.Options });
        }, this);

        const OptionsListSubWorkflow = [];
        OptionsListSubWorkflow.push({ value: '', label: strings.all });

    // NEED to add more to the Subworkflow
        return (
          <div>
            {modalView}
            <h6> <b> {strings.Course}: </b> {`  ${this.state.Info.Course.Name}`} </h6>
            <h6> <b> {strings.Section}: </b> {this.state.Info.SectionID.SectionID} </h6>
            <h6> <b> {strings.Semester}: </b> {this.state.Info.Assignment.SemesterID} </h6>
            <br />
            <br />
            <h1> <b> {strings.Legend} </b> </h1>
            <br />
            <table>
              <tbody>
                <tr>
                  <td className={`TableWidth ${colors.complete}`}> {strings.Complete} (C) </td>
                  <td className={`TableWidth ${colors.started}`}> {strings.Started} (S) </td>
                  <td className={`TableWidth ${colors.Late}`}> {strings.Late} (!) </td>
                  <td className={`TableWidth ${colors.not_yet_started}`} > {strings.Not_yet_started} (NS) </td>
                  <td className={`TableWidth ${colors['Not Needed']}`}> {strings.Not_Needed} (X) </td>
                  <td className={`TableWidth ${colors.Incomplete}`}> {strings.Incomplete} (I) </td>
                  <td className={`TableWidth ${colors.automatic}`}> {strings.Automatic} (A) </td>
                </tr>
              </tbody>
            </table>
            <br />

            <div className="section">
              <h2 className="title" onClick={() => { this.setState({ ShowContent: !this.state.ShowContent }); }}> <b> {this.state.Info.Assignment.DisplayName} </b> </h2>
              <div className={this.state.ShowContent ? 'section-content' : 'task-hiding'}>
                <h6> <b> {strings.FilterBy}: </b> </h6>
                <br />

                <table className="TableFilterStyle">
                  <tbody>
                    <tr className="TableFilterStyle">
                      <td className="TableFilterStyle">
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
                      <td className="TableFilterStyle">
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
                      <td className="TableFilterStyle">
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
                      <td className="TableFilterStyle">
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
                      <td className="TableFilterStyle">
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
                    <div className="WholeTableStyleLeft">
                      <table>
                        <tbody>
                          <tr>
                            <td className="EmptyCell"> <h6> {strings.WorkflowID} </h6> </td>
                          </tr>
                          {WorkflowIDTable}
                        </tbody>
                      </table>
                    </div>
                    <div className="WholeTableStyleRight">
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
        );
    }
}
// TaskStatus by Krzysztof Andres.
export default Frames;
