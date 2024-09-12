/* This component holds the problem thread header. This component is dumb, so it makes no api
 * calls. This component is ALWAYS shown.
 */
import React from 'react';
import CommentInfoComponent from './commentInfoComponent';
import Tooltip from '../shared/tooltip';

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
            <h2 className = "title template-header" ><em>{strings.TitleText}</em><Tooltip style={{display:"inline-block",marginTop:"8%"}} Text={"The problem thread is the entire set of tasks that you see below"} ID={'problem_thread_tooltip'} /></h2>
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
