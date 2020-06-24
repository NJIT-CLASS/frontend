import React from 'react';
import apiCall from '../shared/apiCall';


class SelectAssignment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Strings:null,
            loaded:false
        };
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

    render(){
        let {Strings, loaded} = this.state;

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">Choose an assignment</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <p>Weird and Wonderful Tech - MB1</p>
                        <ul>
                            <li><a href="#" onClick={this.displayAssignmentGradeReport.bind(this,11)}>Asg 81c - Scenario & Spreadsheet</a></li>
                        </ul>
                    </div>    
                </div>
            </div>
        );
    }
}

export default SelectAssignment;