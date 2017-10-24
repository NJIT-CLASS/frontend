
/* This component holds the task header, which will include the assignment name,
 * course details, and task type. This component is dumb, so it makes no api
 * calls. This component is ALWAYS shown.
 */
import React from 'react';
import CommentInfoComponent from './commentInfoComponent';

/*  Props: (from TemplateContainer)
        - AssignmentTitle
        - CourseNumber
        - CourseName
        - SemesterName
        - AssignmentDescription
        - SectionName

*/

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return ( <div className="section card-2" style={{marginLeft: this.props.margin}}>
            {!this.props.oneBox &&
                  (<div>
                      <h2 className = "title template-header" >{this.props.Assignment.DisplayName} </h2>
                      <CommentInfoComponent
                          TargetID = {this.props.AssignmentInstanceID}
                          Target = {'AssignmentInstance'}
                          ComponentTitle = {this.props.Assignment.DisplayName}
                          showComments = {this.props.showComments.bind(this)}
                      />
                  </div>)}
            <div className = "section-content section-header" >
                <div name = "course-title" className = "regular-text" >
                    <b> {this.props.Strings.Course}: </b>{this.props.CourseNumber} - {this.props.SectionName} - {this.props.CourseName} - {this.props.SemesterName}
                    <div className="assignment-description">{this.props.Assignment.Instructions}</div>
                </div>
            </div>
        </div>
        );
    }
}

export default HeaderComponent;
