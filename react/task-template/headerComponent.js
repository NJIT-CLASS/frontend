/* This component holds the task header, which will include the assignment name,
 * course details, and task type. This component is dumb, so it makes no api
 * calls. This component is ALWAYS shown.
 */
import React from 'react';

/*  Props: (from TemplateContainer)
        - AssignmentTitle
        - CourseNumber
        - CourseName
        - SemesterName
        - AssignmentDescription

*/

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return ( <div className="section card-2" >
                  <h2 className = "title template-header" >{this.props.Assignment.DisplayName} </h2>
                    <div className = "section-content section-header" >
                      <div name = "course-title" className = "regular-text" >
                      <b> {this.props.Strings.Course}: </b>{this.props.CourseNumber} - {this.props.CourseName} - {this.props.SemesterName}
                        <div className="assignment-description">{this.props.Assignment.Instructions}</div>
                    </div>
                  </div>
                </div>
        );
    }
}

export default HeaderComponent;
