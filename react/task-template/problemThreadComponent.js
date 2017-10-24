/* This component holds the problem thread header. This component is dumb, so it makes no api
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

class ProblemThreadComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let strings = {
            TitleText: 'Problem Thread'
        };
        return ( <div className="section card-2" >
                  <h2 className = "title template-header" >{strings.TitleText} </h2>
                  <CommentInfoComponent
                    TargetID = {this.props.WorkflowInstanceID}
                    Target = {'WorkflowInstance'}
                    ComponentTitle = {strings.TitleText}
                    showComments = {this.props.showComments.bind(this)}
                  />
                </div>
        );
    }
}

export default ProblemThreadComponent;
