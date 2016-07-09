/* This component holds the task header, which will include the assignment name,
 * course details, and task type. This component is dumb, so it makes no api
 * calls. This component is ALWAYS shown.
 */
import React from 'react';

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return ( <div className="section animate fadeInUp card-2" >
                  <h2 className = "title" > {this.props.TaskActivityVisualID}: {this.props.AssignmentTitle} </h2>
                    <div className = "section-content section-header animate" >
                      <div name = "course-title" className = "regular-text" >
                      <b> Course: </b>{this.props.CourseNumber} - {this.props.CourseName} - {this.props.SemesterName}
                        <br/>
                        {this.props.AssignmentDescription}
                    </div>
                  </div>
                </div>
        );
    }
}

export default HeaderComponent;
