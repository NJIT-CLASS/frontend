import React from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import ReactTable from 'react-table';
import Collapsible from 'react-collapsible';
import TableComponent from '../shared/tableComponent';


class StudentGradeReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            userID: props.UserID,
            sections:[],
        };
    }

    componentDidMount() {
        this.getSections(this.state.userID);
    }

    getSections(userID){
        //Add 'SectionID' field to Section model at corresponding endpoint
            apiCall.get(`/getActiveEnrolledCourses/${this.state.userID}`,{},(err,status,body)=>{
                if(status.statusCode === 200){
                    body.Courses.forEach(course=>{
                        if(course.Role=="Student"){
                            course.Section["assignments"]=[];
                            this.state.sections.push(course.Section);
                        }
                    });
                    this.getAssignments();
                }
            });
    }

    getAssignments(){
        var numSections = this.state.sections.length;
        var index=0;
        if(numSections === 0){
            this.setState({loaded:true});
            return;
        }

        this.state.sections.forEach(section=>{  
            var sectionID = section.SectionID;
            apiCall.get(`/getActiveAssignmentsForSection/${sectionID}`,{},(err,status,body)=>{
                if(body.Assignments.length != 0){
                    this.state.assignments[index++]=body.Assignments;
                } else {
                    this.state.assignments[index++]=[];
                }
                if(index === numSections){
                    console.log(this.state.sections);
                    //this.setState({loaded:true});
                }
            });
        });        
    }

    assignmentOnClick(){

    }

    render(){
        let sections = this.state.sections;
        let assignments = this.state.assignments;
        let assignmentDetails = this.state.assignmentDetails;
        let loaded = this.state.loaded;
        let loadedAssignmentDetails = this.state.loadedAssignmentDetails;
        let loadedOverviewDetails = this.state.loadedOverviewDetails;
        let tableView = (<ReactTable 
                        defaultPageSize={10}
                        className="-striped -highlight"
                        resizable={true}
                        columns={[
                        {
                            Header: "",
                            accessor: 'Assignment',
                        },
                        {
                            Header: "",
                            accessor: 'Type'
                        },
                        {         
                            Header: "",
                            accessor: 'Course',
                        },{
                            Header: "",
                            accessor: 'Date',
                        }
                    ]} noDataText="Please choose an assignment or overview"/>);

        //Make sure component has loaded
        if(!loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        //Build table for assignment Details
        if(loadedAssignmentDetails){

            


        } //Build table for overview details
        else if(loadedOverviewDetails){

        }

        //Building course and assignment list
        let dropDownContents = sections.map(section=>{

            var sectionName = section.Section.Course.Number + "  "+ section.Section.Name+"  " + section.Section.Course.Name;
            var sectionID = section.SectionID;
            var sectionAssignments = assignments[sectionID];

            let nestedContents = sectionAssignments.map(assignment => {
                return(<li className="select-class-element"><a href="#" onClick={this.assignmentOnClick.bind(this,assignment.AssignmentInstanceID)}>{assignment.Assignment.DisplayName}</a></li>);
            });

            var overview = (<li className="select-class-element"><a href="#">Overview</a></li>);

            return(<Collapsible trigger={sectionName} transitionTime={200} className="select-class" openedClassName="select-class">
                {overview}
                {nestedContents}
                </Collapsible>
            )
        });

        //Actual Content returned
        return(
                <form name="grade_report" role="form" className="section" method="post">
                    <div className="section-content">
                        <div className="section">
                            <h2 className="title">Select Assignment:</h2>
                            <div className="section-content">

                                {dropDownContents}
                            </div>
                        </div>
                        <div className="section card-2 sectionTable">
                            <h2 className="title">Assignment Details</h2>
                            <div className="section-content">
                                {tableView}
                            </div>
                        </div>
                    </div>
                </form>
        );
    }
}

export default StudentGradeReport;
