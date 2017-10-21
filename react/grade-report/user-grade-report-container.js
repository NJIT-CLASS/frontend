import React from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import Popup from '../shared/modal';

class GradeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentGrades: {},
            UserList: [],
            AssignmentInstanceInfo: {},
            Strings: strings,
            viewComments: false,
            comment: '',
            Loaded: false,
        
        };
    }

    componentDidMount() {
        this.fetchGrades(this.props);
    }

    fetchGrades(props){
        apiCall.postAsync(`/getAssignmentGrades/${props.AssignmentID}`, {}).then(body => {

            this.setState({
                AssignmentGrades: body.data,
                UserList: body.data.SectionUsers,
                AssignmentInstanceInfo:body.data.AssignmentInstance,
                Loaded: true,
            });
        });
    }

    displayPopup(){
        this.setState({
            viewComments: true,
            comment: 'Hello'
        })
    }

    closePopup(){
        this.setState({
            viewComments: false,
            comment: ''
        })
    }


    render(){
        let {Loaded, Strings, UserList, AssignmentInstanceInfo, viewComments, comment} = this.state;
        
        if(!Loaded){
            return <div></div>;
        }

        let User = {};
        let ai = AssignmentInstanceInfo;
        let taskActivity = {};
        let commentModal = null;



        if(viewComments){
            commentModal = (
                <Popup title="Comments" outsideClick={true} children={comment} close={this.closePopup.bind(this)}  />
            )
        }

        
        const userTaskGradesView = UserList.map( user => {

            if(!user.assignmentGrade){
                return null;
            }

            const workflowActivityGradesView = user.assignmentGrade.WorkflowActivityGrades.map(waGrade => {

                const taskGrades = waGrade.WorkflowActivity.users_WA_Tasks.map(task => {
                    //let comments = task.assignmentGrade.Comments;

                    return (
                        <tr>
                            <td data-label={Strings.UserName}>
                                <a href="">{user.User.LastName}, {user.User.FirstName}<br/>{user.User.UserContact.Email}</a>
                            </td>
                            <td data-label={Strings.Task}>{task.taskActivity.Name}</td>
                            <td data-label={Strings.CompletenessGrade}>{/*task.taskSimpleGrade.Grade*/}%</td>
                            <td data-label={Strings.QualityGrade}>{task.FinalGrade}%</td>
                            <td data-label={Strings.CombinedWeight}>{task.taskGrade.Weight}</td>
                            <td data-label={Strings.WeightedGrade}>{task.taskGrade.weightedGrade}%</td>
                            <td data-label={Strings.Comments}><button type="button" onClick={this.displayPopup.bind(this)}>View</button></td>
                        </tr>
                    );

                });

                return taskGrades;
            });

            return workflowActivityGradesView;
        });

        
        let userListView = UserList.map( user => {
            //handle the case where there are no grades yet
            let assignmentGrade = {
                SimpleGrade: '',
                QualityGrade: '',
                Grade: '',
                Comments:''

            };

            if(user.assignmentGrade){
                assignmentGrade = user.assignmentGrade;
            }
           
            if(!user.User){
                return null;
            }

            //let comment = assignmentGrade.Comments;
            
            return <tr>
                <td data-label={Strings.Email}>{user.User.UserContact.Email}</td>
                <td data-label={Strings.LastName}>{user.User.LastName}</td>
                <td data-label={Strings.FirstName}>{user.User.FirstName}</td>
                <td data-label={Strings.CompletenessGrade}>{assignmentGrade.SimpleGrade}%</td>
                <td data-label={Strings.QualityGrade}>{assignmentGrade.QualtiyGrade}%</td>
                <td data-label={Strings.Grade}>{assignmentGrade.Grade}%</td>
                <td data-label={Strings.Comments}><button type="button" onClick={this.displayPopup.bind(this)}>View</button></td>
                <td data-label={Strings.ECCompletenessGrade}>{assignmentGrade.SimpleGrade}%</td>
                <td data-label={Strings.ECQualtiyGrade}>{assignmentGrade.QualtiyGrade}%</td>
                <td data-label={Strings.ECGrade}>{assignmentGrade.Grade}%</td>
                <td data-label={Strings.ECComments}><button type="button" onClick={this.displayPopup.bind(this)}>View</button></td>
            </tr>;
        }
        );
        return (
            <div>
                {commentModal}
                <form name="assignmentGradeList" role="form" className="section sectionTable" method="POST" action="#">
                    <h2 className="title">{Strings.AssignmentGrades}</h2>
                    <div className="section-content">

    	            	<div className="col-xs-9">

                            <table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                                <thead>
                                    <tr>
                                        <th colSpan="3">{Strings.StudentInformation}</th><th colSpan="4">{Strings.RegularTasks}</th><th colSpan="4">{Strings.ExtraCreditTasks}</th>
                                    </tr>
                                    <tr>
                                        <th>{Strings.Email}</th><th>{Strings.LastName}</th><th>{Strings.FirstName}</th>
                                        <th>{Strings.Total}<br/>{Strings.CompletenessGrade}</th><th>{Strings.Total}<br/>{Strings.QualityGrade}</th><th>{Strings.FinalGrade}</th><th>{Strings.Comments}</th>
                                        <th>{Strings.CompletenessGrade}</th><th>{Strings.Total}<br/>{Strings.QualityGrade}</th><th>{Strings.FinalGrade}</th><th>{Strings.Comments}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userListView}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </form>

                <form name="detailedAssignmentGradeList" role="form" className="section sectionTable" method="POST" action="#">
                    <h2 className="title">{Strings.AssignmentGrades}</h2>
                    <div className="section-content">
                        <h3 className="title">{ai.Section.Course.Number} - {ai.Section.Name} - {ai.Section.Course.Name}<br/>
                            {Strings.Assignment} - {ai.Assignment.DisplayName}</h3>
                        <h4 className="title">  {Strings.InstructorReport}</h4>

                        <div className="col-xs-7">

                            <table width="80%" className="sticky-enabled tableheader-processed sticky-table">
                                <thead>
                                    <tr><th>{Strings.Student}<br/>{Strings.Email}</th>
                                        <th>{Strings.Task}</th><th>{Strings.CompletenessGrade}</th><th>{Strings.QualityGrade}</th>
                                        <th>{Strings.CombinedWeight}</th><th>{Strings.WeightedGrade}</th><th>{Strings.Comments}</th></tr>
                                </thead>
                                <tbody>
                                    {userTaskGradesView}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default GradeReport;
