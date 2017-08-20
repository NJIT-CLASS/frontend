/* This component holds the task header, which will include the assignment name,
 * course details, and task type. This component is dumb, so it makes no api
 * calls. This component is ALWAYS shown.
 */
import React from 'react';
import apiCall from '../shared/apiCall';

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

    componentWillMount() {
      this.props.addCommentListItem('AssignmentInstance', this.props.AssignmentInstanceID, this.props.Assignment.DisplayName);
      this.props.addCommentListItem('WorkflowInstance', this.props.WorkflowInstanceID, this.props.ProblemThreadLabel);
      apiCall.get(`/comments/countOfComments/AssignmentInstance/id/${this.props.AssignmentInstanceID}`, (err, res, body) => {
          let list = [];
          if (!body.Error) {
              let numComments = body.NumberComments;
              this.setState({NumberComments: numComments})
          }
          else {
            console.log('No comment count received.');
          }
      });
    }

    handleCommentClick() {
      this.props.showComments('AssignmentInstance', this.props.AssignmentInstanceID);
    }

    render() {
        return ( <div className="section card-2" >
                  <h2 className = "title template-header" >{this.props.Assignment.DisplayName} </h2>
                    <div className = "section-content section-header" >
            <span className="fa-stack fa-2x" onClick={this.handleCommentClick.bind(this)}>
              <i className="fa fa-comment-o fa-stack-1x"></i>
              <span className="fa fa-stack-1x">
                <span className="comment-number">{this.state.NumberComments}</span>
              </span>
            </span>
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
