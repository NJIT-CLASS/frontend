/**
 * Created by Sohail on 8/1/2017.
 * This file will display the levels on each side of the progress bar.
 */
import React from 'react';
import request from 'request';
import Select from 'react-select';

class CourseForLeaderBoard extends React.Component {
    constructor(props){
        super(props);

        this.state = {studentClasses: []};
        this.onClassChange= this.props.onClassChange.bind(this);
    }

    fetchClassData(nextProps) {
        const fetchOptions = {
            method: 'GET',
            //API to get course list for Achievement Unlock
            uri: this.props.apiUrl + '/api/studentCourses/' + nextProps.UserID + '/'  + nextProps.SemesterID,
            json: true
        };

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptions,(err, response, body) => {
            console.log(body);
            this.setState({
                studentClasses: body.courses//List of courses from database
            })
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
        //Things needed for course dropdown. All coming from Backend
        let classList = this.state.studentClasses.filter(klass => klass.Section !== null).map(klass => {

            return {
                value: klass.CourseID,
                label: klass.Number,
                sectionId: klass.SectionID,
            }

        });

        //Dropdown for course
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

export default CourseForLeaderBoard;