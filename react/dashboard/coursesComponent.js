import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
export default class CoursesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
            
        };
    }
    componentDidMount() {
        this.fetchCourses(this.props.UserID);
    }

    fetchCourses(userId){
        apiCall.get(`/course/getCourses/${userId}`, (err, res, body) => {
            this.setState({
                Courses: body.Courses
            });
        });
    }
    
    render() {
        let {Strings} = this.props;
        let {Courses} = this.state;
        let courseList = null;
        if(Courses.length > 0){
            courseList = Courses.map(course => {
                return <li key={course.CourseID} className="list-group-item">
                    <a href={`/course_page/${course.CourseID}`}>{course.Name}</a>
                </li>;
            });
        } else{
            courseList = <p>{Strings.NoCourses}</p>;
        }
        return (
            <div className="section card-2">
                <h2 className="title">{Strings.CurrentCourses}</h2>
                <div className="section-content">
                    <div className="col-xs-6">
                        <ul class="list-group">
                            {courseList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
} 