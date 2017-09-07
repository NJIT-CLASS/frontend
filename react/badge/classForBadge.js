/**
 * Created by Sohail on 7/7/2017.
 * This file will have a dropdown for the user to select the class
 */
import React from 'react';
import apiCall from '../shared/apiCall';

import Tooltip from '../shared/tooltip';
import Select from 'react-select';

class ClassForBadge extends React.Component {
    constructor(props){
        super(props);

        this.state = {studentClasses: []};
        this.onClassChange= this.props.onClassChange.bind(this);
    }

    fetchClassData(nextProps) {
        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        apiCall.get(`/studentCourses/${nextProps.UserID}/${nextProps.SemesterID}`,(err, response, body) => {
            console.log(body);
            this.setState({
                studentClasses: body.courses//List of Courses for the current student from backend (based on semester)
            });
        });
    }

    //Will render the data
    componentWillMount(){
        this.fetchClassData(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchClassData(nextProps);
    };

    render(){
        //get data of class for badge to pass it in the select
        let classList = this.state.studentClasses.filter(klass => klass.Section !== null).map(klass => {

            return {
                value: klass.CourseID,
                label: klass.Number,
                sectionId: klass.SectionID,
            };
        });
        //Select menu for Class for badge
        return (

            <Select
                options={classList}
                value={this.props.CourseID}
                onChange={this.onClassChange}
                clearable={false}
                searchable={false}
                placeholder="Class Number"
            />
        );
    }
}

export default ClassForBadge;
