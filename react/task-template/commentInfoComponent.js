/* This component will hold the user-made problem.
*  This component is non interactive, so it is only used to display the responses
*  of previous tasks.
*/
import React from 'react';
import apiCall from '../shared/apiCall';
import Tooltip from '../shared/tooltip';

class CommentInfoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        {/* this.props.addCommentListItem(this.props.Target, this.props.TargetID, this.props.ComponentTitle);
      if (this.props.header) {
        this.props.addCommentListItem('WorkflowInstance', this.props.WorkflowInstanceID, this.props.ProblemThreadLabel);
      } */}
        apiCall.get(`/comments/countOfComments/${this.props.Target}/id/${this.props.TargetID}`, (err, res, body) => {
            let list = [];
            if (!body.Error) {
                let numComments = body.NumberComments;
                this.setState({NumberComments: numComments});
            }
            else {
                console.log('No comment count received.');
            }
        });
        apiCall.get(`/comments/countOfFlags/${this.props.Target}/id/${this.props.TargetID}`, (err, res, body) => {
            let list = [];
            if (!body.Error) {
                let numFlags = body.NumberComments;
                this.setState({NumberFlags: numFlags});
            }
            else {
                console.log('No comment count received.');
            }
        });
        apiCall.get(`/comments/aveRating/comment/${this.props.Target}/id/${this.props.TargetID}`, (err, res, body) => {
            let list = [];
            if (!body.Error) {
                let aveRating5 = Math.round(body.AveRating * 2) / 2;
                let aveRating1 = Math.round(body.AveRating * 10) / 10;
                let numRatings = body.NumRatings;
                this.setState({AveRating5: aveRating5, AveRating1: aveRating1, NumRatings: numRatings});
            }
            else {
                console.log('No comment average rating received.');
            }
        });
    }

    handleCommentClick() {
        this.props.showComments(this.props.Target, this.props.TargetID, 1);
    }

    render() {
        let starIcons = [];
        for (let i = this.state.AveRating5; i > (this.state.AveRating5 - 5); i--) {
            if ((i-1) >= 0) {
                starIcons.push(<i className="fa fa-star"></i>);
            }
            else if ((i-0.5) >= 0) {
                starIcons.push(<i className="fa fa-star-half-o"></i>);
            }
            else {
                starIcons.push(<i className="fa fa-star-o"></i>);
            }
        }
        let strings = {
            TooltipA: 'Average rating of ',
            TooltipB: ' based on ',
            TooltipC: (this.state.NumRatings === 1) ? ' rating' : ' ratings'
        };
        return (
            <div >
                <span className="fa-stack fa-2x" onClick={this.handleCommentClick.bind(this)}>
                    <i className="fa fa-comment-o  fa-stack-1x"></i>
                    <span className="fa fa-stack-1x">
                        <span className="comment-number">{this.state.NumberComments}</span>
                    </span>
                </span>
                <span className="fa-stack fa-2x" onClick={this.handleCommentClick.bind(this)}>
                    <i className="fa fa-flag-o fa-stack-1x"></i>
                    <span className="fa fa-stack-1x">
                        <span className = "comment-number" style={{marginTop: -3}}>{this.state.NumberFlags}</span>
                    </span>
                </span>
                <div style={{whiteSpace: 'nowrap', display: 'inline'}}>{starIcons}</div>
                <Tooltip Text={strings.TooltipA.concat(this.state.AveRating1).concat(strings.TooltipB).concat(this.state.NumRatings).concat(strings.TooltipC)}/>
            </div>
        );
    }

}

export default CommentInfoComponent;