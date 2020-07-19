import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import EveryonesWorkContainer from '../everyones-work/everyonesWorkContainer';
import CourseSelectComponent from '../everyones-work/courseSelect';
import SectionSelectComponent from '../everyones-work/sectionSelect';
import AssignmentSelectComponent from '../everyones-work/assignmentSelect';
import SemesterSelectComponent from '../everyones-work/semesterSelect';


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
            loaded:false
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
    
    selectCourse(e){
        this.setState({
            CourseID: e.value
        });
    }

    selectSection(e){
        this.setState({
            SectionID: e.value
        });
    }

    selectAssignment(e){
        this.setState({
            AssignmentID: e.value
        });
    }
    selectSemester(e){
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

    displayAssignmentGradeReport(data){
        this.props.displayAssignmentGradeReport(data);

    }
    
    //undisplayAssignmentGradeReport(){
    //    this.props.undisplayAssignmentGradeReport();
    //}

    render(){
        //let {Strings, loaded} = this.state;
        let {AssignmentID, CourseID, SemesterID, SectionID, Strings} = this.state;
        let buttonDisplay = null;
        let buttonClicked = false;
        if (AssignmentID!=-1){
            
        buttonDisplay = <div className="col-xs-6">
            <ul>
                <button onClick={this.displayAssignmentGradeReport.bind(this, AssignmentID)}>
                   Submit Selection
                </button>
                    
                <button  onClick={() => {window.location.reload()}}>
                   Return
                </button>
            </ul>
            

        </div>
        
        }

        

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">Choose an assignment</h2>
                <div className="section-content">
                    
                <div className = "col-xs-6">
                        <SemesterSelectComponent selectSemester={this.selectSemester} 
                            SemesterID={SemesterID}
                            Strings={Strings}
                        />
                        <CourseSelectComponent selectCourse={this.selectCourse}
                            UserID={this.props.UserID}
                            Strings={Strings}
                            CourseID={CourseID}
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