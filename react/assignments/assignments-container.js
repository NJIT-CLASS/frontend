import React, {Component} from 'react';
import TableComponent from '../shared/tableComponent';
import apiCall from '../shared/apiCall';
import Select from 'react-select';

class Assignments extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            userID:props.UserID,
            loaded:false,
            assignments:null
        };
    }

    componentWillMount(){
        apiCall.get(`/SectionsByUser/${this.state.userID}`, (err, res, body) => {
            console.log(body.Sections);
            var allAssignments = [];
            var sections = body.Sections;
            sections.map(section => {

                apiCall.get(`/section/info/${section.SectionID}`, (err, res, body) => {
                    var assignmentsForSection = body.OngoingAssignments.map(assignment=>{
                        return {
                            "assignmentName":assignment.DisplayName,
                            "assignmentId":assignment.AssignmentInstanceID,
                            "courseNumber":section.Section.Course.Number,
                            "courseName":section.Section.Course.Name,
                            "sectionName":section.Section.Name
                        };
                    });

                    allAssignments.push(...assignmentsForSection);

                    if(sections[ sections.length - 1].SectionID === section.SectionID){
                        this.setState({assignments:allAssignments,loaded:true});
                    }
                });
            });
        });
    }

    makeLink({original, row, value}){
        return <a  href={`/assignment-record/${original.assignmentId}`}>{value}</a>;
    }

    render(){

        if(!this.state.loaded){
            return (
                <div className="placeholder center-spinner">
                    <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>
                </div>
            );
        }

        console.log(this.state.assignments);
        var tableData = [{"assignmentName":"test assignment","courseName":"test course"}];
        return (
            <div id="assignmments-page-container" style={{width:"100%"}}>
                <div className="section">
                    <div className="block-container">
                        <h2 className="title">Active Assignments</h2>
                        <TableComponent
                        data={this.state.assignments}
                        columns={[
                            {
                                Header: "Active Assignments",
                                accessor: 'assignmentName',
                                Cell:this.makeLink
                            },
                            {
                                Header: "Course Name",
                                accessor: 'courseName'
                            },
                            {
                                Header: "Course Number",
                                accessor: 'courseNumber'
                            },
                            {
                                Header: "Section Name",
                                accessor: 'sectionName'
                            }
                        ]}
                        noDataText={"No assignments"}
                        />
                    </div>  
                </div>
            </div>
        );
    }

}

export default Assignments;