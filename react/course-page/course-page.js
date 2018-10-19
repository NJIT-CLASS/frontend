import React, {Component} from 'react';
import request from 'request';
import apiCall from '../shared/apiCall';
import { ROLES, canRoleAccess } from '../../server/utils/react_constants';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Modal from "../shared/modal";

const async = require('async');

class CoursePage extends Component{

    constructor(props){
        super(props);
        this.state = {
            userID:props.UserID,
            role:props.Role,
            courseId:props.CourseID,
            copyToCourseID:null,
            showModal:false,
            modalContent:null,
            pageData:null,
            loaded:false
        };
    }

    componentWillMount(){

        let coursesUrl = '/course/';
        if(this.state.role === ROLES.PARTICIPANT){
            coursesUrl = '/getActiveEnrolledSections/';
        }
        apiCall.get(`${coursesUrl}${this.state.courseId}?studentID=${this.state.userID}`, {},(err, statusCode, body) =>{
            const sectionIDsArray = body.Sections.filter(section => {return section.SectionID;});

            apiCall.get('/getAssignments/' + this.state.courseId,{}, (err, statusCode, assignmentsBody) => {
                let assignmentsArray = [];
                apiCall.get(`/partialAssignments/all/${this.state.userID}?courseId=${this.state.courseId}`,{}, (err,statusCode, partialAssignmentsBody) => {


                    assignmentsArray =  assignmentsBody.Assignments;
                    var sectionList = [];
                    var apiCalls = {};
                    let sectionAssignmentsCalls = {};

                    for (var i=0; i<body.Sections.length; i++){

                        sectionList.push(body.Sections[i]);
                        sectionAssignmentsCalls[body.Sections[i].SectionID] = apiCall.get.bind(this, '/getActiveAssignmentsForSection/' + body.Sections[i].SectionID, {});
                        apiCalls[body.Sections[i].SectionID] = apiCall.get.bind(this,'/course/getsection/' + body.Sections[i].SectionID, {});

                    }

                    async.parallel(apiCalls, (err, results)=>{
                        async.parallel(sectionAssignmentsCalls, (err2,assignmentResults) => {
                            for(var i=0; i<sectionList.length; i++){
                                var currentSectionId = sectionList[i].SectionID;
                                sectionList[i].members=results[currentSectionId][1].UserSection;
                                sectionList[i].instructors = results[currentSectionId][1].UserSection.filter(member => {
                                    return member.Role === 'Instructor';
                                });
                                sectionList[i].students = results[currentSectionId][1].UserSection.filter(member => {
                                    return member.Role === 'Student';
                                });
                                sectionList[i].observers = results[currentSectionId][1].UserSection.filter(member => {
                                    return member.Role === 'Observer';
                                });
                                sectionList[i].assignments = assignmentResults[currentSectionId][1].Assignments;

                            }
                            console.log(body);
                            let instructOrAdmin = canRoleAccess(this.state.role, ROLES.TEACHER);
                            let isInstructor = this.state.role === ROLES.TEACHER;
                            this.state.pageData = {
                                "showHeader":false,
                                "sectionList": sectionList,
                                "courseID": this.state.courseId,
                                "partialAssignments": partialAssignmentsBody.PartialAssignments,
                                "assignmentsList": assignmentsArray,
                                "instructor": isInstructor,
                                "instructorOrAdmin": instructOrAdmin,
                                "courseTitle": body.Course.Name,
                                "courseNumber": body.Course.Number,
                                "courseDescription": body.Course.Description
                            };
                            console.log(this.state.pageData);
                            this.setState({loaded:true});
                        });
                    });
                });
            });
        });
    }
 
    duplicateAssignment(e, data){
        console.log(data.partialAssignmentId);

        apiCall.get(`/partialAssignments/duplicate/${data.partialAssignmentId}`,{},(err, statusCode, body)=>{
            console.log(err);
            console.log(statusCode);
            console.log(body);
        });
    }

    copyAssignmentToAnotherCourse(e, data){
        console.log("copy to another course");
        var modalContent = null;
        apiCall.get(`/getCourses`,{},(err, statusCode, body)=>{

            modalContent = (
                <div><label>Select Course</label>
                <select onChange={this.updateCourseID.bind(this)}>
                    {body.Courses.map(course=>{
                        return (<option value={course.CourseID}>{course.Name}</option>)
                    })}
                </select>
                <button onClick={this.copyCourse.bind(this,data.partialAssignmentId)}>Submit</button>
                </div>
            );
            this.setState({showModal:true,modalContent:modalContent});
        });
    }

    copyCourse(partialAssignmentId){
        console.log(partialAssignmentId);
        console.log(this.state.copyToCourseID);
        apiCall.get(`/partialAssignments/duplicate/${partialAssignmentId}/${this.state.copyToCourseID}`,{},(err, statusCode, body)=>{
            console.log(err);
            console.log(statusCode);
            console.log(body);
        });

    }

    updateCourseID(e){
        console.log(e.currentTarget.value);
        this.setState({copyToCourseID:e.currentTarget.value});
    }
    

    render(){

        if(!this.state.loaded){
            return(<div className="placeholder center-spinner">
            <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
          </div>);
        }

        // Create course assignments section
        let courseAssignments = null;
        if(this.state.pageData.instructorOrAdmin && this.state.pageData.assignmentsList){
            courseAssignments = (<div className="section">
            <h2 className="title">Course Assignments</h2>
            <div className="section-content">
            <div className="col-xs-6">
                    <ul className="list-group">
                        {this.state.pageData.assignmentsList.map(assignment =>{
                            return (                      
                                <li className="list-group-item">
                                    <a href={`/assign-to-section/${assignment.AssignmentID}?courseId=${assignment.CourseID}`}>{assignment.Name}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            </div>);
        }

        // Create active assignments section
        let activeAssignments = null;
        if(this.state.pageData.activeAssignments){
            activeAssignments = (<div className="section">
            <h2 className="title">Ongoing Assignments</h2>
            <div className="section-content">
                <div className="col-xs-6">
                  <ul className="list-group">
                    {this.state.pageData.activeAssignments.map(assignment =>{
                        return (
                        <li className="list-group-item">
                            <a href={`/assignment-record/${AssignmentID}`}>{assignment.DisplayName}</a>
                        </li>);
                    })}
                  </ul>
                </div>
            </div>
            </div>);
        }

        // Create partial assignments section
        let partialAssignments = null;
        if(this.state.pageData.partialAssignments){
            partialAssignments = (<div className="section">
                <h2 className="title">Saved Assignments</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <ul className="list-group">
                            {this.state.pageData.partialAssignments.map(assignment =>{
                                return (<li className="list-group-item">
                                    <ContextMenuTrigger id={`contextmenu-${assignment.PartialAssignmentID}`}>
                                        <a href={`/asa/${this.state.pageData.courseID}?partialAssignmentId=${assignment.PartialAssignmentID}`} onContextMenu={this.contextMenu}>{assignment.PartialAssignmentName}</a>
                                    </ContextMenuTrigger>
                                    <ContextMenu id={`contextmenu-${assignment.PartialAssignmentID}`}>
                                    <MenuItem data={{"partialAssignmentId":assignment.PartialAssignmentID}} onClick={this.duplicateAssignment.bind(this)}>
                                        <a>Create a copy for this course</a>
                                    </MenuItem>
                                    <MenuItem data={{"partialAssignmentId":assignment.PartialAssignmentID}} onClick={this.copyAssignmentToAnotherCourse.bind(this)}>
                                        <a >Copy to another course</a>
                                    </MenuItem>
                                    </ContextMenu>
                                </li>);
                            })}
                        </ul>
                    </div>
                </div>
            </div>);
        } 

        // Create add an assignment button
        let addAssignmentButton = null;
        if(this.state.pageData.instructor){
            addAssignmentButton = (  <div className="block-container">
            <div className="course-page assignment-button">
                <div className="section-button-area">
                  <div>
                    <a href={`/asa/${this.state.pageData.courseID}`}>
                        <button type="button" >Add an Assignment</button>
                    </a>
                  </div>
                </div>
            </div>
          </div>);
        }

        return (
            <div id="course-page-container">
                {this.state.showModal ? (<Modal children={this.state.modalContent}/>):null}
                <div className="block-container">
                    <div className="course_header">
                        <h2 className="title">{this.state.pageData.courseNumber} {this.state.pageData.courseTitle}</h2>
                        <div className="description">{this.state.pageData.courseDescription}</div>
                    </div>
                </div>

                <div className="block-container">
                    <div className="flex-container">
                        <div className="section">
                            <h2 className="title">Sections</h2>
                            <div className="section-content">
                                <ul className="list-group">
                                    {this.state.pageData.sectionList.map(section =>{
                                        var instructors = section.instructors.map(instructor=>{
                                            return instructor.User.FirstName +" "+instructor.User.LastName;
                                        }).join(", ");
                                        
                                        return (<li className="list-group-item"><a href={`/section/${section.SectionID}`}>{section.Name} - {section.Semester.Name} - {instructors}</a></li>);
                                    })}
                                </ul>
                            </div>
                        </div>
                        {courseAssignments}
                        {activeAssignments}
                        {partialAssignments}
                        {addAssignmentButton}
                    </div>
                </div>
            </div>

        );
    }
}

export default CoursePage;