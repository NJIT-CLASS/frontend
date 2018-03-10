import React from 'react';
import UpdatedGradeReport from './student-grade-report';
import InstructorGradeReport from './instructor-grade-report';
import apiCall from '../shared/apiCall';


class GradeReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userID: props.UserID,
            loaded: false
        };
    }

    componentDidMount() {

    }


    render(){
        return(
            <div>
                <UpdatedGradeReport UserID={this.state.userID}/>
            </div>
        );
    }
}

export default GradeReport;
