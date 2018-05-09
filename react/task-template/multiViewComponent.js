/* This Component is an invisible container holding a bunch of SuperViewComponents
* It is used because there are usually multiple graders, and this Componentshows them side by side
* This is shown after all grades have been submitted.
* NOTE: Will probably need to rework this to make compatible with any task that has mutliple partcipants(number-of_participants > 1),
        since now any task can have multiple partcipants
*/

import React from 'react';
import { TASK_TYPES , TASK_TYPES_TEXT } from '../../server/utils/react_constants';
import ErrorComponent from './errorComponent';
import SuperViewComponent from './superViewComponent';

class MutliViewComponent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            TaskStatus:'',
            Error:false
        };
    }

    componentWillMount(){
        if(!this.props.UsersTaskData){
            this.setState({
                Error: true
            });
        }
        console.log('MutliView Received this data:', this.props.UsersTaskData);

        let tstat = (this.props.TaskStatus != null) ? this.props.TaskStatus : 'Incomplete';
        this.setState({
            TaskStatus: tstat
        });
    }

    render(){
        let gradesView = null;
        let tableStyle = {
            backfaceVisibility: 'hidden'
        };

        if( !this.state.Error){
            gradesView = this.props.UsersTaskData.map(function(task, index){
                let compString = null;

                switch (task.TaskActivity.Type) {
                case TASK_TYPES.CREATE_PROBLEM:
                    compString = this.props.Strings.CreateProblemTitle;
                    break;
                case TASK_TYPES.EDIT:
                    compString = this.props.Strings.EditProblemTitle;
                    break;
                case TASK_TYPES.COMMENT:
                    compString = this.props.Strings.CommentTitle;
                case TASK_TYPES.SOLVE_PROBLEM:
                    compString = this.props.Strings.SolveProblemTitle;
                    break;
                case TASK_TYPES.GRADE_PROBLEM:
                    compString = this.props.Strings.GradeProblemTitle;
                    break;
                case TASK_TYPES.CRITIQUE:
                    compString = this.props.Strings.CritiqueTitle;
                case TASK_TYPES.CONSOLIDATION:
                    compString = this.props.Strings.ConsolidateProblemTitle;
                    break;
                case TASK_TYPES.DISPUTE:
                    compString = this.props.Strings.DisputeGradeTitle;
                    break;
                case TASK_TYPES.RESOLVE_DISPUTE:
                    compString = this.props.Strings.ResolveDisputeTitle;
                    break;
                default:
                    compString = '';
                    break;
                }

                return(
                    <div className="child" key={index +500}>
                        <SuperViewComponent key={index + 2000} index={index+200}
                            ComponentTitle={task.TaskActivity.DisplayName}
                            TaskData={task.Data}
                            Files={task.Files}
                            Instructions={task.TaskActivity.Instructions}
                            Rubric={task.TaskActivity.Rubric}
                            TaskActivityFields={task.TaskActivity.Fields}
                            Strings={this.props.Strings}
                            TaskID={task.TaskInstanceID}
                            showComments={this.props.showComments.bind(this)}
                            Status={task.Status}
                        />
                    </div>
                );
            }, this);
        }

        else{
            return(<ErrorComponent />);
        }

        return(<div>
            <div className="multi-view-container animate fadeInUp">
                {gradesView}
            </div>
        </div>
        );

    }

}
export default MutliViewComponent;
