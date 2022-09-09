import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import CourseSelectComponent from './SelectComponents/courseSelect';
import SectionSelectComponent from './SelectComponents/sectionSelect';
import AssignmentSelectComponent from './SelectComponents/assignmentSelect';
import SemesterSelectComponent from './SelectComponents/semesterSelect';
import Axios from 'axios';


class SelectAssignment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentID: -1,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
            WorkflowID: -1,
            Strings: {
                Course: 'Course',
                Semester: 'Semester',
                Assignment: 'Assignment',
                Section: 'Section'
            },
            loaded: false
        };

        this.selectAssignment = this.selectAssignment.bind(this);
        this.selectCourse = this.selectCourse.bind(this);
        this.selectSection = this.selectSection.bind(this);
        this.selectSemester = this.selectSemester.bind(this);
        this.selectWorkflow = this.selectWorkflow.bind(this);
    }

    /*componentDidMount() {
        this.props.__(this.state.Strings, newStrings => {
            this.setState({Strings: newStrings});
        });
    }*/

    selectCourse(e) {
        this.setState({
            CourseID: e.value
        });
    }

    selectSection(e) {
        this.setState({
            SectionID: e.value
        });
    }

    selectAssignment(e) {
        this.setState({
            AssignmentID: e.value
        });
    }
    selectSemester(e) {
        this.setState({
            SemesterID: e.value
        });
    }

    selectWorkflow(WorkflowID) {
        this.setState({ WorkflowID });
    }

    reinitializeAssignmentID() {
        this.setState({
            AssignmentID: -1
        });
    }
    // componentDidMount(){
    //     console.log("endpoint hit");
    //     // TODO: Need to finish endpoint for retrieving grades per section - currently only gets sections and returns debug info for each section
    //     apiCall.get(`/instructor/allAssignments/${this.props.UserID}`,(err,status,body)=>{
    //         console.log(body);

    //         this.setState({loaded:true});
    //     });
    // }


    // displayAssignmentGradeReport(GradeReportRoot){
    //     this.props.displayAssignmentGradeReport(GradeReportRoot);
    // }


    async displayAssignmentGradeReport(AssignmentID, SectionID) {
        let currentdate = new Date();
        let datetime = `${(currentdate.getMonth() + 1)}`.padStart(2, '0') + ''
            + `${currentdate.getDate()}`.padStart(2, '0') + ''
            + currentdate.getFullYear() + ''
            + `${currentdate.getHours()}`.padStart(2, '0') + ''
            + `${currentdate.getMinutes()}`.padStart(2, '0') + ''
            + `${currentdate.getSeconds()}`.padStart(2, '0');
        let assignmentIdentifier = ''; //assignment identifier
        let nameData = (await apiCall.getAsync(`/generalUser/${this.props.UserID}`));
        console.log(nameData);
        assignmentIdentifier = nameData.data.User.FirstName + ' ' + nameData.data.User.LastName + '_' +
            (await apiCall.getAsync(`/course/getSection/${this.state.SectionID}`)).data.result.Name + '_' +
            (await apiCall.getAsync(`/semester/${this.state.SemesterID}`)).data.Semester.Name + '_' +
            (await apiCall.getAsync(`/course/${this.state.CourseID}`)).data.Course.Name + '_' +
            (await apiCall.getAsync(`/getAssignmentRecord/${this.state.AssignmentID}`)).data.Info.Assignment.DisplayName;

        console.log(assignmentIdentifier);
        this.props.displayAssignmentGradeReport(AssignmentID, SectionID, assignmentIdentifier);
        // apiCall.get(`/course/getSection/${this.state.SectionID}`, (err,status,body)=>{
        //     apiCall.get(`/semester/${this.state.SemesterID}`, (err,status,body)=>{
        //         apiCall.get(`/getAssignmentRecord/${this.state.AssignmentID}`, (err,status,body)=>{
        //             a += body.Info.Course.Name + '_' + body.Info.Assignment.DisplayName;
        //             this.props.displayAssignmentGradeReport(AssignmentID, SectionID, a);
        //         });
        //         a += body.Semester.Name + '_';
        //     });
        //     a += datetime + '_' + body.result.Name + '_';
        // });
    }

    // loadData(AI_ID, section_id){
    //     let GradeReportRoot = null;
    //     apiCall.get(`/sectionUserInfo/${this.props.UserID}/${section_id}`, (err, res,body) => {
    //         console.log(body);
    //         console.log(body.Info);
    //         console.log(body.Info.Role);
    //         let SectionUserID = body.Info.SectionUserID;
    //         if (body.Info.Role === "Student"){
    //             apiCall.post(`/studentGradeReport`,{ai_id:AI_ID, sectionUserID:SectionUserID}, 
    //                 (err,status,body)=>{
    //                 if(status.statusCode === 200){
    //                     console.log(body);
    //                     GradeReportRoot = body.assignmentStudentGradeReport; 
    //                 }
    //             });
    //         } else if (body.Info.Role === "Instructor"){
    //             apiCall.post(`/gradeReport`,{ai_id:AI_ID},(err,status,body)=>{
    //                 if(status.statusCode === 200){
    //                     console.log(body);
    //                     GradeReportRoot = body.assignmentGradeReport;
    //                 }
    //             });
    //         }
    //     });
    //     this.displayAssignmentGradeReport(GradeReportRoot);
    // }

    undisplayAssignmentGradeReport() {
        this.setState({
            AssignmentID: -1,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
            WorkflowID: -1
        });
        this.props.undisplayAssignmentGradeReport();
    }

    render() {
        //let {Strings, loaded} = this.state;
        let { AssignmentID, CourseID, SemesterID, SectionID, Strings } = this.state;
        let buttonDisplay = null;
        if (AssignmentID != -1) {
            buttonDisplay = <div className="row">
                <button onClick={this.displayAssignmentGradeReport.bind(this, AssignmentID, SectionID)
                    /*this.loadData.bind(this, AssignmentID, SectionID)*/}>
                    Submit Selection
                </button>

                <button onClick={this.undisplayAssignmentGradeReport.bind(this)}>
                    Reset/Select New Assignment
                </button>


            </div>

        }



        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">Choose an assignment</h2>
                <div className="section-content">

                    <div className="col-xs-6">
                        <SemesterSelectComponent selectSemester={this.selectSemester}
                            SemesterID={SemesterID}
                            Strings={Strings}
                        />
                        <CourseSelectComponent selectCourse={this.selectCourse}
                            UserID={this.props.UserID}
                            Strings={Strings}
                            CourseID={CourseID}
                            SemesterID={SemesterID}
                        />
                        <SectionSelectComponent selectSection={this.selectSection}
                            UserID={this.props.UserID}
                            CourseID={CourseID}
                            SectionID={SectionID}
                            SemesterID={SemesterID}
                            Strings={Strings}
                        />
                        <AssignmentSelectComponent selectAssignment={this.selectAssignment}
                            SectionID={SectionID}
                            AssignmentID={AssignmentID}
                            Strings={Strings}
                        />
                    </div>
                    {buttonDisplay}

                </div>
            </div>
        );
    }
}

export default SelectAssignment;


//<a href="#" onClick={this.displayAssignmentGradeReport.bind(this, AssignmentID)}>Asg 82</a>
/*
buttonDisplay = <div className="col-xs-6">
            <ul>
                <button onClick={this.displayAssignmentGradeReport.bind(this, AssignmentID)}>
                   Submit Selection
                </button>
                    
               
            </ul>

        </div>


let submitButtonDisplay = null;
        let returnButtonDisplay = null;
        let buttonClicked = false;
        if (AssignmentID!=-1 && buttonClicked == false){
            
            submitButtonDisplay = <div className="col-xs-6">
            <ul>
                <button onClick={function (_event){
                    this.displayAssignmentGradeReport.bind(this, AssignmentID); 
                    submitButtonDisplay = null; 
                    buttonClicked = true}}>
                   Submit Selection
                </button>
                    
            </ul>
            

        </div>

        }

        if (buttonClicked){
            returnButtonDisplay =  <div className="col-xs-6">
            <ul>
                <button  onClick={() => {window.location.reload()}}>
                    Return
                </button>
                </ul>
            

            </div>
        
        }
*/